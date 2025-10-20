import { SearchPointsUseCase } from '../../../domain/usecases/points/SearchPointsUseCase';
import { PointOfInterestRepository, SearchQuery, SearchResult } from '../../../domain/repositories/PointOfInterestRepository';

/**
 * Implementation of SearchPointsUseCase
 * Handles searching and filtering of points of interest
 */
export class SearchPointsUseCaseImpl implements SearchPointsUseCase {
  constructor(
    private readonly pointOfInterestRepository: PointOfInterestRepository
  ) {}

  async execute(query: SearchQuery): Promise<SearchResult> {
    try {
      // Validate search parameters
      this.validateSearchQuery(query);

      // Execute search through repository
      const result = await this.pointOfInterestRepository.searchPoints(query);

      return result;
    } catch (error) {
      console.error('Error in SearchPointsUseCase:', error);
      throw new Error('Failed to search points of interest');
    }
  }

  /**
   * Validate search query parameters
   */
  private validateSearchQuery(query: SearchQuery): void {
    // Validate limit
    if (query.limit && (query.limit < 1 || query.limit > 100)) {
      throw new Error('Limit must be between 1 and 100');
    }

    // Validate offset
    if (query.offset && query.offset < 0) {
      throw new Error('Offset must be non-negative');
    }

    // Validate rating range
    if (query.minRating && (query.minRating < 0 || query.minRating > 5)) {
      throw new Error('Minimum rating must be between 0 and 5');
    }

    // Validate distance
    if (query.maxDistance && query.maxDistance < 0) {
      throw new Error('Maximum distance must be non-negative');
    }

    // Validate location if distance is specified
    if (query.maxDistance && !query.location) {
      throw new Error('Location is required when specifying maximum distance');
    }

    // Validate coordinates
    if (query.location) {
      const { latitude, longitude } = query.location;
      if (latitude < -90 || latitude > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }
      if (longitude < -180 || longitude > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }
    }
  }
}