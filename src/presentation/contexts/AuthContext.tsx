import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/core/config/firebase';
import { User } from '@/domain/models/User';
import { FirebaseAuthRepository } from '@/data/repositories/FirebaseAuthRepository';
import { LoginUseCase } from '@/domain/usecases/LoginUseCase';
import { GetCurrentUserUseCase } from '@/domain/usecases/GetCurrentUserUseCase';
import { SignUpUseCaseImpl } from '@/data/usecases/auth/SignUpUseCaseImpl';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Dependency injection
  const authRepository = new FirebaseAuthRepository();
  const loginUseCase = new LoginUseCase(authRepository);
  const signUpUseCase = new SignUpUseCaseImpl(authRepository);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const domainUser = await getCurrentUserUseCase.execute();
          setUser(domainUser);
        } catch (error) {
          console.error('Erro ao obter usuário atual:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const loggedUser = await loginUseCase.execute({ email, password });
      setUser(loggedUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      setLoading(true);
      const result = await signUpUseCase.execute({ email, password, displayName });
      setUser(result.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authRepository.logout();
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await authRepository.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signUp,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}