import { ManageFavoritesUseCaseImpl } from '../ManageFavoritesUseCaseImpl';
import { UserRepository } from '../../../../domain/repositories/UserRepository';

// Mock repository
const mockUserRepository: jest.Mocked<UserRepository> = {
  getUserProfile: jest.fn(),
  createUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  addFavoritePoint: jest.fn(),
  removeFavoritePoint: jest.fn(),
  getFavoritePointIds: jest.fn(),
  addVisitedPoint: jest.fn(),
  removeVisitedPoint: jest.fn(),
};

describe('ManageFavoritesUseCaseImpl', () => {
  let useCase: ManageFavoritesUseCaseImpl;

  beforeEach(() => {
    useCase = new ManageFavoritesUseCaseImpl(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('add action', () => {
    it('should add point to favorites when not already present', async () => {
      mockUserRepository.getFavoritePointIds.mockResolvedValue(['point1']);

      await useCase.execute({
        userId: 'user1',
        pointId: 'point2',
        action: 'add',
      });

      expect(mockUserRepository.addFavoritePoint).toHaveBeenCalledWith('user1', 'point2');
    });

    it('should not add point to favorites when already present', async () => {
      mockUserRepository.getFavoritePointIds.mockResolvedValue(['point1', 'point2']);

      await useCase.execute({
        userId: 'user1',
        pointId: 'point2',
        action: 'add',
      });

      expect(mockUserRepository.addFavoritePoint).not.toHaveBeenCalled();
    });
  });

  describe('remove action', () => {
    it('should remove point from favorites', async () => {
      await useCase.execute({
        userId: 'user1',
        pointId: 'point2',
        action: 'remove',
      });

      expect(mockUserRepository.removeFavoritePoint).toHaveBeenCalledWith('user1', 'point2');
    });
  });

  describe('toggle action', () => {
    it('should add point when not in favorites', async () => {
      mockUserRepository.getFavoritePointIds.mockResolvedValue(['point1']);

      await useCase.execute({
        userId: 'user1',
        pointId: 'point2',
        action: 'toggle',
      });

      expect(mockUserRepository.addFavoritePoint).toHaveBeenCalledWith('user1', 'point2');
    });

    it('should remove point when already in favorites', async () => {
      mockUserRepository.getFavoritePointIds.mockResolvedValue(['point1', 'point2']);

      await useCase.execute({
        userId: 'user1',
        pointId: 'point2',
        action: 'toggle',
      });

      expect(mockUserRepository.removeFavoritePoint).toHaveBeenCalledWith('user1', 'point2');
    });
  });

  describe('validation', () => {
    it('should throw error for invalid userId', async () => {
      await expect(useCase.execute({
        userId: '',
        pointId: 'point1',
        action: 'add',
      })).rejects.toThrow('Valid userId is required');
    });

    it('should throw error for invalid pointId', async () => {
      await expect(useCase.execute({
        userId: 'user1',
        pointId: '',
        action: 'add',
      })).rejects.toThrow('Valid pointId is required');
    });

    it('should throw error for invalid action', async () => {
      await expect(useCase.execute({
        userId: 'user1',
        pointId: 'point1',
        action: 'invalid' as any,
      })).rejects.toThrow('Valid action (add, remove, toggle) is required');
    });
  });

  describe('error handling', () => {
    it('should handle repository errors', async () => {
      const error = new Error('Repository error');
      mockUserRepository.getFavoritePointIds.mockRejectedValue(error);

      await expect(useCase.execute({
        userId: 'user1',
        pointId: 'point1',
        action: 'add',
      })).rejects.toThrow('Failed to manage favorites');
    });
  });
});