import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingState({ 
  message = 'Carregando...', 
  size = 'large' 
}: LoadingStateProps): JSX.Element {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    message: {
      marginTop: theme.spacing.base,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}