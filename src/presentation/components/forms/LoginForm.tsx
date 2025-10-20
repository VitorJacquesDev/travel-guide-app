import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema, LoginFormData } from '../../validation/authSchemas';

interface LoginFormProps {
  onForgotPassword?: (() => void) | null;
  onRegister?: (() => void) | null;
}

export function LoginForm({ onForgotPassword, onRegister }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="headlineMedium" style={styles.title}>
          Entrar
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Faça login para continuar
        </Text>

        <View style={styles.form}>
          <Input
            name="email"
            control={control}
            label="Email"
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            name="password"
            control={control}
            label="Senha"
            placeholder="Digite sua senha"
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title="Entrar"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.loginButton}
          />

          {onForgotPassword && (
            <Button
              title="Esqueci minha senha"
              onPress={onForgotPassword}
              mode="text"
            />
          )}

          {onRegister && (
            <Button
              title="Criar conta"
              onPress={onRegister}
              mode="outlined"
              style={styles.registerButton}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  form: {
    gap: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  registerButton: {
    marginTop: 8,
  },
});