import { SearchPointsUseCaseImpl } from '../SearchPointsUseCaseImpl';
import { PointOfInterestRepository, SearchQuery, SearchResult } from '../../../../domain/repositories/PointOfInterestRepository';

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

const mockSearchResult: SearchResult = {
  points: [],
  total: 0,
  hasMore: false,
};

describe('SearchPointsUseCaseImpl', () => {
  let useCase: SearchPointsUseCaseImpl;

  beforeEach(() => {
    useCase = new SearchPointsUseCaseImpl(mockRepository);
    jest.clearAllMocks();
  });

  it('should execute search with valid query', async () => {
    const query: SearchQuery = {
      query: 'test',
      limit: 20,
      offset: 0,
    };

    mockRepository.searchPoints.mockResolvedValue(mockSearchResult);

    const result = await useCase.execute(query);

    expect(result).toEqual(mockSearchResult);
    expect(mockRepository.searchPoints).toHaveBeenCalledWith(query);
  });

  it('should validate limit parameter', async () => {
    const query: SearchQuery = {
      limit: 150, // Invalid limit
    };

    await expect(useCase.execute(query)).rejects.toThrow('Limit must be between 1 and 100');
  });

  it('should validate negative offset', async () => {
    const query: SearchQuery = {
      offset: -1, // Invalid offset
    };

    await expect(useCase.execute(query)).rejects.toThrow('Offset must be non-negative');
  });

  it('should validate rating range', async () => {
    const query: SearchQuery = {
      minRating: 6, // Invalid rating
    };

    await expect(useCase.execute(query)).rejects.toThrow('Minimum rating must be between 0 and 5');
  });

  it('should validate coordinates', async () => {
    const query: SearchQuery = {
      location: {
        latitude: 100, // Invalid latitude
        longitude: 0,
      },
    };

    await expect(useCase.execute(query)).rejects.toThrow('Latitude must be between -90 and 90');
  });

  it('should require location when distance is specified', async () => {
    const query: SearchQuery = {
      maxDistance: 10, // Distance without location
    };

    await expect(useCase.execute(query)).rejects.toThrow('Location is required when specifying maximum distance');
  });

  it('should handle repository errors', async () => {
    const query: SearchQuery = { query: 'test' };
    const error = new Error('Repository error');
    mockRepository.searchPoints.mockRejectedValue(error);

    await expect(useCase.execute(query)).rejects.toThrow('Failed to search points of interest');
  });
});