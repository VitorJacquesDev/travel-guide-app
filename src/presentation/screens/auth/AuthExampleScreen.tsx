import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { LoginScreen } from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import { useAuth } from '../../contexts/AuthContext';

export function AuthExampleScreen() {
  const { user, logout, loading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

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

  if (showSignUp) {
    return (
      <SignUpScreen
        navigation={{
          navigate: (screen: string) => {
            if (screen === 'Login') {
              setShowSignUp(false);
            }
          },
        } as any}
        route={{} as any}
      />
    );
  }

  return (
    <LoginScreen
      onForgotPassword={() => {
        // Implementar tela de recuperação de senha
        console.log('Esqueci minha senha');
      }}
      onRegister={() => {
        setShowSignUp(true);
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