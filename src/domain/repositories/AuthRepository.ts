import { User, LoginCredentials, RegisterCredentials } from '../models/User';

export interface AuthResult {
  user: User;
  isNewUser?: boolean;
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  register(credentials: RegisterCredentials): Promise<User>;
  signUp(email: string, password: string, displayName: string): Promise<AuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  resetPassword(email: string): Promise<void>;
  updateProfile(user: Partial<User>): Promise<User>;
}