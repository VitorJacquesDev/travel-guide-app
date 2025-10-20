import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { resetPasswordSchema, ResetPasswordFormData } from '../../validation/authSchemas';

interface PasswordResetFormProps {
  onBack?: (() => void) | null;
}

export function PasswordResetForm({ onBack }: PasswordResetFormProps) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      await resetPassword(data.email);
      setEmailSent(true);
      Alert.alert(
        'Email Enviado',
        'Verifique sua caixa de entrada para redefinir sua senha.'
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email');
    if (email) {
      try {
        setLoading(true);
        await resetPassword(email);
        Alert.alert(
          'Email Reenviado',
          'Verifique sua caixa de entrada novamente.'
        );
      } catch (error: any) {
        Alert.alert('Erro', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (emailSent) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.successContainer}>
            <Text variant="displaySmall" style={styles.successIcon}>
              ✉️
            </Text>
            <Text variant="headlineMedium" style={styles.successTitle}>
              Email Enviado!
            </Text>
            <Text variant="bodyMedium" style={styles.successMessage}>
              Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </Text>
            <Text variant="bodySmall" style={styles.spamMessage}>
              Não encontrou o email? Verifique sua pasta de spam.
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                title="Reenviar Email"
                onPress={handleResendEmail}
                loading={loading}
                mode="outlined"
                style={styles.resendButton}
              />

              {onBack && (
                <Button
                  title="Voltar ao Login"
                  onPress={onBack}
                  style={styles.backButton}
                />
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="headlineMedium" style={styles.title}>
          Recuperar Senha
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Digite seu email e enviaremos um link para redefinir sua senha
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

          <Button
            title="Enviar Link de Recuperação"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.resetButton}
          />

          {onBack && (
            <Button
              title="← Voltar ao Login"
              onPress={onBack}
              mode="text"
              style={styles.backToLoginButton}
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
  resetButton: {
    marginTop: 8,
  },
  backToLoginButton: {
    marginTop: 8,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.8,
  },
  spamMessage: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.6,
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
  },
  resendButton: {
    marginBottom: 8,
  },
  backButton: {
    marginTop: 8,
  },
});