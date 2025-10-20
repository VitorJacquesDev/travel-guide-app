import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/presentation/contexts/AuthContext';
import { AuthExampleScreen } from './src/presentation/screens/auth/AuthExampleScreen';

export default function TestLogin() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <AuthExampleScreen />
          <StatusBar style="auto" />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}