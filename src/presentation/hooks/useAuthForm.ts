import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export function useAuthForm() {
  const [loading, setLoading] = useState(false);
  const { login, signUp, resetPassword } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      await login(email, password);
      return true;
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      await signUp(email, password, displayName);
      Alert.alert(
        'Cadastro Realizado',
        'Sua conta foi criada com sucesso! Você já está logado.'
      );
      return true;
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert(
        'Email Enviado',
        'Verifique sua caixa de entrada para redefinir sua senha.'
      );
      return true;
    } catch (error: any) {
      Alert.alert('Erro', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert(
        'Email Enviado',
        'Verifique sua caixa de entrada para redefinir sua senha.'
      );
      return true;
    } catch (error: any) {
      Alert.alert('Erro', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin,
    handleSignUp,
    handleResetPassword,
    handleForgotPassword,
  };
}