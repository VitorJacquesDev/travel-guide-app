import { useState, useEffect } from 'react';
import { NetworkService, NetworkState } from '../../core/services/NetworkService';

/**
 * Hook for monitoring network connectivity
 */
export function useNetwork() {
  const [networkState, setNetworkState] = useState<NetworkState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const networkService = NetworkService.getInstance();

    // Get initial state
    const initialState = networkService.getCurrentState();
    if (initialState) {
      setNetworkState(initialState);
      setIsLoading(false);
    }

    // Subscribe to network changes
    const unsubscribe = networkService.addListener((state) => {
      setNetworkState(state);
      setIsLoading(false);
    });

    // If no initial state, try to refresh
    if (!initialState) {
      networkService.refresh().catch(() => {
        setIsLoading(false);
      });
    }

    return unsubscribe;
  }, []);

  return {
    networkState,
    isConnected: networkState?.isConnected ?? false,
    isInternetReachable: networkState?.isInternetReachable ?? false,
    isWiFiConnected: networkState?.type === 'wifi' && networkState?.isConnected,
    isCellularConnected: networkState?.type === 'cellular' && networkState?.isConnected,
    networkType: networkState?.type ?? 'unknown',
    isLoading,
  };
}