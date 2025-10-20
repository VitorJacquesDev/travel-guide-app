import { SignInUseCaseImpl, SignInValidationError } from '../SignInUseCaseImpl';
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

describe('SignInUseCaseImpl', () => {
  let mockAuthRepository: MockAuthRepository;
  let signInUseCase: SignInUseCaseImpl;

  beforeEach(() => {
    mockAuthRepository = new MockAuthRepository();
    signInUseCase = new SignInUseCaseImpl(mockAuthRepository);
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
      emailVerified: true,
    };

    const validAuthResult: AuthResult = {
      user: validUser,
      isNewUser: false,
    };

    it('should sign in successfully with valid credentials', async () => {
      // Arrange
      const params = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockAuthRepository.signIn.mockResolvedValue(validAuthResult);

      // Act
      const result = await signInUseCase.execute(params);

      // Assert
      expect(mockAuthRepository.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result).toEqual(validAuthResult);
    });

    it('should normalize email to lowercase and trim whitespace', async () => {
      // Arrange
      const params = {
        email: '  TEST@EXAMPLE.COM  ',
        password: 'password123',
      };
      mockAuthRepository.signIn.mockResolvedValue(validAuthResult);

      // Act
      await signInUseCase.execute(params);

      // Assert
      expect(mockAuthRepository.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should throw validation error for empty email', async () => {
      // Arrange
      const params = {
        email: '',
        password: 'password123',
      };

      // Act & Assert
      await expect(signInUseCase.execute(params)).rejects.toThrow(SignInValidationError);
      await expect(signInUseCase.execute(params)).rejects.toThrow('Email é obrigatório');
      expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
    });

    it('should throw validation error for invalid email format', async () => {
      // Arrange
      const params = {
        email: 'invalid-email',
        password: 'password123',
      };

      // Act & Assert
      await expect(signInUseCase.execute(params)).rejects.toThrow(SignInValidationError);
      await expect(signInUseCase.execute(params)).rejects.toThrow('Formato de email inválido');
      expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
    });

    it('should throw validation error for empty password', async () => {
      // Arrange
      const params = {
        email: 'test@example.com',
        password: '',
      };

      // Act & Assert
      await expect(signInUseCase.execute(params)).rejects.toThrow(SignInValidationError);
      await expect(signInUseCase.execute(params)).rejects.toThrow('Senha é obrigatória');
      expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
    });

    it('should throw validation error for short password', async () => {
      // Arrange
      const params = {
        email: 'test@example.com',
        password: '12345',
      };

      // Act & Assert
      await expect(signInUseCase.execute(params)).rejects.toThrow(SignInValidationError);
      await expect(signInUseCase.execute(params)).rejects.toThrow('Senha deve ter pelo menos 6 caracteres');
      expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
    });

    it('should propagate auth repository errors', async () => {
      // Arrange
      const params = {
        email: 'test@example.com',
        password: 'password123',
      };
      const authError: AuthError = {
        type: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Invalid credentials',
      };
      mockAuthRepository.signIn.mockRejectedValue(authError);

      // Act & Assert
      await expect(signInUseCase.execute(params)).rejects.toEqual(authError);
      expect(mockAuthRepository.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should handle whitespace-only email', async () => {
      // Arrange
      const params = {
        email: '   ',
        password: 'password123',
      };

      // Act & Assert
      await expect(signInUseCase.execute(params)).rejects.toThrow(SignInValidationError);
      await expect(signInUseCase.execute(params)).rejects.toThrow('Email é obrigatório');
      expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
    });

    it('should handle various invalid email formats', async () => {
      const invalidEmails = [
        'test@',
        '@example.com',
        'test.example.com',
        'test@.com',
        'test@example.',
        'test..test@example.com',
      ];

      for (const email of invalidEmails) {
        const params = {
          email,
          password: 'password123',
        };

        await expect(signInUseCase.execute(params)).rejects.toThrow(SignInValidationError);
        await expect(signInUseCase.execute(params)).rejects.toThrow('Formato de email inválido');
      }

      expect(mockAuthRepository.signIn).not.toHaveBeenCalled();
    });
  });
});