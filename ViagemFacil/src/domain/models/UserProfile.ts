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
  readonly visitedPlaces: readonly string[]; // Point IDs
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
  
  return {
    id: params.id,
    email: params.email.toLowerCase().trim(),
    displayName: params.displayName.trim(),
    photoURL: params.photoURL,
    preferences: {
      ...defaultUserPreferences,
      ...params.preferences,
      interests: Object.freeze([...(params.preferences?.interests || [])]),
    },
    favorites: Object.freeze([...(params.favorites || [])]),
    visitedPlaces: Object.freeze([...(params.visitedPlaces || [])]),
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
  return {
    ...userProfile,
    preferences: {
      ...userProfile.preferences,
      ...newPreferences,
      interests: newPreferences.interests 
        ? Object.freeze([...newPreferences.interests])
        : userProfile.preferences.interests,
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

  return {
    ...userProfile,
    favorites: Object.freeze([...userProfile.favorites, pointId]),
    updatedAt: new Date(),
  };
};

/**
 * Remove point from favorites
 */
export const removeFromFavorites = (userProfile: UserProfile, pointId: string): UserProfile => {
  const newFavorites = userProfile.favorites.filter(id => id !== pointId);
  
  return {
    ...userProfile,
    favorites: Object.freeze(newFavorites),
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

  return {
    ...userProfile,
    visitedPlaces: Object.freeze([...userProfile.visitedPlaces, pointId]),
    updatedAt: new Date(),
  };
};