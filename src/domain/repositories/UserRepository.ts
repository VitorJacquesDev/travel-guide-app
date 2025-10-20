import { UserProfile, UserPreferences } from '../models/UserProfile';

/**
 * Repository interface for User data access
 * Defines the contract for user profile persistence and management operations
 */
export interface UserRepository {
  /**
   * Get the current authenticated user's profile
   * @returns Promise resolving to user profile or null if not found
   */
  getCurrentUser(): Promise<UserProfile | null>;

  /**
   * Get a user profile by ID
   * @param userId Unique identifier of the user
   * @returns Promise resolving to user profile or null if not found
   */
  getUserById(userId: string): Promise<UserProfile | null>;

  /**
   * Create a new user profile
   * @param userProfile User profile data to create
   * @returns Promise resolving when the operation completes
   */
  createUserProfile(userProfile: UserProfile): Promise<void>;

  /**
   * Update user profile information
   * @param userId User ID to update
   * @param updates Partial user profile data to update
   * @returns Promise resolving when the operation completes
   */
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void>;

  /**
   * Update user preferences
   * @param userId User ID to update
   * @param preferences New user preferences
   * @returns Promise resolving when the operation completes
   */
  updateUserPreferences(userId: string, preferences: UserPreferences): Promise<void>;

  /**
   * Add a point of interest to user's favorites
   * @param userId User ID
   * @param pointId Point of interest ID to add
   * @returns Promise resolving when the operation completes
   */
  addToFavorites(userId: string, pointId: string): Promise<void>;

  /**
   * Remove a point of interest from user's favorites
   * @param userId User ID
   * @param pointId Point of interest ID to remove
   * @returns Promise resolving when the operation completes
   */
  removeFromFavorites(userId: string, pointId: string): Promise<void>;

  /**
   * Get user's favorite points of interest
   * @param userId User ID
   * @returns Promise resolving to array of favorite point IDs
   */
  getFavorites(userId: string): Promise<readonly string[]>;

  /**
   * Add a point of interest to user's visited places
   * @param userId User ID
   * @param pointId Point of interest ID to add
   * @returns Promise resolving when the operation completes
   */
  addToVisitedPlaces(userId: string, pointId: string): Promise<void>;

  /**
   * Get user's visited places
   * @param userId User ID
   * @returns Promise resolving to array of visited point IDs
   */
  getVisitedPlaces(userId: string): Promise<readonly string[]>;

  /**
   * Delete user profile and all associated data
   * @param userId User ID to delete
   * @returns Promise resolving when the operation completes
   */
  deleteUserProfile(userId: string): Promise<void>;

  /**
   * Check if a point is in user's favorites
   * @param userId User ID
   * @param pointId Point of interest ID to check
   * @returns Promise resolving to boolean indicating if point is favorited
   */
  isFavorite(userId: string, pointId: string): Promise<boolean>;

  /**
   * Check if a point has been visited by the user
   * @param userId User ID
   * @param pointId Point of interest ID to check
   * @returns Promise resolving to boolean indicating if point was visited
   */
  isVisited(userId: string, pointId: string): Promise<boolean>;
}