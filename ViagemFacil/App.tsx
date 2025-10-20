import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/presentation/contexts/AuthContext';
import { FavoritesProvider } from './src/presentation/contexts/FavoritesContext';
import { ThemeProvider } from './src/presentation/theme';
import { RootNavigator } from './src/presentation/navigation';
import { ErrorBoundary, NetworkStatusBar } from './src/presentation/components';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <FavoritesProvider>
              <RootNavigator />
              <NetworkStatusBar />
              <StatusBar style="auto" />
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}