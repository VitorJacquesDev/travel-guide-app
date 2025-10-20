import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { passwordResetSchema, PasswordResetFormData } from '@/presentation/validation/authSchemas';

/**
 * Password reset screen props
 */
interface PasswordResetScreenProps {
  onNavigateBack: () => void;
}

/**
 * Password reset screen component
 * Handles password reset email sending
 */
export const PasswordResetScreen: React.FC<PasswordResetScreenProps> = ({ onNavigateBack }) => {
  const { sendPasswordResetEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: PasswordResetFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(data.email);
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao enviar email de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend password reset email
   */
  const resendEmail = async (): Promise<void> => {
    const email = getValues('email');
    if (email) {
      setIsLoading(true);
      try {
        await sendPasswordResetEmail(email);
        Alert.alert('Email Reenviado', 'Verifique sua caixa de entrada novamente.');
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Erro ao reenviar email');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✉️</Text>
          </View>
          <Text style={styles.successTitle}>Email Enviado!</Text>
          <Text style={styles.successMessage}>
            Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada e siga as
            instruções para redefinir sua senha.
          </Text>
          <Text style={styles.checkSpamText}>
            Não encontrou o email? Verifique sua pasta de spam.
          </Text>

          <TouchableOpacity
            onPress={resendEmail}
            style={styles.resendButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <Text style={styles.resendButtonText}>Reenviar Email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            Digite seu email e enviaremos um link para redefinir sua senha
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Digite seu email"
                  placeholderTextColor="#999999"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={[styles.resetButton, isLoading && styles.buttonDisabled]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.resetButtonText}>Enviar Link de Recuperação</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onNavigateBack} style={styles.backToLoginButton}>
          <Text style={styles.backToLoginText}>← Voltar ao Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backToLoginButton: {
    alignSelf: 'center',
  },
  backToLoginText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  checkSpamText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 32,
  },
  resendButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  resendButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});