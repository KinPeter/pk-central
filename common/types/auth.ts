import { UUID } from './misc';

export interface User {
  id: UUID;
  email: string;
  loginCode?: string;
  loginCodeExpires?: Date;
  salt?: string;
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
