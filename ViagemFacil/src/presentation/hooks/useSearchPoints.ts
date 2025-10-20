import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { SearchQuery, SearchResult } from '../../domain/repositories/PointOfInterestRepository';
import { SearchPointsUseCaseImpl } from '../../data/usecases/points/SearchPointsUseCaseImpl';
import { FirestorePointOfInterestRepository } from '../../data/repositories/FirestorePointOfInterestRepository';

// Create repository and use case instances
const repository = new FirestorePointOfInterestRepository();
const searchPointsUseCase = new SearchPointsUseCaseImpl(repository);

interface UseSearchPointsParams extends SearchQuery {
  enabled?: boolean;
}

/**
 * Hook for searching points of interest
 */
export function useSearchPoints({
  enabled = true,
  ...searchQuery
}: UseSearchPointsParams): UseQueryResult<SearchResult, Error> {
  return useQuery({
    queryKey: ['searchPoints', searchQuery],
    queryFn: () => searchPointsUseCase.execute(searchQuery),
    enabled: enabled && (
      !!searchQuery.query || 
      !!searchQuery.categories?.length || 
      !!searchQuery.priceRanges?.length ||
      !!searchQuery.minRating ||
      !!searchQuery.location
    ),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for getting a specific point by ID
 */
export function usePointById(
  id: string, 
  enabled = true
): UseQueryResult<PointOfInterest | null, Error> {
  return useQuery({
    queryKey: ['point', id],
    queryFn: () => repository.getPointById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook for getting nearby points
 */
export function useNearbyPoints(
  location: Coordinates | undefined,
  radiusKm: number = 10,
  limit: number = 20,
  enabled = true
): UseQueryResult<readonly PointOfInterest[], Error> {
  return useQuery({
    queryKey: ['nearbyPoints', location, radiusKm, limit],
    queryFn: () => repository.getNearbyPoints(location!, radiusKm, limit),
    enabled: enabled && !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for getting popular points
 */
export function usePopularPoints(
  limit: number = 20,
  enabled = true
): UseQueryResult<readonly PointOfInterest[], Error> {
  return useQuery({
    queryKey: ['popularPoints', limit],
    queryFn: () => repository.getPopularPoints(limit),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}