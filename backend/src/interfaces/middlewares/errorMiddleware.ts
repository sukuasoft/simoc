import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Erros de validação
  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      message: error.message,
    });
    return;
  }

  // Erro genérico
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
};

// Middleware para rotas não encontradas
export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};
