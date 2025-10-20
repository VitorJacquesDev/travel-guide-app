import { FirebaseUserRepository } from '../FirebaseUserRepository';
import { UserProfile } from '../../../domain/models/UserProfile';

// Mock Firebase
jest.mock('../../../core/config/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
  onSnapshot: jest.fn(),
}));

describe('FirebaseUserRepository', () => {
  let repository: FirebaseUserRepository;

  beforeEach(() => {
    repository = new FirebaseUserRepository();
    jest.clearAllMocks();
  });

  describe('documentToUserProfile', () => {
    it('should convert Firestore document to UserProfile', () => {
      const mockData = {
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        preferences: {
          favoriteCategories: ['nature'],
          priceRange: 'medium',
          maxDistance: 50,
          language: 'pt',
          theme: 'system',
          notifications: {
            recommendations: true,
            favorites: true,
            updates: true,
          },
        },
        favoritePointIds: ['point1', 'point2'],
        visitedPointIds: ['point3'],
        createdAt: { toDate: () => new Date('2023-01-01') },
        updatedAt: { toDate: () => new Date('2023-01-02') },
      };

      const result = (repository as any).documentToUserProfile('user123', mockData);

      expect(result).toEqual({
        id: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        preferences: {
          favoriteCategories: ['nature'],
          priceRange: 'medium',
          maxDistance: 50,
          language: 'pt',
          theme: 'system',
          notifications: {
            recommendations: true,
            favorites: true,
            updates: true,
          },
        },
        favoritePointIds: ['point1', 'point2'],
        visitedPointIds: ['point3'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });
    });

    it('should handle missing optional fields', () => {
      const mockData = {
        email: 'test@example.com',
        displayName: 'Test User',
      };

      const result = (repository as any).documentToUserProfile('user123', mockData);

      expect(result.preferences.favoriteCategories).toEqual([]);
      expect(result.preferences.priceRange).toBe('medium');
      expect(result.preferences.notifications.recommendations).toBe(true);
      expect(result.favoritePointIds).toEqual([]);
      expect(result.visitedPointIds).toEqual([]);
    });
  });

  describe('addFavoritePoint', () => {
    it('should call updateDoc with arrayUnion', async () => {
      const { updateDoc, arrayUnion } = require('firebase/firestore');
      
      await repository.addFavoritePoint('user123', 'point456');

      expect(updateDoc).toHaveBeenCalled();
      expect(arrayUnion).toHaveBeenCalledWith('point456');
    });
  });

  describe('removeFavoritePoint', () => {
    it('should call updateDoc with arrayRemove', async () => {
      const { updateDoc, arrayRemove } = require('firebase/firestore');
      
      await repository.removeFavoritePoint('user123', 'point456');

      expect(updateDoc).toHaveBeenCalled();
      expect(arrayRemove).toHaveBeenCalledWith('point456');
    });
  });

  describe('subscribeToFavorites', () => {
    it('should set up onSnapshot listener', () => {
      const { onSnapshot } = require('firebase/firestore');
      const callback = jest.fn();

      repository.subscribeToFavorites('user123', callback);

      expect(onSnapshot).toHaveBeenCalled();
    });
  });
});