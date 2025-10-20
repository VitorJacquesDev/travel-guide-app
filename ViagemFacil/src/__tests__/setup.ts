import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Firebase
jest.mock('../core/config/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
  firestore: {},
  storage: {},
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
    isWifiEnabled: true,
  })),
  addEventListener: jest.fn(() => jest.fn()),
}));

// Mock Expo Location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({
    status: 'granted',
    granted: true,
    canAskAgain: true,
  })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 5,
    },
  })),
}));

// Mock React Native Maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, props),
    Marker: (props: any) => React.createElement(View, props),
    Callout: (props: any) => React.createElement(View, props),
  };
});

// Silence console warnings in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: An update to')
  ) {
    return;
  }
  originalWarn(...args);
};