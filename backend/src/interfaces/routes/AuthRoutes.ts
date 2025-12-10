import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';

export class AuthRoutes {
  public router: Router;

  constructor(private authController: AuthController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Rotas públicas
    this.router.post('/register', (req, res) => this.authController.register(req, res));
    this.router.post('/login', (req, res) => this.authController.login(req, res));

    // Rotas protegidas
    this.router.get('/me', authMiddleware, (req, res) => this.authController.me(req, res));
  }
}
