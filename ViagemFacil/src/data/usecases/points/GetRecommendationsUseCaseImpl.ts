import { GetRecommendationsUseCase, GetRecommendationsParams } from '../../../domain/usecases/points/GetRecommendationsUseCase';
import { PointOfInterestRepository } from '../../../domain/repositories/PointOfInterestRepository';
import { PointOfInterest } from '../../../domain/models/PointOfInterest';

/**
 * Implementation of GetRecommendationsUseCase
 * Provides personalized recommendations based on location and user preferences
 */
export class GetRecommendationsUseCaseImpl implements GetRecommendationsUseCase {
  constructor(
    private readonly pointOfInterestRepository: PointOfInterestRepository
  ) {}

  async execute(params: GetRecommendationsParams): Promise<readonly PointOfInterest[]> {
    try {
      // Get base recommendations from repository
      const recommendations = await this.pointOfInterestRepository.getRecommendations(
        params.location,
        params.limit || 10
      );

      // If user interests are provided, prioritize matching points
      if (params.userInterests && params.userInterests.length > 0) {
        return this.prioritizeByUserInterests(recommendations, params.userInterests);
      }

      return recommendations;
    } catch (error) {
      console.error('Error in GetRecommendationsUseCase:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  /**
   * Prioritize recommendations based on user interests
   */
  private prioritizeByUserInterests(
    points: readonly PointOfInterest[], 
    userInterests: readonly string[]
  ): readonly PointOfInterest[] {
    const interestsLower = userInterests.map(interest => interest.toLowerCase());
    
    return [...points].sort((a, b) => {
      const aScore = this.calculateInterestScore(a, interestsLower);
      const bScore = this.calculateInterestScore(b, interestsLower);
      
      // If scores are equal, maintain original order (rating-based)
      if (aScore === bScore) return 0;
      
      // Higher score comes first
      return bScore - aScore;
    });
  }

  /**
   * Calculate interest score based on matching tags and category
   */
  private calculateInterestScore(point: PointOfInterest, userInterests: readonly string[]): number {
    let score = 0;
    
    // Check category match
    if (userInterests.includes(point.category.toLowerCase())) {
      score += 3;
    }
    
    // Check tag matches
    for (const tag of point.tags) {
      if (userInterests.includes(tag.toLowerCase())) {
        score += 1;
      }
    }
    
    // Bonus for high-rated places
    if (point.rating >= 4.5) {
      score += 1;
    }
    
    return score;
  }
}