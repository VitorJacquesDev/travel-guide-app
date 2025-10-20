import { UseCase } from '../base/UseCase';
import { SearchQuery, SearchResult } from '../../repositories/PointOfInterestRepository';

/**
 * Use case for searching points of interest
 * Handles text search, filtering, and pagination
 */
export interface SearchPointsUseCase extends UseCase<SearchQuery, SearchResult> {
  /**
   * Search points of interest with filters and pagination
   * @param query Search parameters including text, filters, and pagination
   * @returns Promise resolving to search results with pagination info
   */
  execute(query: SearchQuery): Promise<SearchResult>;
}