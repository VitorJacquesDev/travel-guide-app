/**
 * Authentication result containing user information
 */
export interface AuthResult {
  readonly user: AuthUser;
  readonly isNewUser: boolean;
}

/**
 * Authenticated user information
 */
export interface AuthUser {
  readonly uid: string;
  readonly email: string;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly emailVerified: boolean;
}

/**
 * Authentication error types
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid-credentials',
  USER_NOT_FOUND = 'user-not-found',
  EMAIL_ALREADY_IN_USE = 'email-already-in-use',
  WEAK_PASSWORD = 'weak-password',
  NETWORK_ERROR = 'network-error',
  TOO_MANY_REQUESTS = 'too-many-requests',
  UNKNOWN_ERROR = 'unknown-error',
}

/**
 * Authentication error with localized message
 */
export interface AuthError {
  readonly type: AuthErrorType;
  readonly message: string;
  readonly originalError?: Error;
}

/**
 * Repository interface for Authentication operations
 * Defines the contract for user authentication and session management
 */
export interface AuthRepository {
  /**
   * Sign in user with email and password
   * @param email User email address
   * @param password User password
   * @returns Promise resolving to authentication result
   * @throws AuthError if authentication fails
   */
  signIn(email: string, password: string): Promise<AuthResult>;

  /**
   * Sign up new user with email and password
   * @param email User email address
   * @param password User password
   * @param displayName User display name
   * @returns Promise resolving to authentication result
   * @throws AuthError if registration fails
   */
  signUp(email: string, password: string, displayName: string): Promise<AuthResult>;

  /**
   * Sign out current user
   * @returns Promise resolving when sign out completes
   */
  signOut(): Promise<void>;

  /**
   * Get current authenticated user
   * @returns Promise resolving to current user or null if not authenticated
   */
  getCurrentUser(): Promise<AuthUser | null>;

  /**
   * Send password reset email
   * @param email User email address
   * @returns Promise resolving when email is sent
   * @throws AuthError if operation fails
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Update user profile information
   * @param updates Profile updates (displayName, photoURL)
   * @returns Promise resolving when update completes
   * @throws AuthError if operation fails
   */
  updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<void>;

  /**
   * Update user email address
   * @param newEmail New email address
   * @returns Promise resolving when update completes
   * @throws AuthError if operation fails
   */
  updateEmail(newEmail: string): Promise<void>;

  /**
   * Update user password
   * @param newPassword New password
   * @returns Promise resolving when update completes
   * @throws AuthError if operation fails
   */
  updatePassword(newPassword: string): Promise<void>;

  /**
   * Send email verification to current user
   * @returns Promise resolving when verification email is sent
   * @throws AuthError if operation fails
   */
  sendEmailVerification(): Promise<void>;

  /**
   * Reload current user data from server
   * @returns Promise resolving when reload completes
   */
  reloadUser(): Promise<void>;

  /**
   * Listen to authentication state changes
   * @param callback Function called when auth state changes
   * @returns Unsubscribe function to stop listening
   */
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;

  /**
   * Check if user is currently authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean;

  /**
   * Get current user's ID token
   * @param forceRefresh Whether to force token refresh
   * @returns Promise resolving to ID token or null if not authenticated
   */
  getIdToken(forceRefresh?: boolean): Promise<string | null>;
}