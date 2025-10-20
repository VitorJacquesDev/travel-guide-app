import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  style?: any;
}

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  mode = 'contained',
  style,
}: ButtonProps) {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      style={[styles.button, style]}
      contentStyle={styles.buttonContent}
    >
      {title}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});