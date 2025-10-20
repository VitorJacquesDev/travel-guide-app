import { UseCase } from '../base/UseCase';
import { AuthResult } from '../../repositories/AuthRepository';

/**
 * Parameters for sign in use case
 */
export interface SignInParams {
  readonly email: string;
  readonly password: string;
}

/**
 * Use case for user authentication
 * Handles user sign in with email and password validation
 */
export interface SignInUseCase extends UseCase<SignInParams, AuthResult> {
  /**
   * Sign in user with email and password
   * @param params Sign in parameters containing email and password
   * @returns Promise resolving to authentication result
   * @throws AuthError if authentication fails or validation errors occur
   */
  execute(params: SignInParams): Promise<AuthResult>;
}