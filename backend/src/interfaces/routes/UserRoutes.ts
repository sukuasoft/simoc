import { Router } from 'express';
import { UserController } from '../controllers/UserController';

export class UserRoutes {
  public router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', (req, res) => this.userController.create(req, res));
    this.router.get('/', (req, res) => this.userController.list(req, res));
    this.router.get('/:id', (req, res) => this.userController.getById(req, res));
    this.router.delete('/:id', (req, res) => this.userController.delete(req, res));
  }
}
