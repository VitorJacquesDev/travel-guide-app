import { PointOfInterest, Coordinates, Category, PriceRange } from '../models/PointOfInterest';

/**
 * Search query parameters for filtering points of interest
 */
export interface SearchQuery {
  readonly query?: string; // Text search in name, description, tags
  readonly categories?: readonly Category[];
  readonly priceRanges?: readonly PriceRange[];
  readonly minRating?: number;
  readonly maxDistance?: number; // In kilometers
  readonly location?: Coordinates;
  readonly limit?: number;
  readonly offset?: number;
}

/**
 * Search result with pagination information
 */
export interface SearchResult {
  readonly points: readonly PointOfInterest[];
  readonly total: number;
  readonly hasMore: boolean;
}

/**
 * Repository interface for Point of Interest data access
 * Defines the contract for data persistence and retrieval operations
 */
export interface PointOfInterestRepository {
  /**
   * Get personalized recommendations based on user location and preferences
   * @param location Optional user location for distance-based recommendations
   * @param limit Maximum number of recommendations to return
   * @returns Promise resolving to array of recommended points
   */
  getRecommendations(location?: Coordinates, limit?: number): Promise<readonly PointOfInterest[]>;

  /**
   * Search points of interest with filtering and pagination
   * @param query Search parameters and filters
   * @returns Promise resolving to search results with pagination info
   */
  searchPoints(query: SearchQuery): Promise<SearchResult>;

  /**
   * Get a specific point of interest by ID
   * @param id Unique identifier of the point
   * @returns Promise resolving to the point or null if not found
   */
  getPointById(id: string): Promise<PointOfInterest | null>;

  /**
   * Get points of interest within a specified radius of a location
   * @param location Center coordinates for the search
   * @param radiusKm Search radius in kilometers
   * @param limit Maximum number of points to return
   * @returns Promise resolving to array of nearby points
   */
  getNearbyPoints(
    location: Coordinates, 
    radiusKm: number, 
    limit?: number
  ): Promise<readonly PointOfInterest[]>;

  /**
   * Get points of interest by category
   * @param category Category to filter by
   * @param limit Maximum number of points to return
   * @returns Promise resolving to array of points in the category
   */
  getPointsByCategory(category: Category, limit?: number): Promise<readonly PointOfInterest[]>;

  /**
   * Get multiple points of interest by their IDs
   * @param ids Array of point IDs to retrieve
   * @returns Promise resolving to array of found points
   */
  getPointsByIds(ids: readonly string[]): Promise<readonly PointOfInterest[]>;

  /**
   * Get popular points of interest based on ratings and user activity
   * @param limit Maximum number of points to return
   * @returns Promise resolving to array of popular points
   */
  getPopularPoints(limit?: number): Promise<readonly PointOfInterest[]>;
}