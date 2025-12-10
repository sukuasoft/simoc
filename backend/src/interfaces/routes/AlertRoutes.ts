import { Router } from 'express';
import { AlertController } from '../controllers/AlertController';

export class AlertRoutes {
  public router: Router;

  constructor(private alertController: AlertController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', (req, res) => this.alertController.list(req, res));
    this.router.get('/pending', (req, res) => this.alertController.getPending(req, res));
    this.router.post('/test', (req, res) => this.alertController.sendTest(req, res));
  }
}
