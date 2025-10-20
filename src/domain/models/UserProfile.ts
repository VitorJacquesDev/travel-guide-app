import { Category } from './PointOfInterest';

/**
 * Language enumeration for user preferences
 */
export enum Language {
  PORTUGUESE_BR = 'pt-BR',
  ENGLISH_US = 'en-US',
  SPANISH = 'es-ES',
}

/**
 * Theme enumeration for user interface preferences
 */
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

/**
 * Unit system enumeration for measurements
 */
export enum UnitSystem {
  METRIC = 'metric',
  IMPERIAL = 'imperial',
}

/**
 * User preferences value object
 */
export interface UserPreferences {
  readonly language: Language;
  readonly theme: Theme;
  readonly unitSystem: UnitSystem;
  readonly interests: readonly Category[];
  readonly favoriteCategories: readonly Category[]; // Alias for interests (for compatibility)
  readonly notificationsEnabled: boolean;
}

/**
 * User profile domain entity
 * Represents a registered user with their preferences and activity
 */
export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly photoURL?: string;
  readonly preferences: UserPreferences;
  readonly favorites: readonly string[]; // Point IDs
  readonly favoritePointIds: readonly string[]; // Alias for favorites (for compatibility)
  readonly visitedPlaces: readonly string[]; // Point IDs
  readonly visitedPointIds: readonly string[]; // Alias for visitedPlaces (for compatibility)
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Default user preferences
 */
export const defaultUserPreferences: UserPreferences = {
  language: Language.PORTUGUESE_BR,
  theme: Theme.SYSTEM,
  unitSystem: UnitSystem.METRIC,
  interests: [],
  favoriteCategories: [],
  notificationsEnabled: true,
};

/**
 * Factory function to create a new UserProfile
 */
export const createUserProfile = (params: {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences?: Partial<UserPreferences>;
  favorites?: string[];
  visitedPlaces?: string[];
  createdAt?: Date;
}): UserProfile => {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(params.email)) {
    throw new Error('Invalid email format');
  }

  // Validate display name
  if (!params.displayName.trim()) {
    throw new Error('Display name cannot be empty');
  }

  const now = new Date();
  
  const favorites = Object.freeze([...(params.favorites || [])]);
  const visitedPlaces = Object.freeze([...(params.visitedPlaces || [])]);
  const interests = Object.freeze([...(params.preferences?.interests || [])]);
  
  return {
    id: params.id,
    email: params.email.toLowerCase().trim(),
    displayName: params.displayName.trim(),
    photoURL: params.photoURL || undefined,
    preferences: {
      ...defaultUserPreferences,
      ...params.preferences,
      interests,
      favoriteCategories: interests, // Alias
    },
    favorites,
    favoritePointIds: favorites, // Alias
    visitedPlaces,
    visitedPointIds: visitedPlaces, // Alias
    createdAt: params.createdAt || now,
    updatedAt: now,
  };
};

/**
 * Update user preferences
 */
export const updateUserPreferences = (
  userProfile: UserProfile,
  newPreferences: Partial<UserPreferences>
): UserProfile => {
  const interests = newPreferences.interests 
    ? Object.freeze([...newPreferences.interests])
    : userProfile.preferences.interests;
    
  return {
    ...userProfile,
    preferences: {
      ...userProfile.preferences,
      ...newPreferences,
      interests,
      favoriteCategories: interests, // Keep alias in sync
    },
    updatedAt: new Date(),
  };
};

/**
 * Add point to favorites
 */
export const addToFavorites = (userProfile: UserProfile, pointId: string): UserProfile => {
  if (userProfile.favorites.includes(pointId)) {
    return userProfile; // Already in favorites
  }

  const favorites = Object.freeze([...userProfile.favorites, pointId]);
  return {
    ...userProfile,
    favorites,
    favoritePointIds: favorites, // Keep alias in sync
    updatedAt: new Date(),
  };
};

/**
 * Remove point from favorites
 */
export const removeFromFavorites = (userProfile: UserProfile, pointId: string): UserProfile => {
  const favorites = Object.freeze(userProfile.favorites.filter(id => id !== pointId));
  
  return {
    ...userProfile,
    favorites,
    favoritePointIds: favorites, // Keep alias in sync
    updatedAt: new Date(),
  };
};

/**
 * Add point to visited places
 */
export const addToVisitedPlaces = (userProfile: UserProfile, pointId: string): UserProfile => {
  if (userProfile.visitedPlaces.includes(pointId)) {
    return userProfile; // Already visited
  }

  const visitedPlaces = Object.freeze([...userProfile.visitedPlaces, pointId]);
  return {
    ...userProfile,
    visitedPlaces,
    visitedPointIds: visitedPlaces, // Keep alias in sync
    updatedAt: new Date(),
  };
};