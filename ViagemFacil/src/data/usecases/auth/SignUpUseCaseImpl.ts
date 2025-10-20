import { SignUpUseCase, SignUpParams } from '@/domain/usecases/auth/SignUpUseCase';
import { AuthRepository, AuthResult } from '@/domain/repositories/AuthRepository';

/**
 * Validation error for sign up parameters
 */
export class SignUpValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SignUpValidationError';
  }
}

/**
 * Implementation of SignUpUseCase
 * Handles user registration with validation
 */
export class SignUpUseCaseImpl implements SignUpUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Validate email format
   */
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      throw new SignUpValidationError('Email é obrigatório');
    }
    if (!emailRegex.test(email)) {
      throw new SignUpValidationError('Formato de email inválido');
    }
  }

  /**
   * Validate password strength
   */
  private validatePassword(password: string): void {
    if (!password) {
      throw new SignUpValidationError('Senha é obrigatória');
    }
    if (password.length < 6) {
      throw new SignUpValidationError('Senha deve ter pelo menos 6 caracteres');
    }
    if (password.length > 128) {
      throw new SignUpValidationError('Senha muito longa (máximo 128 caracteres)');
    }
    
    // Check for at least one letter and one number for better security
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasLetter || !hasNumber) {
      throw new SignUpValidationError('Senha deve conter pelo menos uma letra e um número');
    }
  }

  /**
   * Validate display name
   */
  private validateDisplayName(displayName: string): void {
    if (!displayName.trim()) {
      throw new SignUpValidationError('Nome é obrigatório');
    }
    if (displayName.trim().length < 2) {
      throw new SignUpValidationError('Nome deve ter pelo menos 2 caracteres');
    }
    if (displayName.trim().length > 50) {
      throw new SignUpValidationError('Nome muito longo (máximo 50 caracteres)');
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const validNameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!validNameRegex.test(displayName.trim())) {
      throw new SignUpValidationError('Nome contém caracteres inválidos');
    }
  }

  /**
   * Validate sign up parameters
   */
  private validateParams(params: SignUpParams): void {
    this.validateEmail(params.email);
    this.validatePassword(params.password);
    this.validateDisplayName(params.displayName);
  }

  async execute(params: SignUpParams): Promise<AuthResult> {
    // Validate input parameters
    this.validateParams(params);

    // Normalize inputs
    const normalizedEmail = params.email.toLowerCase().trim();
    const normalizedDisplayName = params.displayName.trim();

    // Attempt sign up
    return await this.authRepository.signUp(
      normalizedEmail,
      params.password,
      normalizedDisplayName
    );
  }
}