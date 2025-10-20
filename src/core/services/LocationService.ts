import * as Location from 'expo-location';
import { Coordinates } from '../../domain/models/PointOfInterest';

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Location.PermissionStatus;
}

/**
 * Service for handling location-related operations
 */
export class LocationService {
  private static instance: LocationService;
  private currentLocation: Coordinates | null = null;
  private watchId: Location.LocationSubscription | null = null;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
        status,
      };
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: Location.PermissionStatus.DENIED,
      };
    }
  }

  /**
   * Check current location permission status
   */
  async checkPermissions(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
        status,
      };
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: Location.PermissionStatus.DENIED,
      };
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<Coordinates | null> {
    try {
      const permissions = await this.checkPermissions();
      
      if (!permissions.granted) {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      const coordinates: Coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      this.currentLocation = coordinates;
      return coordinates;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Watch location changes
   */
  async watchLocation(
    callback: (location: Coordinates) => void,
    errorCallback?: (error: Error) => void
  ): Promise<boolean> {
    try {
      const permissions = await this.checkPermissions();
      
      if (!permissions.granted) {
        throw new Error('Location permission not granted');
      }

      // Stop existing watch if any
      if (this.watchId) {
        this.stopWatchingLocation();
      }

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 50, // Update when moved 50 meters
        },
        (location) => {
          const coordinates: Coordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          
          this.currentLocation = coordinates;
          callback(coordinates);
        }
      );

      return true;
    } catch (error) {
      console.error('Error watching location:', error);
      if (errorCallback) {
        errorCallback(error as Error);
      }
      return false;
    }
  }

  /**
   * Stop watching location changes
   */
  stopWatchingLocation(): void {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
  }

  /**
   * Get cached current location
   */
  getCachedLocation(): Coordinates | null {
    return this.currentLocation;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) * 
      Math.cos(this.toRadians(coord2.latitude)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Format distance for display
   */
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    } else if (distanceKm < 10) {
      return `${distanceKm.toFixed(1)}km`;
    } else {
      return `${Math.round(distanceKm)}km`;
    }
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopWatchingLocation();
    this.currentLocation = null;
  }
}