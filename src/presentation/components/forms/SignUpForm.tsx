import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { signUpSchema, SignUpFormData } from '../../validation/authSchemas';

interface SignUpFormProps {
  onLogin?: (() => void) | null;
}

export function SignUpForm({ onLogin }: SignUpFormProps) {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      await signUp(data.email, data.password, data.displayName);
      Alert.alert(
        'Cadastro Realizado',
        'Sua conta foi criada com sucesso! Você já está logado.'
      );
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="headlineMedium" style={styles.title}>
          Criar Conta
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Preencha os dados para se cadastrar
        </Text>

        <View style={styles.form}>
          <Input
            name="displayName"
            control={control}
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            autoCapitalize="words"
          />

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

          <Input
            name="confirmPassword"
            control={control}
            label="Confirmar Senha"
            placeholder="Digite sua senha novamente"
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title="Criar Conta"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.signUpButton}
          />

          {onLogin && (
            <Button
              title="Já tem conta? Entrar"
              onPress={onLogin}
              mode="text"
              style={styles.loginButton}
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
  signUpButton: {
    marginTop: 8,
  },
  loginButton: {
    marginTop: 8,
  },
});