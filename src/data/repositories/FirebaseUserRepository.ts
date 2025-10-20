import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  arrayUnion, 
  arrayRemove,
  onSnapshot,
  Unsubscribe,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../../core/config/firebase';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserProfile, UserPreferences, createUserProfile, Language, Theme, UnitSystem } from '../../domain/models/UserProfile';

/**
 * Firebase implementation of UserRepository
 */
export class FirebaseUserRepository implements UserRepository {
  private readonly collectionName = 'users';

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return null;
      }
      return await this.getUserById(currentUser.uid);
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new Error('Failed to get current user');
    }
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = doc(db, this.collectionName, userId);
      const docSnap = await getDoc(userDoc);

      if (!docSnap.exists()) {
        return null;
      }

      return this.convertFirestoreToUserProfile(docSnap.data(), userId);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new Error('Failed to get user profile');
    }
  }

  async createUserProfile(userProfile: UserProfile): Promise<void> {
    try {
      const userDoc = doc(db, this.collectionName, userProfile.id);
      const userData = {
        email: userProfile.email,
        displayName: userProfile.displayName,
        photoURL: userProfile.photoURL,
        preferences: {
          language: userProfile.preferences.language,
          theme: userProfile.preferences.theme,
          unitSystem: userProfile.preferences.unitSystem,
          interests: userProfile.preferences.interests,
          favoriteCategories: userProfile.preferences.favoriteCategories,
          notificationsEnabled: userProfile.preferences.notificationsEnabled,
        },
        favorites: userProfile.favorites,
        visitedPlaces: userProfile.visitedPlaces,
        createdAt: Timestamp.fromDate(userProfile.createdAt),
        updatedAt: Timestamp.fromDate(userProfile.updatedAt),
      };

      await setDoc(userDoc, userData);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userDoc = doc(db, this.collectionName, userId);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      // Convert dates to Firestore timestamps
      if (updates.createdAt) {
        updateData.createdAt = Timestamp.fromDate(updates.createdAt);
      }

      await updateDoc(userDoc, updateData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  async updateUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
    try {
      const userDoc = doc(db, this.collectionName, userId);
      await updateDoc(userDoc, {
        preferences,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Failed to update user preferences');
    }
  }

  async addToFavorites(userId: string, pointId: string): Promise<void> {
    try {
      const userDoc = doc(db, this.collectionName, userId);
      await updateDoc(userDoc, {
        favorites: arrayUnion(pointId),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw new Error('Failed to add to favorites');
    }
  }

  async removeFromFavorites(userId: string, pointId: string): Promise<void> {
    try {
      const userDoc = doc(db, this.collectionName, userId);
      await updateDoc(userDoc, {
        favorites: arrayRemove(pointId),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw new Error('Failed to remove from favorites');
    }
  }

  async getFavorites(userId: string): Promise<readonly string[]> {
    try {
      const userProfile = await this.getUserById(userId);
      return userProfile?.favorites || [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw new Error('Failed to get favorites');
    }
  }

  async addToVisitedPlaces(userId: string, pointId: string): Promise<void> {
    try {
      const userDoc = doc(db, this.collectionName, userId);
      await updateDoc(userDoc, {
        visitedPlaces: arrayUnion(pointId),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding to visited places:', error);
      throw new Error('Failed to add to visited places');
    }
  }

  async getVisitedPlaces(userId: string): Promise<readonly string[]> {
    try {
      const userProfile = await this.getUserById(userId);
      return userProfile?.visitedPlaces || [];
    } catch (error) {
      console.error('Error getting visited places:', error);
      throw new Error('Failed to get visited places');
    }
  }

  async deleteUserProfile(userId: string): Promise<void> {
    try {
      const userDoc = doc(db, this.collectionName, userId);
      await deleteDoc(userDoc);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw new Error('Failed to delete user profile');
    }
  }

  async isFavorite(userId: string, pointId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites(userId);
      return favorites.includes(pointId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  }

  async isVisited(userId: string, pointId: string): Promise<boolean> {
    try {
      const visitedPlaces = await this.getVisitedPlaces(userId);
      return visitedPlaces.includes(pointId);
    } catch (error) {
      console.error('Error checking if visited:', error);
      return false;
    }
  }

  // Legacy methods for compatibility
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.getUserById(userId);
  }

  async getFavoritePointIds(userId: string): Promise<readonly string[]> {
    return this.getFavorites(userId);
  }

  async addFavoritePoint(userId: string, pointId: string): Promise<void> {
    return this.addToFavorites(userId, pointId);
  }

  async removeFavoritePoint(userId: string, pointId: string): Promise<void> {
    return this.removeFromFavorites(userId, pointId);
  }

  async addVisitedPoint(userId: string, pointId: string): Promise<void> {
    return this.addToVisitedPlaces(userId, pointId);
  }

  async removeVisitedPoint(userId: string, pointId: string): Promise<void> {
    try {
      const userDoc = doc(db, this.collectionName, userId);
      await updateDoc(userDoc, {
        visitedPlaces: arrayRemove(pointId),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error removing visited point:', error);
      throw new Error('Failed to remove visited point');
    }
  }

  /**
   * Subscribe to real-time updates of user profile
   */
  subscribeToUserProfile(
    userId: string, 
    callback: (profile: UserProfile | null) => void
  ): Unsubscribe {
    const docRef = doc(db, this.collectionName, userId);
    
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const profile = this.convertFirestoreToUserProfile(docSnap.data(), userId);
          callback(profile);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error in user profile subscription:', error);
        callback(null);
      }
    );
  }

  /**
   * Subscribe to real-time updates of favorite points
   */
  subscribeToFavorites(
    userId: string, 
    callback: (favoriteIds: readonly string[]) => void
  ): Unsubscribe {
    const docRef = doc(db, this.collectionName, userId);
    
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          callback(data.favorites || []);
        } else {
          callback([]);
        }
      },
      (error) => {
        console.error('Error in favorites subscription:', error);
        callback([]);
      }
    );
  }

  private convertFirestoreToUserProfile(data: any, id: string): UserProfile {
    return createUserProfile({
      id,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      preferences: {
        language: data.preferences?.language || Language.PORTUGUESE_BR,
        theme: data.preferences?.theme || Theme.SYSTEM,
        unitSystem: data.preferences?.unitSystem || UnitSystem.METRIC,
        interests: data.preferences?.interests || [],
        notificationsEnabled: data.preferences?.notificationsEnabled ?? true,
      },
      favorites: data.favorites || [],
      visitedPlaces: data.visitedPlaces || [],
      createdAt: data.createdAt?.toDate() || new Date(),
    });
  }
}