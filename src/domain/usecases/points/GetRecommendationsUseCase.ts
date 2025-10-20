import { UseCase } from '../base/UseCase';
import { PointOfInterest, Coordinates } from '../../models/PointOfInterest';

/**
 * Parameters for get recommendations use case
 */
export interface GetRecommendationsParams {
  readonly location?: Coordinates;
  readonly limit?: number;
  readonly userInterests?: readonly string[]; // User's preferred categories/tags
}

/**
 * Use case for getting personalized point of interest recommendations
 * Provides location-based and preference-based recommendations
 */
export interface GetRecommendationsUseCase extends UseCase<GetRecommendationsParams, readonly PointOfInterest[]> {
  /**
   * Get personalized recommendations for points of interest
   * @param params Parameters including location and user preferences
   * @returns Promise resolving to array of recommended points
   */
  execute(params: GetRecommendationsParams): Promise<readonly PointOfInterest[]>;
}