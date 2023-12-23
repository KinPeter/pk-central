export interface User {
  email: string;
  id: string;
  loginCode?: string;
  loginCodeExpires?: Date;
  salt?: string;
}

export interface JwtPayload {
  email: string;
  userId: string;
}
