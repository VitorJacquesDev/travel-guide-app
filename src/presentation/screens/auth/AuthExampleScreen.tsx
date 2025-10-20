import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { LoginScreen } from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { useAuth } from '../../contexts/AuthContext';

type AuthScreenType = 'login' | 'signup' | 'forgot-password';

export function AuthExampleScreen() {
  const { user, logout, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreenType>('login');

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.welcome}>
          Bem-vindo, {user.displayName || user.email}!
        </Text>
        <Text variant="bodyMedium" style={styles.userInfo}>
          Email: {user.email}
        </Text>
        <Text variant="bodyMedium" style={styles.userInfo}>
          Email verificado: {user.emailVerified ? 'Sim' : 'Não'}
        </Text>
        <Button
          mode="contained"
          onPress={logout}
          style={styles.logoutButton}
        >
          Sair
        </Button>
      </View>
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignUpScreen
        navigation={{
          navigate: (screen: string) => {
            if (screen === 'Login') {
              setCurrentScreen('login');
            }
          },
        } as any}
        route={{} as any}
      />
    );
  }

  if (currentScreen === 'forgot-password') {
    return (
      <ForgotPasswordScreen
        navigation={{
          goBack: () => {
            setCurrentScreen('login');
          },
        } as any}
        route={{} as any}
      />
    );
  }

  return (
    <LoginScreen
      onForgotPassword={() => {
        setCurrentScreen('forgot-password');
      }}
      onRegister={() => {
        setCurrentScreen('signup');
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 24,
    paddingHorizontal: 32,
  },
});