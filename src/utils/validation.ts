export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export interface PasswordCheck {
  valid: boolean;
  reason: string | null;
}

export function checkPassword(value: string): PasswordCheck {
  if (value.length < 8) return { valid: false, reason: 'En az 8 karakter olmalı.' };
  if (value.length > 128) return { valid: false, reason: 'En fazla 128 karakter olabilir.' };
  return { valid: true, reason: null };
}

export function isValidName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 1 && trimmed.length <= 100;
}

export function isValidCity(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 200;
}

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function validateRegisterForm(name: string, email: string, password: string): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  if (!isValidName(name)) errors.name = 'Adını gir.';
  if (!isValidEmail(email)) errors.email = 'Geçerli bir e-posta adresi gir.';
  const pw = checkPassword(password);
  if (!pw.valid) errors.password = pw.reason!;
  return errors;
}
