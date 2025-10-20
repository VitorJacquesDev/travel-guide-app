import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  isWifiEnabled?: boolean;
}

/**
 * Service for handling network connectivity
 */
export class NetworkService {
  private static instance: NetworkService;
  private currentState: NetworkState | null = null;
  private listeners: ((state: NetworkState) => void)[] = [];
  private subscription: NetInfoSubscription | null = null;

  private constructor() {
    this.initialize();
  }

  static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  private async initialize(): Promise<void> {
    try {
      // Get initial state
      const state = await NetInfo.fetch();
      this.updateState(state);

      // Subscribe to network state changes
      this.subscription = NetInfo.addEventListener((state) => {
        this.updateState(state);
      });
    } catch (error) {
      console.error('Error initializing NetworkService:', error);
    }
  }

  private updateState(netInfoState: NetInfoState): void {
    const networkState: NetworkState = {
      isConnected: netInfoState.isConnected ?? false,
      isInternetReachable: netInfoState.isInternetReachable ?? false,
      type: netInfoState.type,
      isWifiEnabled: netInfoState.isWifiEnabled,
    };

    const previousState = this.currentState;
    this.currentState = networkState;

    // Notify listeners if state changed
    if (!previousState || this.hasStateChanged(previousState, networkState)) {
      this.notifyListeners(networkState);
    }
  }

  private hasStateChanged(previous: NetworkState, current: NetworkState): boolean {
    return (
      previous.isConnected !== current.isConnected ||
      previous.isInternetReachable !== current.isInternetReachable ||
      previous.type !== current.type
    );
  }

  private notifyListeners(state: NetworkState): void {
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in network state listener:', error);
      }
    });
  }

  /**
   * Get current network state
   */
  getCurrentState(): NetworkState | null {
    return this.currentState;
  }

  /**
   * Check if device is connected to internet
   */
  isConnected(): boolean {
    return this.currentState?.isConnected ?? false;
  }

  /**
   * Check if internet is reachable
   */
  isInternetReachable(): boolean {
    return this.currentState?.isInternetReachable ?? false;
  }

  /**
   * Check if device is connected to WiFi
   */
  isWiFiConnected(): boolean {
    return this.currentState?.type === 'wifi' && this.isConnected();
  }

  /**
   * Check if device is connected to cellular
   */
  isCellularConnected(): boolean {
    return this.currentState?.type === 'cellular' && this.isConnected();
  }

  /**
   * Add listener for network state changes
   */
  addListener(listener: (state: NetworkState) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners = [];
  }

  /**
   * Refresh network state
   */
  async refresh(): Promise<NetworkState> {
    try {
      const state = await NetInfo.fetch();
      this.updateState(state);
      return this.currentState!;
    } catch (error) {
      console.error('Error refreshing network state:', error);
      throw error;
    }
  }

  /**
   * Get network type description
   */
  getNetworkTypeDescription(): string {
    if (!this.currentState) return 'Desconhecido';

    if (!this.currentState.isConnected) {
      return 'Sem conexão';
    }

    switch (this.currentState.type) {
      case 'wifi':
        return 'WiFi';
      case 'cellular':
        return 'Dados móveis';
      case 'ethernet':
        return 'Ethernet';
      case 'bluetooth':
        return 'Bluetooth';
      default:
        return 'Conectado';
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.subscription) {
      this.subscription();
      this.subscription = null;
    }
    this.removeAllListeners();
    this.currentState = null;
  }
}