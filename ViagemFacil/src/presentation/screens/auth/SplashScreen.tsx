import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';

type Props = AuthStackScreenProps<'Splash'>;

export default function SplashScreen({ navigation }: Props): JSX.Element {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          // User is authenticated, navigate to main app
          navigation.replace('Onboarding'); // For now, always show onboarding
        } else {
          // User is not authenticated, show onboarding
          navigation.replace('Onboarding');
        }
      }
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [user, isLoading, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ViagemFácil</Text>
      <Text style={styles.subtitle}>Descubra lugares incríveis</Text>
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});