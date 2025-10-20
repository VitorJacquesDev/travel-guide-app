import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { MainTabScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';

type Props = MainTabScreenProps<'Profile'>;

export default function ProfileScreen({ navigation }: Props): JSX.Element {
  const { user, logout } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      marginTop: 40,
    },
    userInfo: {
      marginBottom: 16,
    },
    infoText: {
      fontSize: 16,
      marginBottom: 8,
    },
    logoutButton: {
      marginTop: 24,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.userInfo}>
        <Text style={styles.infoText}>
          Nome: {user?.displayName || 'Não informado'}
        </Text>
        <Text style={styles.infoText}>
          Email: {user?.email}
        </Text>
        <Text style={styles.infoText}>
          Email verificado: {user?.emailVerified ? 'Sim' : 'Não'}
        </Text>
      </View>
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