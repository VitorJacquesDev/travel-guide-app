import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser } from '@/domain/repositories/AuthRepository';
import { FirebaseAuthRepository } from '@/data/repositories/FirebaseAuthRepository';
import { SignInUseCaseImpl } from '@/data/usecases/auth/SignInUseCaseImpl';
import { SignUpUseCaseImpl } from '@/data/usecases/auth/SignUpUseCaseImpl';

/**
 * Authentication state interface
 */
export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Authentication context interface
 */
export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 * Manages global authentication state and provides auth methods
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize repositories and use cases
  const authRepository = new FirebaseAuthRepository();
  const signInUseCase = new SignInUseCaseImpl(authRepository);
  const signUpUseCase = new SignUpUseCaseImpl(authRepository);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Sign in user
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await signInUseCase.execute({ email, password });
      // User state will be updated by the auth state listener
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Sign up new user
   */
  const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
    setIsLoading(true);
    try {
      await signUpUseCase.execute({ email, password, displayName });
      // User state will be updated by the auth state listener
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Sign out user
   */
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authRepository.signOut();
      // User state will be updated by the auth state listener
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Send password reset email
   */
  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    await authRepository.sendPasswordResetEmail(email);
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use authentication context
 * @returns Authentication context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};