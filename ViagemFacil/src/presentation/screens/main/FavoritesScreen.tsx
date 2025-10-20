import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Favorites'>;

export default function FavoritesScreen({ navigation }: Props): JSX.Element {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>Seus lugares salvos</Text>
      </View>
      
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Sistema de favoritos será implementado na Task 6
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