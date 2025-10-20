import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, MainTabParamList, AuthStackParamList } from './types';

// Navigation utilities
export const navigationUtils = {
  // Navigate to point details
  navigateToPointDetails: (navigation: NavigationProp<RootStackParamList>, pointId: string) => {
    navigation.navigate('PointDetails', { pointId });
  },

  // Navigate to main tabs
  navigateToMain: (navigation: NavigationProp<RootStackParamList>) => {
    navigation.navigate('Main', { screen: 'Home' });
  },

  // Navigate to auth
  navigateToAuth: (navigation: NavigationProp<RootStackParamList>) => {
    navigation.navigate('Auth', { screen: 'Login' });
  },

  // Navigate to specific tab
  navigateToTab: (navigation: NavigationProp<RootStackParamList>, tab: keyof MainTabParamList) => {
    navigation.navigate('Main', { screen: tab });
  },

  // Navigate to specific auth screen
  navigateToAuthScreen: (navigation: NavigationProp<RootStackParamList>, screen: keyof AuthStackParamList) => {
    navigation.navigate('Auth', { screen });
  },
};

// Custom hooks for typed navigation
export const useRootNavigation = () => {
  return useNavigation<NavigationProp<RootStackParamList>>();
};

export const useMainTabNavigation = () => {
  return useNavigation<NavigationProp<MainTabParamList>>();
};

export const useAuthNavigation = () => {
  return useNavigation<NavigationProp<AuthStackParamList>>();
};