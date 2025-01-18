import type { BaseEntity, UUID } from './misc';

export interface User extends BaseEntity {
  email: string;
  loginCode?: string;
  loginCodeExpires?: Date;
  salt?: string;
  passwordHash?: string;
  passwordSalt?: string;
}

export interface JwtPayload {
  email: string;
  userId: string;
}

export interface AuthData {
  email: string;
  id: UUID;
  token: string;
  expiresAt: Date | string;
}

export interface EmailRequest {
  email: string;
}

export interface LoginVerifyRequest extends EmailRequest {
  loginCode: string;
}

export interface PasswordAuthRequest extends EmailRequest {
  password: string;
}
