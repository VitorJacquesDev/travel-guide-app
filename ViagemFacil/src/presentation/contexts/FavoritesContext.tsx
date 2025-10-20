import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { FirebaseUserRepository } from '../../data/repositories/FirebaseUserRepository';
import { ManageFavoritesUseCaseImpl } from '../../data/usecases/favorites/ManageFavoritesUseCaseImpl';

interface FavoritesContextType {
  favoriteIds: readonly string[];
  isFavorite: (pointId: string) => boolean;
  addToFavorites: (pointId: string) => Promise<void>;
  removeFromFavorites: (pointId: string) => Promise<void>;
  toggleFavorite: (pointId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@viagemfacil:favorites';

interface FavoritesProviderProps {
  children: React.ReactNode;
}

// Create repository and use case instances
const userRepository = new FirebaseUserRepository();
const manageFavoritesUseCase = new ManageFavoritesUseCaseImpl(userRepository);

export function FavoritesProvider({ children }: FavoritesProviderProps): JSX.Element {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<readonly string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites from local storage on mount
  useEffect(() => {
    loadLocalFavorites();
  }, []);

  // Subscribe to real-time favorites updates when user is authenticated
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = userRepository.subscribeToFavorites(
        user.uid,
        (favorites) => {
          setFavoriteIds(favorites);
          // Sync with local storage
          saveLocalFavorites(favorites);
        }
      );

      return unsubscribe;
    } else {
      // Clear favorites when user logs out
      setFavoriteIds([]);
    }
  }, [user?.uid]);

  const loadLocalFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const favorites = JSON.parse(stored);
        setFavoriteIds(favorites);
      }
    } catch (error) {
      console.warn('Failed to load local favorites:', error);
    }
  };

  const saveLocalFavorites = async (favorites: readonly string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.warn('Failed to save local favorites:', error);
    }
  };

  const isFavorite = useCallback((pointId: string): boolean => {
    return favoriteIds.includes(pointId);
  }, [favoriteIds]);

  const addToFavorites = async (pointId: string): Promise<void> => {
    if (!user?.uid) {
      throw new Error('User must be authenticated to add favorites');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Optimistic update
      if (!favoriteIds.includes(pointId)) {
        const newFavorites = [...favoriteIds, pointId];
        setFavoriteIds(newFavorites);
        await saveLocalFavorites(newFavorites);
      }

      await manageFavoritesUseCase.execute({
        userId: user.uid,
        pointId,
        action: 'add',
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError('Falha ao adicionar aos favoritos');
      
      // Revert optimistic update
      const revertedFavorites = favoriteIds.filter(id => id !== pointId);
      setFavoriteIds(revertedFavorites);
      await saveLocalFavorites(revertedFavorites);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromFavorites = async (pointId: string): Promise<void> => {
    if (!user?.uid) {
      throw new Error('User must be authenticated to remove favorites');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Optimistic update
      const newFavorites = favoriteIds.filter(id => id !== pointId);
      setFavoriteIds(newFavorites);
      await saveLocalFavorites(newFavorites);

      await manageFavoritesUseCase.execute({
        userId: user.uid,
        pointId,
        action: 'remove',
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError('Falha ao remover dos favoritos');
      
      // Revert optimistic update
      if (!favoriteIds.includes(pointId)) {
        const revertedFavorites = [...favoriteIds, pointId];
        setFavoriteIds(revertedFavorites);
        await saveLocalFavorites(revertedFavorites);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (pointId: string): Promise<void> => {
    if (isFavorite(pointId)) {
      await removeFromFavorites(pointId);
    } else {
      await addToFavorites(pointId);
    }
  };

  const value: FavoritesContextType = {
    favoriteIds,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isLoading,
    error,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}