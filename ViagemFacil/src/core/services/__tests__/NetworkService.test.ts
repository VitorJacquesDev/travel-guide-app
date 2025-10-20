import { NetworkService } from '../NetworkService';

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

describe('NetworkService', () => {
  let networkService: NetworkService;

  beforeEach(() => {
    networkService = NetworkService.getInstance();
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = NetworkService.getInstance();
      const instance2 = NetworkService.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('isConnected', () => {
    it('should return false when no state is available', () => {
      expect(networkService.isConnected()).toBe(false);
    });
  });

  describe('isInternetReachable', () => {
    it('should return false when no state is available', () => {
      expect(networkService.isInternetReachable()).toBe(false);
    });
  });

  describe('isWiFiConnected', () => {
    it('should return false when not connected to WiFi', () => {
      expect(networkService.isWiFiConnected()).toBe(false);
    });
  });

  describe('isCellularConnected', () => {
    it('should return false when not connected to cellular', () => {
      expect(networkService.isCellularConnected()).toBe(false);
    });
  });

  describe('getNetworkTypeDescription', () => {
    it('should return "Desconhecido" when no state is available', () => {
      expect(networkService.getNetworkTypeDescription()).toBe('Desconhecido');
    });
  });

  describe('addListener', () => {
    it('should add listener and return unsubscribe function', () => {
      const listener = jest.fn();
      const unsubscribe = networkService.addListener(listener);
      
      expect(typeof unsubscribe).toBe('function');
      
      // Test unsubscribe
      unsubscribe();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      networkService.addListener(listener1);
      networkService.addListener(listener2);
      
      networkService.removeAllListeners();
      
      // Listeners should be cleared
      expect((networkService as any).listeners).toHaveLength(0);
    });
  });
});