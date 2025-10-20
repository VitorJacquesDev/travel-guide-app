import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../../core/config/firebase';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserProfile } from '../../domain/models/UserProfile';

/**
 * Firebase implementation of UserRepository
 */
export class FirebaseUserRepository implements UserRepository {
  private readonly collectionName = 'users';

  /**
   * Convert Firestore document to UserProfile domain model
   */
  private documentToUserProfile(id: string, data: any): UserProfile {
    return {
      id,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      preferences: {
        favoriteCategories: data.preferences?.favoriteCategories || [],
        priceRange: data.preferences?.priceRange || 'medium',
        maxDistance: data.preferences?.maxDistance || 50,
        language: data.preferences?.language || 'pt',
        theme: data.preferences?.theme || 'system',
        notifications: {
          recommendations: data.preferences?.notifications?.recommendations ?? true,
          favorites: data.preferences?.notifications?.favorites ?? true,
          updates: data.preferences?.notifications?.updates ?? true,
        },
      },
      favoritePointIds: data.favoritePointIds || [],
      visitedPointIds: data.visitedPointIds || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, this.collectionName, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.documentToUserProfile(userId, docSnap.data());
      }

      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  }

  async createUserProfile(userProfile: UserProfile): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, userProfile.id);
      
      const userData = {
        email: userProfile.email,
        displayName: userProfile.displayName,
        photoURL: userProfile.photoURL,
        preferences: userProfile.preferences,
        favoritePointIds: userProfile.favoritePointIds,
        visitedPointIds: userProfile.visitedPointIds,
        createdAt: userProfile.createdAt,
        updatedAt: new Date(),
      };

      await setDoc(docRef, userData);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, userId);
      
      const updateData: any = {
        ...updates,
        updatedAt: new Date(),
      };

      // Remove id from updates if present
      delete updateData.id;

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  async addFavoritePoint(userId: string, pointId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, userId);
      
      await updateDoc(docRef, {
        favoritePointIds: arrayUnion(pointId),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding favorite point:', error);
      throw new Error('Failed to add favorite point');
    }
  }

  async removeFavoritePoint(userId: string, pointId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, userId);
      
      await updateDoc(docRef, {
        favoritePointIds: arrayRemove(pointId),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error removing favorite point:', error);
      throw new Error('Failed to remove favorite point');
    }
  }

  async getFavoritePointIds(userId: string): Promise<readonly string[]> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile?.favoritePointIds || [];
    } catch (error) {
      console.error('Error getting favorite point IDs:', error);
      throw new Error('Failed to get favorite point IDs');
    }
  }

  async addVisitedPoint(userId: string, pointId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, userId);
      
      await updateDoc(docRef, {
        visitedPointIds: arrayUnion(pointId),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding visited point:', error);
      throw new Error('Failed to add visited point');
    }
  }

  async removeVisitedPoint(userId: string, pointId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, userId);
      
      await updateDoc(docRef, {
        visitedPointIds: arrayRemove(pointId),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error removing visited point:', error);
      throw new Error('Failed to remove visited point');
    }
  }

  /**
   * Subscribe to real-time updates of user profile
   */
  subscribeToUserProfile(
    userId: string, 
    callback: (profile: UserProfile | null) => void
  ): Unsubscribe {
    const docRef = doc(db, this.collectionName, userId);
    
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const profile = this.documentToUserProfile(userId, docSnap.data());
          callback(profile);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error in user profile subscription:', error);
        callback(null);
      }
    );
  }

  /**
   * Subscribe to real-time updates of favorite points
   */
  subscribeToFavorites(
    userId: string, 
    callback: (favoriteIds: readonly string[]) => void
  ): Unsubscribe {
    const docRef = doc(db, this.collectionName, userId);
    
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          callback(data.favoritePointIds || []);
        } else {
          callback([]);
        }
      },
      (error) => {
        console.error('Error in favorites subscription:', error);
        callback([]);
      }
    );
  }
}