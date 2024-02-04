import { getAccessToken, getLoginCode, validateLoginCode, verifyToken } from './crypt-jwt';

const expiredAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ1c2VySWQiOiJ1c2VyMTIzIiwiaWF0IjoxNzAzNTUzNTcxLCJleHAiOjE3MDM1NTM1ODF9.EEhOisV-61GzJDYkJnfJhr7urunIC0zEx1UGpHSwJW8';
const expiredMagicLinkToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiaWF0IjoxNzAzNTUzODA0LCJleHAiOjE3MDM1NTM4MTR9.C2NI1WOsYU4Hsg7DvPGYIpJfuC7Xovjut1ujReI5mlI';

describe('Crypt & JWT', () => {
  beforeEach(() => {
    process.env.LOGIN_CODE_EXPIRY = '15';
    process.env.TOKEN_EXPIRY = '7';
    process.env.JWT_SECRET = 'secret';
  });

  describe('getLoginCode, validateLoginCode', () => {
    it('should return login code, magic link, and data relevant for validating', async () => {
      const { loginCode, hashedLoginCode, loginCodeExpires, salt, magicLinkToken } = await getLoginCode('user123');
      expect(typeof loginCode).toBe('string');
      expect(loginCode).toMatch(/^\d{6}$/);
      expect(typeof hashedLoginCode).toBe('string');
      expect(typeof salt).toBe('string');
      expect(typeof magicLinkToken).toBe('string');
      expect(loginCodeExpires.getTime()).toBeGreaterThan(new Date().getTime());
      const validity = await validateLoginCode(loginCode, salt, hashedLoginCode, loginCodeExpires);
      expect(validity).toEqual('valid');
    });

    it('should return invalid for invalid login code', async () => {
      const { hashedLoginCode, loginCodeExpires, salt } = await getLoginCode('user123');
      const validity = await validateLoginCode('A12345', salt, hashedLoginCode, loginCodeExpires);
      expect(validity).toEqual('invalid');
    });

    it('should return expired for expired login code', async () => {
      const { loginCode, hashedLoginCode, salt } = await getLoginCode('user123');
      const now = new Date().getTime();
      const validity = await validateLoginCode(loginCode, salt, hashedLoginCode, new Date(now - 1000));
      expect(validity).toEqual('expired');
    });
  });

  describe('getAccessToken, verifyToken', () => {
    it('should generate JWT token and verify its validity', async () => {
      const { token, expiresAt } = getAccessToken('test@test.com', 'user123');
      expect(typeof token).toBe('string');
      expect(expiresAt instanceof Date).toBeTrue();
      expect(expiresAt.getTime()).toBeGreaterThan(new Date().getTime());
      const payload = verifyToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toEqual('user123');
      expect(payload?.email).toEqual('test@test.com');
    });

    it('should return null for invalid access token', () => {
      const payload = verifyToken('thisIsnotAtokenObviously');
      expect(payload).toBeNull();
    });

    it('should return null for expired access token', () => {
      const payload = verifyToken(expiredAccessToken);
      expect(payload).toBeNull();
    });

    it('should return null for expired magic link token', () => {
      const payload = verifyToken(expiredMagicLinkToken);
      expect(payload).toBeNull();
    });
  });
});
