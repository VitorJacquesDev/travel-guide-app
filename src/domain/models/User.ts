export interface User {
  id: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName?: string;
}