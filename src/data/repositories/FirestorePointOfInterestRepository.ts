import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  startAfter,
  QueryDocumentSnapshot,
  GeoPoint,
} from 'firebase/firestore';
import { db } from '../../core/config/firebase';
import { 
  PointOfInterestRepository, 
  SearchQuery, 
  SearchResult 
} from '../../domain/repositories/PointOfInterestRepository';
import { PointOfInterest, Coordinates, Category, PriceRange } from '../../domain/models/PointOfInterest';

/**
 * Firestore implementation of PointOfInterestRepository
 */
export class FirestorePointOfInterestRepository implements PointOfInterestRepository {
  private readonly collectionName = 'points_of_interest';

  /**
   * Convert Firestore document to PointOfInterest domain model
   */
  private documentToPointOfInterest(doc: QueryDocumentSnapshot): PointOfInterest {
    const data = doc.data();
    const location = data.location as GeoPoint;
    
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      category: data.category as Category,
      rating: data.rating,
      priceRange: data.priceRange as PriceRange,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
      },
      imageUrl: data.imageUrl,
      openingHours: data.openingHours,
      amenities: data.amenities || [],
      tags: data.tags || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) * 
      Math.cos(this.toRadians(coord2.latitude)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async getRecommendations(location?: Coordinates, limit = 10): Promise<readonly PointOfInterest[]> {
    try {
      const pointsRef = collection(db, this.collectionName);
      
      // Get popular points with high ratings
      const q = query(
        pointsRef,
        where('rating', '>=', 4.0),
        orderBy('rating', 'desc'),
        firestoreLimit(limit * 2) // Get more to filter by distance if location provided
      );

      const querySnapshot = await getDocs(q);
      let points = querySnapshot.docs.map(doc => this.documentToPointOfInterest(doc));

      // If location is provided, sort by distance and apply distance filter
      if (location) {
        points = points
          .map(point => ({
            ...point,
            distance: this.calculateDistance(location, point.location),
          }))
          .filter(point => point.distance <= 50) // Within 50km
          .sort((a, b) => a.distance - b.distance)
          .slice(0, limit)
          .map(({ distance, ...point }) => point); // Remove distance property
      } else {
        points = points.slice(0, limit);
      }

      return points;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  async searchPoints(searchQuery: SearchQuery): Promise<SearchResult> {
    try {
      const pointsRef = collection(db, this.collectionName);
      let q = query(pointsRef);

      // Apply category filter
      if (searchQuery.categories && searchQuery.categories.length > 0) {
        q = query(q, where('category', 'in', searchQuery.categories));
      }

      // Apply price range filter
      if (searchQuery.priceRanges && searchQuery.priceRanges.length > 0) {
        q = query(q, where('priceRange', 'in', searchQuery.priceRanges));
      }

      // Apply minimum rating filter
      if (searchQuery.minRating) {
        q = query(q, where('rating', '>=', searchQuery.minRating));
      }

      // Apply ordering and limit
      q = query(q, orderBy('rating', 'desc'));
      
      if (searchQuery.limit) {
        q = query(q, firestoreLimit(searchQuery.limit));
      }

      const querySnapshot = await getDocs(q);
      let points = querySnapshot.docs.map(doc => this.documentToPointOfInterest(doc));

      // Apply text search filter (client-side for now)
      if (searchQuery.query) {
        const searchTerm = searchQuery.query.toLowerCase();
        points = points.filter(point => 
          point.name.toLowerCase().includes(searchTerm) ||
          point.description.toLowerCase().includes(searchTerm) ||
          point.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Apply distance filter if location is provided
      if (searchQuery.location && searchQuery.maxDistance) {
        points = points.filter(point => 
          this.calculateDistance(searchQuery.location!, point.location) <= searchQuery.maxDistance!
        );
      }

      // Apply pagination
      const offset = searchQuery.offset || 0;
      const limit = searchQuery.limit || 20;
      const total = points.length;
      const paginatedPoints = points.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      return {
        points: paginatedPoints,
        total,
        hasMore,
      };
    } catch (error) {
      console.error('Error searching points:', error);
      throw new Error('Failed to search points');
    }
  }

  async getPointById(id: string): Promise<PointOfInterest | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.documentToPointOfInterest(docSnap as QueryDocumentSnapshot);
      }

      return null;
    } catch (error) {
      console.error('Error getting point by ID:', error);
      throw new Error('Failed to get point');
    }
  }

  async getNearbyPoints(
    location: Coordinates, 
    radiusKm: number, 
    limit = 20
  ): Promise<readonly PointOfInterest[]> {
    try {
      const pointsRef = collection(db, this.collectionName);
      
      // For now, get all points and filter by distance (not optimal for large datasets)
      // In production, you'd want to use geohash or Firestore's geoqueries
      const q = query(pointsRef, firestoreLimit(100));
      const querySnapshot = await getDocs(q);
      
      const points = querySnapshot.docs
        .map(doc => this.documentToPointOfInterest(doc))
        .filter(point => this.calculateDistance(location, point.location) <= radiusKm)
        .sort((a, b) => 
          this.calculateDistance(location, a.location) - 
          this.calculateDistance(location, b.location)
        )
        .slice(0, limit);

      return points;
    } catch (error) {
      console.error('Error getting nearby points:', error);
      throw new Error('Failed to get nearby points');
    }
  }

  async getPointsByCategory(category: Category, limit = 20): Promise<readonly PointOfInterest[]> {
    try {
      const pointsRef = collection(db, this.collectionName);
      const q = query(
        pointsRef,
        where('category', '==', category),
        orderBy('rating', 'desc'),
        firestoreLimit(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.documentToPointOfInterest(doc));
    } catch (error) {
      console.error('Error getting points by category:', error);
      throw new Error('Failed to get points by category');
    }
  }

  async getPointsByIds(ids: readonly string[]): Promise<readonly PointOfInterest[]> {
    try {
      if (ids.length === 0) return [];

      const points: PointOfInterest[] = [];
      
      // Firestore 'in' queries are limited to 10 items, so we need to batch
      const batches = [];
      for (let i = 0; i < ids.length; i += 10) {
        batches.push(ids.slice(i, i + 10));
      }

      for (const batch of batches) {
        const pointsRef = collection(db, this.collectionName);
        const q = query(pointsRef, where('__name__', 'in', batch));
        const querySnapshot = await getDocs(q);
        
        points.push(...querySnapshot.docs.map(doc => this.documentToPointOfInterest(doc)));
      }

      return points;
    } catch (error) {
      console.error('Error getting points by IDs:', error);
      throw new Error('Failed to get points by IDs');
    }
  }

  async getPopularPoints(limit = 20): Promise<readonly PointOfInterest[]> {
    try {
      const pointsRef = collection(db, this.collectionName);
      const q = query(
        pointsRef,
        where('rating', '>=', 4.0),
        orderBy('rating', 'desc'),
        firestoreLimit(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.documentToPointOfInterest(doc));
    } catch (error) {
      console.error('Error getting popular points:', error);
      throw new Error('Failed to get popular points');
    }
  }
}