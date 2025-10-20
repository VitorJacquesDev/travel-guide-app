import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/core/config/firebase';
import { AuthRepository, AuthResult } from '@/domain/repositories/AuthRepository';
import { User, LoginCredentials, RegisterCredentials } from '@/domain/models/User';

export class FirebaseAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      return this.mapFirebaseUserToDomain(userCredential.user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      if (credentials.displayName) {
        await updateProfile(userCredential.user, {
          displayName: credentials.displayName,
        });
      }

      return this.mapFirebaseUserToDomain(userCredential.user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  async signUp(email: string, password: string, displayName: string): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      const user = this.mapFirebaseUserToDomain(userCredential.user);
      
      return {
        user,
        isNewUser: true,
      };
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return null;
    }
    return this.mapFirebaseUserToDomain(firebaseUser);
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await updateProfile(firebaseUser, {
        displayName: userData.displayName || null,
        photoURL: userData.photoURL || null,
      });

      return this.mapFirebaseUserToDomain(firebaseUser);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  private mapFirebaseUserToDomain(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL || null,
      emailVerified: firebaseUser.emailVerified,
      createdAt: new Date(firebaseUser.metadata.creationTime!),
      lastLoginAt: firebaseUser.metadata.lastSignInTime
        ? new Date(firebaseUser.metadata.lastSignInTime)
        : null,
    };
  }

  private mapFirebaseError(error: any): Error {
    switch (error.code) {
      case 'auth/user-not-found':
        return new Error('Usuário não encontrado');
      case 'auth/wrong-password':
        return new Error('Senha incorreta');
      case 'auth/email-already-in-use':
        return new Error('Este email já está em uso');
      case 'auth/weak-password':
        return new Error('A senha é muito fraca');
      case 'auth/invalid-email':
        return new Error('Email inválido');
      case 'auth/too-many-requests':
        return new Error('Muitas tentativas. Tente novamente mais tarde');
      default:
        return new Error(error.message || 'Erro de autenticação');
    }
  }
}