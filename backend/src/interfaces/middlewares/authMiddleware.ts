import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || '',
      role: profile?.role || 'viewer',
    };

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware para verificar se é admin
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

// Middleware para verificar se é admin ou operator
export const operatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !['admin', 'operator'].includes(req.user.role)) {
    res.status(403).json({ error: 'Operator access required' });
    return;
  }
  next();
};
