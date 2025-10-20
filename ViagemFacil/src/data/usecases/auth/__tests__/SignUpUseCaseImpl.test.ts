import { SignUpUseCaseImpl, SignUpValidationError } from '../SignUpUseCaseImpl';
import { AuthRepository, AuthResult, AuthUser, AuthError, AuthErrorType } from '@/domain/repositories/AuthRepository';

// Mock AuthRepository
class MockAuthRepository implements AuthRepository {
  signIn = jest.fn();
  signUp = jest.fn();
  signOut = jest.fn();
  getCurrentUser = jest.fn();
  sendPasswordResetEmail = jest.fn();
  updateProfile = jest.fn();
  updateEmail = jest.fn();
  updatePassword = jest.fn();
  sendEmailVerification = jest.fn();
  reloadUser = jest.fn();
  onAuthStateChanged = jest.fn();
  isAuthenticated = jest.fn();
  getIdToken = jest.fn();
}

describe('SignUpUseCaseImpl', () => {
  let mockAuthRepository: MockAuthRepository;
  let signUpUseCase: SignUpUseCaseImpl;

  beforeEach(() => {
    mockAuthRepository = new MockAuthRepository();
    signUpUseCase = new SignUpUseCaseImpl(mockAuthRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validUser: AuthUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
      emailVerified: false,
    };

    const validAuthResult: AuthResult = {
      user: validUser,
      isNewUser: true,
    };

    it('should sign up successfully with valid data', async () => {
      // Arrange
      const params = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      };
      mockAuthRepository.signUp.mockResolvedValue(validAuthResult);

      // Act
      const result = await signUpUseCase.execute(params);

      // Assert
      expect(mockAuthRepository.signUp).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'Test User'
      );
      expect(result).toEqual(validAuthResult);
    });

    it('should normalize email and display name', async () => {
      // Arrange
      const params = {
        email: '  TEST@EXAMPLE.COM  ',
        password: 'password123',
        displayName: '  Test User  ',
      };
      mockAuthRepository.signUp.mockResolvedValue(validAuthResult);

      // Act
      await signUpUseCase.execute(params);

      // Assert
      expect(mockAuthRepository.signUp).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'Test User'
      );
    });

    describe('email validation', () => {
      it('should throw validation error for empty email', async () => {
        const params = {
          email: '',
          password: 'password123',
          displayName: 'Test User',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Email é obrigatório');
      });

      it('should throw validation error for invalid email format', async () => {
        const params = {
          email: 'invalid-email',
          password: 'password123',
          displayName: 'Test User',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Formato de email inválido');
      });
    });

    describe('password validation', () => {
      it('should throw validation error for empty password', async () => {
        const params = {
          email: 'test@example.com',
          password: '',
          displayName: 'Test User',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Senha é obrigatória');
      });

      it('should throw validation error for short password', async () => {
        const params = {
          email: 'test@example.com',
          password: '12345',
          displayName: 'Test User',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Senha deve ter pelo menos 6 caracteres');
      });

      it('should throw validation error for too long password', async () => {
        const params = {
          email: 'test@example.com',
          password: 'a'.repeat(129),
          displayName: 'Test User',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Senha muito longa (máximo 128 caracteres)');
      });

      it('should throw validation error for password without letter', async () => {
        const params = {
          email: 'test@example.com',
          password: '123456',
          displayName: 'Test User',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Senha deve conter pelo menos uma letra e um número');
      });

      it('should throw validation error for password without number', async () => {
        const params = {
          email: 'test@example.com',
          password: 'password',
          displayName: 'Test User',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Senha deve conter pelo menos uma letra e um número');
      });

      it('should accept password with letters and numbers', async () => {
        const params = {
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User',
        };
        mockAuthRepository.signUp.mockResolvedValue(validAuthResult);

        await expect(signUpUseCase.execute(params)).resolves.toEqual(validAuthResult);
      });
    });

    describe('display name validation', () => {
      it('should throw validation error for empty display name', async () => {
        const params = {
          email: 'test@example.com',
          password: 'password123',
          displayName: '',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Nome é obrigatório');
      });

      it('should throw validation error for short display name', async () => {
        const params = {
          email: 'test@example.com',
          password: 'password123',
          displayName: 'A',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Nome deve ter pelo menos 2 caracteres');
      });

      it('should throw validation error for too long display name', async () => {
        const params = {
          email: 'test@example.com',
          password: 'password123',
          displayName: 'A'.repeat(51),
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Nome muito longo (máximo 50 caracteres)');
      });

      it('should throw validation error for display name with invalid characters', async () => {
        const params = {
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test@User123',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Nome contém caracteres inválidos');
      });

      it('should accept valid display names with accents and hyphens', async () => {
        const validNames = [
          'João Silva',
          'María José',
          'Jean-Pierre',
          "O'Connor",
          'José da Silva',
        ];

        mockAuthRepository.signUp.mockResolvedValue(validAuthResult);

        for (const displayName of validNames) {
          const params = {
            email: 'test@example.com',
            password: 'password123',
            displayName,
          };

          await expect(signUpUseCase.execute(params)).resolves.toEqual(validAuthResult);
        }
      });

      it('should handle whitespace-only display name', async () => {
        const params = {
          email: 'test@example.com',
          password: 'password123',
          displayName: '   ',
        };

        await expect(signUpUseCase.execute(params)).rejects.toThrow(SignUpValidationError);
        await expect(signUpUseCase.execute(params)).rejects.toThrow('Nome é obrigatório');
      });
    });

    it('should propagate auth repository errors', async () => {
      // Arrange
      const params = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      };
      const authError: AuthError = {
        type: AuthErrorType.EMAIL_ALREADY_IN_USE,
        message: 'Email already in use',
      };
      mockAuthRepository.signUp.mockRejectedValue(authError);

      // Act & Assert
      await expect(signUpUseCase.execute(params)).rejects.toEqual(authError);
      expect(mockAuthRepository.signUp).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'Test User'
      );
    });
  });
});