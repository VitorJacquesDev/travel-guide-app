import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  showFilter?: boolean;
  onSubmit?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar pontos turísticos...',
  onFilterPress,
  showFilter = false,
  onSubmit,
}: SearchBarProps): JSX.Element {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.base,
      marginVertical: theme.spacing.sm,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
    },
    filterButton: {
      marginLeft: theme.spacing.sm,
      padding: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <Ionicons 
        name="search" 
        size={20} 
        color={theme.colors.textSecondary} 
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {showFilter && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons 
            name="options-outline" 
            size={20} 
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}