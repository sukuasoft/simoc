import jwt from 'jsonwebtoken';
import { TokenPayload } from '../../../application/dtos/AuthDTO';

export class JwtService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'secret-key-change-in-production';
    this.accessTokenExpiry = process.env.JWT_EXPIRY || '7d';
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    } as jwt.SignOptions);
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch {
      return null;
    }
  }
}
