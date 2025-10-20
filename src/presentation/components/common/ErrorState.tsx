import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export default function ErrorState({
  title = 'Ops! Algo deu errado',
  message = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
  retryText = 'Tentar novamente',
}: ErrorStateProps): JSX.Element {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    icon: {
      marginBottom: theme.spacing.base,
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    message: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
      marginBottom: theme.spacing.xl,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    retryText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
    },
  });

  return (
    <View style={styles.container}>
      <Ionicons 
        name="alert-circle-outline" 
        size={48} 
        color={theme.colors.error} 
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}