import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  reload,
  User,
  AuthError as FirebaseAuthError,
} from 'firebase/auth';
import { auth } from '@/core/config/firebase';
import {
  AuthRepository,
  AuthResult,
  AuthUser,
  AuthError,
  AuthErrorType,
} from '@/domain/repositories/AuthRepository';

/**
 * Firebase implementation of AuthRepository
 * Handles user authentication using Firebase Auth
 */
export class FirebaseAuthRepository implements AuthRepository {
  /**
   * Convert Firebase User to AuthUser
   */
  private mapFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  }

  /**
   * Convert Firebase AuthError to AuthError
   */
  private mapFirebaseError(error: FirebaseAuthError): AuthError {
    let type: AuthErrorType;
    let message: string;

    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        type = AuthErrorType.INVALID_CREDENTIALS;
        message = 'Email ou senha incorretos';
        break;
      case 'auth/user-not-found':
        type = AuthErrorType.USER_NOT_FOUND;
        message = 'Usuário não encontrado';
        break;
      case 'auth/email-already-in-use':
        type = AuthErrorType.EMAIL_ALREADY_IN_USE;
        message = 'Este email já está em uso';
        break;
      case 'auth/weak-password':
        type = AuthErrorType.WEAK_PASSWORD;
        message = 'A senha deve ter pelo menos 6 caracteres';
        break;
      case 'auth/network-request-failed':
        type = AuthErrorType.NETWORK_ERROR;
        message = 'Erro de conexão. Verifique sua internet';
        break;
      case 'auth/too-many-requests':
        type = AuthErrorType.TOO_MANY_REQUESTS;
        message = 'Muitas tentativas. Tente novamente mais tarde';
        break;
      default:
        type = AuthErrorType.UNKNOWN_ERROR;
        message = 'Erro desconhecido. Tente novamente';
    }

    return {
      type,
      message,
      originalError: error,
    };
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = this.mapFirebaseUser(userCredential.user);
      
      return {
        user,
        isNewUser: false,
      };
    } catch (error) {
      throw this.mapFirebaseError(error as FirebaseAuthError);
    }
  }

  async signUp(email: string, password: string, displayName: string): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: displayName.trim(),
      });

      // Reload user to get updated profile
      await reload(userCredential.user);

      const user = this.mapFirebaseUser(userCredential.user);
      
      return {
        user,
        isNewUser: true,
      };
    } catch (error) {
      throw this.mapFirebaseError(error as FirebaseAuthError);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.mapFirebaseError(error as FirebaseAuthError);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const user = auth.currentUser;
    return user ? this.mapFirebaseUser(user) : null;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.mapFirebaseError(error as FirebaseAuthError);
    }
  }

  async updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await updateProfile(user, updates);
      await reload(user);
    } catch (error) {
      throw this.mapFirebaseError(error as FirebaseAuthError);
    }
  }

  async updateEmail(newEmail: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await updateEmail(user, newEmail);
    } catch (error) {
      throw this.mapFirebaseError(error as FirebaseAuthError);
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await updatePassword(user, newPassword);
    } catch (error) {
      throw this.mapFirebaseError(error as FirebaseAuthError);
    }
  }

  async sendEmailVerification(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await sendEmailVerification(user);
    } catch (error) {
      throw this.mapFirebaseError(error as FirebaseAuthError);
    }
  }

  async reloadUser(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await reload(user);
    } catch (error) {
      throw this.mapFirebaseError(error as FirebaseAuthError);
    }
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? this.mapFirebaseUser(user) : null);
    });
  }

  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    try {
      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }
}