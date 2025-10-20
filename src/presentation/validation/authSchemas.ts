import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export const signUpSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(128, 'A senha deve ter no máximo 128 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;