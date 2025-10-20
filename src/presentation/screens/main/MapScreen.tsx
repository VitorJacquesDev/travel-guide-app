import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Map'>;

export default function MapScreen({ navigation }: Props): JSX.Element {
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
      <Text style={styles.title}>Mapa</Text>
      <Text style={styles.message}>
        Aqui será exibido o mapa com pontos turísticos
      </Text>
    </View>
  );
}