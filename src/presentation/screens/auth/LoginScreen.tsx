import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { LoginForm } from '../../components/forms/LoginForm';

interface LoginScreenProps {
  onForgotPassword?: (() => void) | null;
  onRegister?: (() => void) | null;
}

export function LoginScreen({ onForgotPassword, onRegister }: LoginScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text variant="displaySmall" style={styles.appTitle}>
              ViagemFácil
            </Text>
            <Text variant="bodyLarge" style={styles.appSubtitle}>
              Descubra os melhores destinos
            </Text>
          </View>

          <LoginForm
            onForgotPassword={onForgotPassword}
            onRegister={onRegister}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  appTitle: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  appSubtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
});