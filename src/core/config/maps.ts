import { Platform } from 'react-native';

/**
 * Google Maps API configuration
 */
export const GOOGLE_MAPS_CONFIG = {
  // Note: In production, these should be environment variables
  API_KEY_ANDROID: 'YOUR_ANDROID_API_KEY_HERE',
  API_KEY_IOS: 'YOUR_IOS_API_KEY_HERE',
  
  // Get the appropriate API key for the current platform
  getApiKey: () => {
    return Platform.select({
      android: GOOGLE_MAPS_CONFIG.API_KEY_ANDROID,
      ios: GOOGLE_MAPS_CONFIG.API_KEY_IOS,
      default: GOOGLE_MAPS_CONFIG.API_KEY_ANDROID,
    });
  },
};

/**
 * Map configuration constants
 */
export const MAP_CONFIG = {
  DEFAULT_REGION: {
    latitude: -14.2350, // Center of Brazil
    longitude: -51.9253,
    latitudeDelta: 30.0,
    longitudeDelta: 30.0,
  },
  
  DEFAULT_ZOOM: {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  
  CLOSE_ZOOM: {
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  
  MARKER_CLUSTER_RADIUS: 50,
  MAX_CLUSTER_ZOOM: 15,
};