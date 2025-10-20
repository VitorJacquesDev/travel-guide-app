import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Search'>;

export default function SearchScreen({ navigation }: Props): JSX.Element {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
        <Text style={styles.subtitle}>Encontre pontos turísticos</Text>
      </View>
      
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Funcionalidade de busca será implementada na Task 4.2
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  placeholder: {
    margin: 24,
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