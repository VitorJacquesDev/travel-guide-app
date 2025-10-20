import { UseCase } from '../base/UseCase';
import { AuthResult } from '../../repositories/AuthRepository';

/**
 * Parameters for sign up use case
 */
export interface SignUpParams {
  readonly email: string;
  readonly password: string;
  readonly displayName: string;
}

/**
 * Use case for user registration
 * Handles new user account creation with validation
 */
export interface SignUpUseCase extends UseCase<SignUpParams, AuthResult> {
  /**
   * Register new user with email, password, and display name
   * @param params Sign up parameters containing user information
   * @returns Promise resolving to authentication result
   * @throws AuthError if registration fails or validation errors occur
   */
  execute(params: SignUpParams): Promise<AuthResult>;
}