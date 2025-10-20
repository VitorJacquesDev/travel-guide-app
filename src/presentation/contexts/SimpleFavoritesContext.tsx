import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps): JSX.Element {
  const [favoriteIds, setFavoriteIds] = useState<readonly string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFavorite = useCallback((pointId: string): boolean => {
    return favoriteIds.includes(pointId);
  }, [favoriteIds]);

  const addToFavorites = async (pointId: string): Promise<void> => {
    setIsLoading(true);
    try {
      if (!favoriteIds.includes(pointId)) {
        setFavoriteIds(prev => [...prev, pointId]);
      }
    } catch (error) {
      setError('Erro ao adicionar favorito');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromFavorites = async (pointId: string): Promise<void> => {
    setIsLoading(true);
    try {
      setFavoriteIds(prev => prev.filter(id => id !== pointId));
    } catch (error) {
      setError('Erro ao remover favorito');
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