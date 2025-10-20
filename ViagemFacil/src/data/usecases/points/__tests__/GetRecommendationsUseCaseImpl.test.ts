import { GetRecommendationsUseCaseImpl } from '../GetRecommendationsUseCaseImpl';
import { PointOfInterestRepository } from '../../../../domain/repositories/PointOfInterestRepository';
import { PointOfInterest } from '../../../../domain/models/PointOfInterest';

// Mock repository
const mockRepository: jest.Mocked<PointOfInterestRepository> = {
  getRecommendations: jest.fn(),
  searchPoints: jest.fn(),
  getPointById: jest.fn(),
  getNearbyPoints: jest.fn(),
  getPointsByCategory: jest.fn(),
  getPointsByIds: jest.fn(),
  getPopularPoints: jest.fn(),
};

// Mock data
const mockPoints: PointOfInterest[] = [
  {
    id: '1',
    name: 'Test Point 1',
    description: 'Description 1',
    category: 'nature',
    rating: 4.5,
    priceRange: 'medium',
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      address: 'Test Address 1',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
    },
    imageUrl: 'https://example.com/image1.jpg',
    openingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '10:00', close: '16:00' },
    },
    amenities: ['parking', 'wifi'],
    tags: ['nature', 'hiking'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Test Point 2',
    description: 'Description 2',
    category: 'museum',
    rating: 4.2,
    priceRange: 'low',
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      address: 'Test Address 2',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
    },
    imageUrl: 'https://example.com/image2.jpg',
    openingHours: {
      monday: { open: '10:00', close: '17:00' },
      tuesday: { open: '10:00', close: '17:00' },
      wednesday: { open: '10:00', close: '17:00' },
      thursday: { open: '10:00', close: '17:00' },
      friday: { open: '10:00', close: '17:00' },
      saturday: { open: '10:00', close: '17:00' },
      sunday: { open: '10:00', close: '17:00' },
    },
    amenities: ['cafe', 'gift_shop'],
    tags: ['art', 'culture'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('GetRecommendationsUseCaseImpl', () => {
  let useCase: GetRecommendationsUseCaseImpl;

  beforeEach(() => {
    useCase = new GetRecommendationsUseCaseImpl(mockRepository);
    jest.clearAllMocks();
  });

  it('should return recommendations from repository', async () => {
    mockRepository.getRecommendations.mockResolvedValue(mockPoints);

    const result = await useCase.execute({
      location: { latitude: -23.5505, longitude: -46.6333 },
      limit: 10,
    });

    expect(result).toEqual(mockPoints);
    expect(mockRepository.getRecommendations).toHaveBeenCalledWith(
      { latitude: -23.5505, longitude: -46.6333 },
      10
    );
  });

  it('should prioritize points based on user interests', async () => {
    mockRepository.getRecommendations.mockResolvedValue(mockPoints);

    const result = await useCase.execute({
      userInterests: ['nature', 'hiking'],
      limit: 10,
    });

    expect(result).toHaveLength(2);
    // First point should be prioritized due to matching interests
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('should handle repository errors', async () => {
    const error = new Error('Repository error');
    mockRepository.getRecommendations.mockRejectedValue(error);

    await expect(useCase.execute({ limit: 10 })).rejects.toThrow('Failed to get recommendations');
  });

  it('should use default limit when not provided', async () => {
    mockRepository.getRecommendations.mockResolvedValue(mockPoints);

    await useCase.execute({});

    expect(mockRepository.getRecommendations).toHaveBeenCalledWith(undefined, 10);
  });
});