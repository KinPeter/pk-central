import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../common';

export function getAccessToken(email: string, userId: string): { token: string; expiresAt: Date } {
  const nDaysInSeconds = Number(process.env.TOKEN_EXPIRY) * 24 * 60 * 60;
  const token = jwt.sign({ email, userId }, process.env.JWT_SECRET!, { expiresIn: nDaysInSeconds });
  const nowInSeconds = new Date().getTime() / 1000;
  const expiresAt = new Date((nowInSeconds + nDaysInSeconds) * 1000);
  return { token, expiresAt };
}

export async function getHashed(rawString: string): Promise<{ hashedString: string; salt: string }> {
  const salt = await bcrypt.genSalt();
  const hashedString = await bcrypt.hash(rawString, salt);
  return { hashedString, salt };
}

export async function getLoginCode(): Promise<{
  loginCode: string;
  hashedLoginCode: string;
  loginCodeExpires: Date;
  salt: string;
}> {
  const { loginCode, loginCodeExpires } = generateLoginCode();
  const { hashedString: hashedLoginCode, salt } = await getHashed(loginCode);

  return {
    loginCode,
    hashedLoginCode,
    loginCodeExpires,
    salt,
  };
}

function generateLoginCode(): { loginCode: string; loginCodeExpires: Date } {
  const now = new Date().getTime();
  const expiryInMillis = Number(process.env.LOGIN_CODE_EXPIRY) * 60 * 1000;
  const loginCodeExpires = new Date(now + expiryInMillis);
  return {
    loginCode: Math.floor(100000 + Math.random() * 900000).toString(),
    loginCodeExpires,
  };
}

export async function validateLoginCode(
  loginCode: string,
  salt: string,
  hashedLoginCode: string,
  loginCodeExpires: Date | string
): Promise<'valid' | 'invalid' | 'expired'> {
  const hash = await bcrypt.hash(loginCode, salt);
  if (hash !== hashedLoginCode) return 'invalid';
  if (new Date() >= new Date(loginCodeExpires)) return 'expired';
  return 'valid';
}

export async function validatePassword(password: string, hashedPassword: string, salt: string): Promise<boolean> {
  const hash = await bcrypt.hash(password, salt);
  return hash === hashedPassword;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (_e) {
    return null;
  }
}
