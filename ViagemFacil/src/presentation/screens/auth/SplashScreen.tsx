import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { initializeFirebase } from '@/core/config/firebaseInit';

/**
 * Splash screen component
 * Shows app logo and handles initial authentication check
 */
export const SplashScreen: React.FC = () => {
  const { isLoading } = useAuth();

  useEffect(() => {
    // Initialize Firebase services
    initializeFirebase();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* App Logo - Replace with actual logo */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>VF</Text>
        </View>
        <Text style={styles.appName}>ViagemFácil</Text>
        <Text style={styles.tagline}>Descubra lugares incríveis</Text>
      </View>

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  footer: {
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: '#999999',
  },
});