import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Favorites'>;

export default function FavoritesScreen({ navigation }: Props): JSX.Element {
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
    },
    message: {
      fontSize: 16,
      textAlign: 'center',
      color: '#666',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      <Text style={styles.message}>
        Seus pontos turísticos favoritos aparecerão aqui
      </Text>
    </View>
  );
}