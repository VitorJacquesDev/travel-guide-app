import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { PointOfInterest, Coordinates } from '../../domain/models/PointOfInterest';
import { GetRecommendationsUseCaseImpl } from '../../data/usecases/points/GetRecommendationsUseCaseImpl';
import { FirestorePointOfInterestRepository } from '../../data/repositories/FirestorePointOfInterestRepository';

// Create repository and use case instances
const repository = new FirestorePointOfInterestRepository();
const getRecommendationsUseCase = new GetRecommendationsUseCaseImpl(repository);

interface UseRecommendationsParams {
  location?: Coordinates;
  limit?: number;
  userInterests?: readonly string[];
  enabled?: boolean;
}

/**
 * Hook for fetching personalized recommendations
 */
export function useRecommendations({
  location,
  limit = 10,
  userInterests,
  enabled = true,
}: UseRecommendationsParams = {}): UseQueryResult<readonly PointOfInterest[], Error> {
  return useQuery({
    queryKey: ['recommendations', location, limit, userInterests],
    queryFn: () => getRecommendationsUseCase.execute({
      location,
      limit,
      userInterests,
    }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}