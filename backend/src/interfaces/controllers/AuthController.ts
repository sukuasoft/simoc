import { Request, Response } from 'express';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, phone } = req.body;

      if (!email || !password || !name || !phone) {
        res.status(400).json({ error: 'Email, senha, nome e telefone são obrigatórios' });
        return;
      }

      const result = await this.registerUseCase.execute({
        email,
        password,
        name,
        phone,
      });

      res.status(201).json({
        message: 'Usuário registrado com sucesso',
        ...result,
      });
    } catch (error) {
        console.log(error);
      const message = (error as Error).message;
      if (message.includes('já está em uso')) {
        res.status(409).json({ error: message });
      } else {
        res.status(400).json({ error: message });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email e senha são obrigatórios' });
        return;
      }

      const result = await this.loginUseCase.execute({ email, password });

      res.status(200).json({
        message: 'Login realizado com sucesso',
        ...result,
      });
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
