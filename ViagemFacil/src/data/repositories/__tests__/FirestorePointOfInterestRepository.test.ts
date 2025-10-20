import { FirestorePointOfInterestRepository } from '../FirestorePointOfInterestRepository';
import { Category, PriceRange } from '../../../domain/models/PointOfInterest';

// Mock Firebase
jest.mock('../../../core/config/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  GeoPoint: jest.fn(),
}));

describe('FirestorePointOfInterestRepository', () => {
  let repository: FirestorePointOfInterestRepository;

  beforeEach(() => {
    repository = new FirestorePointOfInterestRepository();
    jest.clearAllMocks();
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      // Access private method for testing
      const distance = (repository as any).calculateDistance(
        { latitude: -23.5505, longitude: -46.6333 }, // São Paulo
        { latitude: -22.9068, longitude: -43.1729 }  // Rio de Janeiro
      );

      // Distance between São Paulo and Rio de Janeiro is approximately 357 km
      expect(distance).toBeGreaterThan(350);
      expect(distance).toBeLessThan(400);
    });

    it('should return 0 for same coordinates', () => {
      const distance = (repository as any).calculateDistance(
        { latitude: -23.5505, longitude: -46.6333 },
        { latitude: -23.5505, longitude: -46.6333 }
      );

      expect(distance).toBe(0);
    });
  });

  describe('documentToPointOfInterest', () => {
    it('should convert Firestore document to PointOfInterest', () => {
      const mockDoc = {
        id: 'test-id',
        data: () => ({
          name: 'Test Point',
          description: 'Test Description',
          category: 'nature' as Category,
          rating: 4.5,
          priceRange: 'medium' as PriceRange,
          location: { latitude: -23.5505, longitude: -46.6333 },
          address: 'Test Address',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
          imageUrl: 'https://example.com/image.jpg',
          openingHours: {},
          amenities: ['parking'],
          tags: ['nature'],
          createdAt: { toDate: () => new Date('2023-01-01') },
          updatedAt: { toDate: () => new Date('2023-01-01') },
        }),
      };

      const result = (repository as any).documentToPointOfInterest(mockDoc);

      expect(result).toEqual({
        id: 'test-id',
        name: 'Test Point',
        description: 'Test Description',
        category: 'nature',
        rating: 4.5,
        priceRange: 'medium',
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          address: 'Test Address',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
        },
        imageUrl: 'https://example.com/image.jpg',
        openingHours: {},
        amenities: ['parking'],
        tags: ['nature'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      });
    });
  });

  // Note: Full integration tests would require Firebase emulator
  // These tests focus on the business logic and data transformation
});