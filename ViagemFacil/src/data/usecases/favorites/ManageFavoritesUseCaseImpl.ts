import { ManageFavoritesUseCase, ManageFavoritesParams } from '../../../domain/usecases/favorites/ManageFavoritesUseCase';
import { UserRepository } from '../../../domain/repositories/UserRepository';

/**
 * Implementation of ManageFavoritesUseCase
 * Handles adding and removing points from user's favorites
 */
export class ManageFavoritesUseCaseImpl implements ManageFavoritesUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(params: ManageFavoritesParams): Promise<void> {
    try {
      this.validateParams(params);

      const { userId, pointId, action } = params;

      switch (action) {
        case 'add':
          await this.addToFavorites(userId, pointId);
          break;
        case 'remove':
          await this.removeFromFavorites(userId, pointId);
          break;
        case 'toggle':
          await this.toggleFavorite(userId, pointId);
          break;
        default:
          throw new Error(`Invalid action: ${action}`);
      }
    } catch (error) {
      console.error('Error in ManageFavoritesUseCase:', error);
      throw new Error('Failed to manage favorites');
    }
  }

  private async addToFavorites(userId: string, pointId: string): Promise<void> {
    // Check if already in favorites to avoid duplicates
    const favoriteIds = await this.userRepository.getFavoritePointIds(userId);
    
    if (!favoriteIds.includes(pointId)) {
      await this.userRepository.addFavoritePoint(userId, pointId);
    }
  }

  private async removeFromFavorites(userId: string, pointId: string): Promise<void> {
    await this.userRepository.removeFavoritePoint(userId, pointId);
  }

  private async toggleFavorite(userId: string, pointId: string): Promise<void> {
    const favoriteIds = await this.userRepository.getFavoritePointIds(userId);
    
    if (favoriteIds.includes(pointId)) {
      await this.removeFromFavorites(userId, pointId);
    } else {
      await this.addToFavorites(userId, pointId);
    }
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