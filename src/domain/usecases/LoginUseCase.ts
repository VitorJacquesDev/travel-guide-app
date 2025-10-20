import { AuthRepository } from '../repositories/AuthRepository';
import { LoginCredentials, User } from '../models/User';

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<User> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email e senha são obrigatórios');
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Email inválido');
    }

    if (credentials.password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    return await this.authRepository.login(credentials);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}