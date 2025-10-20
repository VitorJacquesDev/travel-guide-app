import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RootStackScreenProps } from '../../navigation/types';

type Props = RootStackScreenProps<'PointDetails'>;

export default function PointDetailsScreen({ route, navigation }: Props): JSX.Element {
  const { pointId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Detalhes do Ponto Turístico</Text>
        <Text style={styles.pointId}>ID: {pointId}</Text>
        
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Detalhes completos do ponto turístico serão implementados nas próximas tasks
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  pointId: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  placeholder: {
    padding: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});