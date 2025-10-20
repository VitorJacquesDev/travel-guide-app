import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/presentation/contexts/AuthContext';
import SignUpScreen from './src/presentation/screens/auth/SignUpScreen';

// Mock navigation props for testing
const mockNavigation = {
  navigate: (screen: string) => {
    console.log(`Navegando para: ${screen}`);
  },
  goBack: () => {
    console.log('Voltando');
  },
} as any;

const mockRoute = {
  key: 'SignUp',
  name: 'SignUp' as const,
  params: undefined,
} as any;

export default function TestSignUp() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <SignUpScreen navigation={mockNavigation} route={mockRoute} />
          <StatusBar style="auto" />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}