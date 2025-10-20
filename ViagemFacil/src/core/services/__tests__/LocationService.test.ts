import { LocationService } from '../LocationService';
import * as Location from 'expo-location';

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  PermissionStatus: {
    GRANTED: 'granted',
    DENIED: 'denied',
  },
  Accuracy: {
    Balanced: 4,
  },
}));

describe('LocationService', () => {
  let locationService: LocationService;

  beforeEach(() => {
    locationService = LocationService.getInstance();
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = LocationService.getInstance();
      const instance2 = LocationService.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('requestPermissions', () => {
    it('should return granted status when permission is granted', async () => {
      const mockResponse = {
        status: Location.PermissionStatus.GRANTED,
        canAskAgain: true,
      };
      
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(mockResponse);

      const result = await locationService.requestPermissions();

      expect(result.granted).toBe(true);
      expect(result.status).toBe(Location.PermissionStatus.GRANTED);
      expect(result.canAskAgain).toBe(true);
    });

    it('should return denied status when permission is denied', async () => {
      const mockResponse = {
        status: Location.PermissionStatus.DENIED,
        canAskAgain: false,
      };
      
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(mockResponse);

      const result = await locationService.requestPermissions();

      expect(result.granted).toBe(false);
      expect(result.status).toBe(Location.PermissionStatus.DENIED);
      expect(result.canAskAgain).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error('Permission error')
      );

      const result = await locationService.requestPermissions();

      expect(result.granted).toBe(false);
      expect(result.canAskAgain).toBe(false);
    });
  });

  describe('getCurrentLocation', () => {
    it('should return coordinates when permission is granted', async () => {
      const mockPermissions = {
        status: Location.PermissionStatus.GRANTED,
        canAskAgain: true,
      };
      
      const mockLocation = {
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
        },
      };

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue(mockPermissions);
      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockLocation);

      const result = await locationService.getCurrentLocation();

      expect(result).toEqual({
        latitude: -23.5505,
        longitude: -46.6333,
      });
    });

    it('should return null when permission is not granted', async () => {
      const mockPermissions = {
        status: Location.PermissionStatus.DENIED,
        canAskAgain: false,
      };

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue(mockPermissions);

      const result = await locationService.getCurrentLocation();

      expect(result).toBeNull();
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      const coord1 = { latitude: -23.5505, longitude: -46.6333 }; // São Paulo
      const coord2 = { latitude: -22.9068, longitude: -43.1729 }; // Rio de Janeiro

      const distance = locationService.calculateDistance(coord1, coord2);

      // Distance between São Paulo and Rio de Janeiro is approximately 357 km
      expect(distance).toBeGreaterThan(350);
      expect(distance).toBeLessThan(400);
    });

    it('should return 0 for same coordinates', () => {
      const coord = { latitude: -23.5505, longitude: -46.6333 };

      const distance = locationService.calculateDistance(coord, coord);

      expect(distance).toBe(0);
    });
  });

  describe('formatDistance', () => {
    it('should format distance in meters for distances < 1km', () => {
      expect(locationService.formatDistance(0.5)).toBe('500m');
      expect(locationService.formatDistance(0.123)).toBe('123m');
    });

    it('should format distance in km with decimal for distances < 10km', () => {
      expect(locationService.formatDistance(5.7)).toBe('5.7km');
      expect(locationService.formatDistance(1.2)).toBe('1.2km');
    });

    it('should format distance in rounded km for distances >= 10km', () => {
      expect(locationService.formatDistance(15.7)).toBe('16km');
      expect(locationService.formatDistance(100.3)).toBe('100km');
    });
  });
});