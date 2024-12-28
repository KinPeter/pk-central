import { Db } from 'mongodb';
import { verifyToken } from './crypt-jwt';
import { User } from 'pk-common';
import { DbCollection } from './collections';

export class AuthManager {
  public async authenticateUser(req: Request, db: Db): Promise<User | null> {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1] ?? '';
    const payload = verifyToken(token);
    if (!payload) return null;
    const { email, userId } = payload;
    const user = await db.collection<User>(DbCollection.USERS).findOne({ id: userId });
    if (!user || email !== user.email) return null;
    console.log('User authenticated:', user.email);
    return user;
  }
}
