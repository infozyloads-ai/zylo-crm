export interface LoginFormData {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  phone?: string;
  fullName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}