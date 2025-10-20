import { z } from 'zod';

/**
 * Sign in form validation schema
 */
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

/**
 * Sign up form validation schema
 */
export const signUpSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome muito longo (máximo 50 caracteres)')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos')
    .trim(),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha muito longa (máximo 128 caracteres)')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra e um número'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

/**
 * Password reset form validation schema
 */
export const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido')
    .toLowerCase()
    .trim(),
});

/**
 * Type definitions for form data
 */
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;