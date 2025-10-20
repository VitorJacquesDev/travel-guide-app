import { 
  ManageFavoritesUseCase, 
  ManageFavoritesParams, 
  ToggleFavoriteParams, 
  GetFavoritesParams 
} from '../../../domain/usecases/favorites/ManageFavoritesUseCase';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { PointOfInterestRepository } from '../../../domain/repositories/PointOfInterestRepository';
import { PointOfInterest } from '../../../domain/models/PointOfInterest';
import { auth } from '../../../core/config/firebase';

/**
 * Implementation of ManageFavoritesUseCase
 * Handles adding and removing points from user's favorites
 */
export class ManageFavoritesUseCaseImpl implements ManageFavoritesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly pointOfInterestRepository?: PointOfInterestRepository
  ) {}

  async execute(params: ManageFavoritesParams): Promise<void> {
    try {
      this.validateParams(params);

      const { userId, pointId, action } = params;

      switch (action) {
        case 'add':
          await this.addToFavorites({ pointId });
          break;
        case 'remove':
          await this.removeFromFavorites({ pointId });
          break;
        case 'toggle':
          await this.toggleFavorite({ pointId });
          break;
        default:
          throw new Error(`Invalid action: ${action}`);
      }
    } catch (error) {
      console.error('Error in ManageFavoritesUseCase:', error);
      throw new Error('Failed to manage favorites');
    }
  }

  async toggleFavorite(params: ToggleFavoriteParams): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      const { pointId } = params;
      
      const favoriteIds = await this.userRepository.getFavorites(userId);
      
      if (favoriteIds.includes(pointId)) {
        await this.userRepository.removeFromFavorites(userId, pointId);
      } else {
        await this.userRepository.addToFavorites(userId, pointId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Failed to toggle favorite');
    }
  }

  async addToFavorites(params: ToggleFavoriteParams): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      const { pointId } = params;
      
      // Check if already in favorites to avoid duplicates
      const favoriteIds = await this.userRepository.getFavorites(userId);
      
      if (!favoriteIds.includes(pointId)) {
        await this.userRepository.addToFavorites(userId, pointId);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw new Error('Failed to add to favorites');
    }
  }

  async removeFromFavorites(params: ToggleFavoriteParams): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      const { pointId } = params;
      
      await this.userRepository.removeFromFavorites(userId, pointId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw new Error('Failed to remove from favorites');
    }
  }

  async getFavorites(params: GetFavoritesParams): Promise<readonly PointOfInterest[]> {
    try {
      const userId = params.userId || this.getCurrentUserId();
      const favoriteIds = await this.userRepository.getFavorites(userId);
      
      if (!this.pointOfInterestRepository || favoriteIds.length === 0) {
        return [];
      }

      // Get full point details for each favorite
      const favoritePoints: PointOfInterest[] = [];
      for (const pointId of favoriteIds) {
        const point = await this.pointOfInterestRepository.getById(pointId);
        if (point) {
          favoritePoints.push(point);
        }
      }
      
      return favoritePoints;
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw new Error('Failed to get favorites');
    }
  }

  async isFavorite(params: ToggleFavoriteParams): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();
      const { pointId } = params;
      
      return await this.userRepository.isFavorite(userId, pointId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  }

  private getCurrentUserId(): string {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return currentUser.uid;
  }

  private validateParams(params: ManageFavoritesParams): void {
    if (!params.userId || typeof params.userId !== 'string') {
      throw new Error('Valid userId is required');
    }

    if (!params.pointId || typeof params.pointId !== 'string') {
      throw new Error('Valid pointId is required');
    }

    if (!params.action || !['add', 'remove', 'toggle'].includes(params.action)) {
      throw new Error('Valid action (add, remove, toggle) is required');
    }
  }
}