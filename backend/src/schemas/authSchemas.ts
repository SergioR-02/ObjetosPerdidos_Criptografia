import { z } from 'zod';

// Esquema para el registro de usuarios
export const registerSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(1, 'El nombre es requerido'),
  phone_number: z.string().optional(),
  recaptchaToken: z.string().min(1, 'reCAPTCHA es requerido'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  name: z.string().min(1, 'El nombre es requerido'),
  phone_number: z.string().optional(),
});

// Esquema para el inicio de sesión
export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  recaptchaToken: z.string().min(1, 'reCAPTCHA es requerido'),
});

// Esquema para la verificación del código 2FA durante el login
export const loginWith2FASchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  twoFactorCode: z
    .string()
    .min(6, 'El código debe tener al menos 6 caracteres')
    .max(8, 'El código no puede tener más de 8 caracteres'),
});

// Esquema para verificar código 2FA
export const verify2FASchema = z.object({
  code: z.string().length(6, 'El código debe tener 6 dígitos'),
});

// Esquema para habilitar 2FA
export const enable2FASchema = z.object({
  code: z.string().length(6, 'El código de verificación debe tener 6 dígitos'),
});

// Esquema para deshabilitar 2FA
export const disable2FASchema = z.object({
  code: z.string().length(6, 'El código de verificación debe tener 6 dígitos'),
});

// Exportar los tipos inferidos de los esquemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginWith2FAInput = z.infer<typeof loginWith2FASchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type Verify2FAInput = z.infer<typeof verify2FASchema>;
export type Enable2FAInput = z.infer<typeof enable2FASchema>;
export type Disable2FAInput = z.infer<typeof disable2FASchema>;

export function validateRegister(input: RegisterInput) {
  return registerSchema.safeParse(input);
}

export function validateLogin(input: LoginInput) {
  return loginSchema.safeParse(input);
}

export function validateLoginWith2FA(input: LoginWith2FAInput) {
  return loginWith2FASchema.safeParse(input);
}

export function validateUpdateUser(input: unknown) {
  return updateUserSchema.partial().safeParse(input);
}

export function validateVerify2FA(input: Verify2FAInput) {
  return verify2FASchema.safeParse(input);
}

export function validateEnable2FA(input: Enable2FAInput) {
  return enable2FASchema.safeParse(input);
}

export function validateDisable2FA(input: Disable2FAInput) {
  return disable2FASchema.safeParse(input);
}
