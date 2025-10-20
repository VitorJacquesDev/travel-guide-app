import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Search'>;

export default function SearchScreen({ navigation }: Props): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');

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
    searchContainer: {
      marginBottom: 16,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      fontSize: 16,
      textAlign: 'center',
      color: '#666',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar</Text>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar pontos turísticos..."
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>
          {searchQuery.length === 0 
            ? 'Digite algo para buscar pontos turísticos'
            : `Buscando por: "${searchQuery}"`
          }
        </Text>
      </View>
    </View>
  );
}