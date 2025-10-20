import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { AuthUser } from '@/domain/repositories/AuthRepository';

// Mock Firebase Auth Repository
jest.mock('@/data/repositories/FirebaseAuthRepository', () => ({
  FirebaseAuthRepository: jest.fn().mockImplementation(() => ({
    onAuthStateChanged: jest.fn((callback) => {
      // Simulate initial auth state
      callback(null);
      return jest.fn(); // unsubscribe function
    }),
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  })),
}));

// Mock use cases
jest.mock('@/data/usecases/auth/SignInUseCaseImpl', () => ({
  SignInUseCaseImpl: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
}));

jest.mock('@/data/usecases/auth/SignUpUseCaseImpl', () => ({
  SignUpUseCaseImpl: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
}));

// Test component to access auth context
const TestComponent: React.FC = () => {
  const auth = useAuth();
  return null;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AuthProvider', () => {
    it('should provide initial auth state', async () => {
      let authState: any;

      const TestConsumer: React.FC = () => {
        authState = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authState.user).toBeNull();
        expect(authState.isAuthenticated).toBe(false);
        expect(authState.isLoading).toBe(false);
      });
    });

    it('should update state when user signs in', async () => {
      const mockUser: AuthUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        emailVerified: true,
      };

      let authState: any;
      let onAuthStateChangedCallback: (user: AuthUser | null) => void;

      // Mock the auth repository to capture the callback
      const { FirebaseAuthRepository } = require('@/data/repositories/FirebaseAuthRepository');
      FirebaseAuthRepository.mockImplementation(() => ({
        onAuthStateChanged: jest.fn((callback) => {
          onAuthStateChangedCallback = callback;
          callback(null); // Initial state
          return jest.fn();
        }),
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        sendPasswordResetEmail: jest.fn(),
      }));

      const TestConsumer: React.FC = () => {
        authState = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      // Simulate user sign in
      act(() => {
        onAuthStateChangedCallback(mockUser);
      });

      await waitFor(() => {
        expect(authState.user).toEqual(mockUser);
        expect(authState.isAuthenticated).toBe(true);
        expect(authState.isLoading).toBe(false);
      });
    });

    it('should handle sign in method', async () => {
      const mockExecute = jest.fn().mockResolvedValue({
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: null,
          emailVerified: true,
        },
        isNewUser: false,
      });

      const { SignInUseCaseImpl } = require('@/data/usecases/auth/SignInUseCaseImpl');
      SignInUseCaseImpl.mockImplementation(() => ({
        execute: mockExecute,
      }));

      let authState: any;

      const TestConsumer: React.FC = () => {
        authState = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await act(async () => {
        await authState.signIn('test@example.com', 'password123');
      });

      expect(mockExecute).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle sign up method', async () => {
      const mockExecute = jest.fn().mockResolvedValue({
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: null,
          emailVerified: false,
        },
        isNewUser: true,
      });

      const { SignUpUseCaseImpl } = require('@/data/usecases/auth/SignUpUseCaseImpl');
      SignUpUseCaseImpl.mockImplementation(() => ({
        execute: mockExecute,
      }));

      let authState: any;

      const TestConsumer: React.FC = () => {
        authState = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await act(async () => {
        await authState.signUp('test@example.com', 'password123', 'Test User');
      });

      expect(mockExecute).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      });
    });

    it('should handle sign out method', async () => {
      const mockSignOut = jest.fn().mockResolvedValue(undefined);

      const { FirebaseAuthRepository } = require('@/data/repositories/FirebaseAuthRepository');
      FirebaseAuthRepository.mockImplementation(() => ({
        onAuthStateChanged: jest.fn((callback) => {
          callback(null);
          return jest.fn();
        }),
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: mockSignOut,
        sendPasswordResetEmail: jest.fn(),
      }));

      let authState: any;

      const TestConsumer: React.FC = () => {
        authState = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await act(async () => {
        await authState.signOut();
      });

      expect(mockSignOut).toHaveBeenCalled();
    });

    it('should handle password reset email', async () => {
      const mockSendPasswordResetEmail = jest.fn().mockResolvedValue(undefined);

      const { FirebaseAuthRepository } = require('@/data/repositories/FirebaseAuthRepository');
      FirebaseAuthRepository.mockImplementation(() => ({
        onAuthStateChanged: jest.fn((callback) => {
          callback(null);
          return jest.fn();
        }),
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        sendPasswordResetEmail: mockSendPasswordResetEmail,
      }));

      let authState: any;

      const TestConsumer: React.FC = () => {
        authState = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await act(async () => {
        await authState.sendPasswordResetEmail('test@example.com');
      });

      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle errors in auth methods', async () => {
      const mockError = new Error('Authentication failed');
      const mockExecute = jest.fn().mockRejectedValue(mockError);

      const { SignInUseCaseImpl } = require('@/data/usecases/auth/SignInUseCaseImpl');
      SignInUseCaseImpl.mockImplementation(() => ({
        execute: mockExecute,
      }));

      let authState: any;

      const TestConsumer: React.FC = () => {
        authState = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await expect(
        act(async () => {
          await authState.signIn('test@example.com', 'wrongpassword');
        })
      ).rejects.toThrow('Authentication failed');

      // Loading should be reset after error
      await waitFor(() => {
        expect(authState.isLoading).toBe(false);
      });
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});