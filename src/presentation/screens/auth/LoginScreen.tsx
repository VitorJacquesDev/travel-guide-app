import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthStackScreenProps } from '../../navigation/types';

type Props = AuthStackScreenProps<'Login'>;

export default function LoginScreen({ navigation }: Props): JSX.Element {
  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>
      
      {/* Login form will be implemented in Task 2 */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Formulário de login será implementado na Task 2
        </Text>
      </View>
      
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>
          Não tem conta? <Text style={styles.signUpLink}>Cadastre-se</Text>
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
  signUpButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#666666',
  },
  signUpLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});