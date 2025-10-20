import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthStackScreenProps } from '../../navigation/types';

type Props = AuthStackScreenProps<'SignUp'>;

export default function SignUpScreen({ navigation }: Props): JSX.Element {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar</Text>
      <Text style={styles.subtitle}>Crie sua conta para começar</Text>
      
      {/* SignUp form will be implemented in Task 2 */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Formulário de cadastro será implementado na Task 2
        </Text>
      </View>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>
          Já tem conta? <Text style={styles.loginLink}>Entrar</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  loginButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});