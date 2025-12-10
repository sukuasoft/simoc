import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../infrastructure/services/auth/JwtService';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

const jwtService = new JwtService();
const userRepository = new PrismaUserRepository();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token de autenticação não fornecido' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verificar JWT
    const payload = jwtService.verifyAccessToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Token inválido ou expirado' });
      return;
    }

    // Buscar usuário no banco para garantir que ainda existe e está ativo
    const user = await userRepository.findById(payload.userId);
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Erro de autenticação' });
  }
};
