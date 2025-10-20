import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'PointDetails'>;

export default function PointDetailsScreen({ navigation, route }: Props): JSX.Element {
  const { pointId } = route.params;

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
      marginBottom: 24,
    },
    backButton: {
      marginTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Ponto</Text>
      <Text style={styles.message}>
        Detalhes do ponto turístico: {pointId}
      </Text>
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        Voltar
      </Button>
    </View>
  );
}