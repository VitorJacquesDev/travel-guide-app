import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { MainTabScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';

type Props = MainTabScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props): JSX.Element {
  const { user, logout } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 8,
      textAlign: 'center',
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao ViagemFácil!</Text>
      <Text style={styles.subtitle}>Olá, {user?.displayName || user?.email}!</Text>
      <Text style={styles.userInfo}>Email: {user?.email}</Text>
      <Text style={styles.userInfo}>
        Email verificado: {user?.emailVerified ? 'Sim' : 'Não'}
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