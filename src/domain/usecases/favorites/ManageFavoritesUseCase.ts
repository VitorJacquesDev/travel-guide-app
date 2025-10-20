import { PointOfInterest } from '../../models/PointOfInterest';

/**
 * Parameters for adding/removing favorites
 */
export interface ToggleFavoriteParams {
  readonly pointId: string;
}

/**
 * Parameters for getting user favorites
 */
export interface GetFavoritesParams {
  readonly userId?: string; // Optional, defaults to current user
}

/**
 * Parameters for managing favorites (legacy compatibility)
 */
export interface ManageFavoritesParams {
  readonly userId: string;
  readonly pointId: string;
  readonly action: 'add' | 'remove' | 'toggle';
}

/**
 * Use case for managing user favorites
 * Handles adding, removing, and retrieving favorite points of interest
 */
export interface ManageFavoritesUseCase {
  /**
   * Toggle a point of interest in user's favorites
   * @param params Parameters containing point ID to toggle
   * @returns Promise resolving when the operation completes
   */
  toggleFavorite(params: ToggleFavoriteParams): Promise<void>;

  /**
   * Add a point of interest to user's favorites
   * @param params Parameters containing point ID to add
   * @returns Promise resolving when the operation completes
   */
  addToFavorites(params: ToggleFavoriteParams): Promise<void>;

  /**
   * Remove a point of interest from user's favorites
   * @param params Parameters containing point ID to remove
   * @returns Promise resolving when the operation completes
   */
  removeFromFavorites(params: ToggleFavoriteParams): Promise<void>;

  /**
   * Get user's favorite points of interest
   * @param params Parameters for getting favorites
   * @returns Promise resolving to array of favorite points
   */
  getFavorites(params: GetFavoritesParams): Promise<readonly PointOfInterest[]>;

  /**
   * Check if a point is in user's favorites
   * @param params Parameters containing point ID to check
   * @returns Promise resolving to boolean indicating if point is favorited
   */
  isFavorite(params: ToggleFavoriteParams): Promise<boolean>;
}