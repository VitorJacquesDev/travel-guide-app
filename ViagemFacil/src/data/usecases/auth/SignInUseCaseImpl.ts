import { SignInUseCase, SignInParams } from '@/domain/usecases/auth/SignInUseCase';
import { AuthRepository, AuthResult } from '@/domain/repositories/AuthRepository';

/**
 * Validation error for sign in parameters
 */
export class SignInValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SignInValidationError';
  }
}

/**
 * Implementation of SignInUseCase
 * Handles user authentication with validation
 */
export class SignInUseCaseImpl implements SignInUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Validate email format
   */
  private validateEmail(email: string): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      throw new SignInValidationError('Email é obrigatório');
    }
    if (!emailRegex.test(email)) {
      throw new SignInValidationError('Formato de email inválido');
    }
  }

  /**
   * Validate password
   */
  private validatePassword(password: string): void {
    if (!password) {
      throw new SignInValidationError('Senha é obrigatória');
    }
    if (password.length < 6) {
      throw new SignInValidationError('Senha deve ter pelo menos 6 caracteres');
    }
  }

  /**
   * Validate sign in parameters
   */
  private validateParams(params: SignInParams): void {
    this.validateEmail(params.email);
    this.validatePassword(params.password);
  }

  async execute(params: SignInParams): Promise<AuthResult> {
    // Validate input parameters
    this.validateParams(params);

    // Normalize email
    const normalizedEmail = params.email.toLowerCase().trim();

    // Attempt sign in
    return await this.authRepository.signIn(normalizedEmail, params.password);
  }
}