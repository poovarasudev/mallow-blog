export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  category?: string;
  author: User;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  image?: string;
  category?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}