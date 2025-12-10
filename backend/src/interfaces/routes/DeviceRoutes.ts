import { Router } from 'express';
import { DeviceController } from '../controllers/DeviceController';

export class DeviceRoutes {
  public router: Router;

  constructor(private deviceController: DeviceController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // CRUD de dispositivos
    this.router.post('/', (req, res) => this.deviceController.create(req, res));
    this.router.get('/', (req, res) => this.deviceController.list(req, res));
    this.router.get('/:id', (req, res) => this.deviceController.getById(req, res));
    this.router.put('/:id', (req, res) => this.deviceController.update(req, res));
    this.router.patch('/:id', (req, res) => this.deviceController.update(req, res));
    this.router.delete('/:id', (req, res) => this.deviceController.delete(req, res));
    
    // Verificação manual de saúde
    this.router.post('/:id/check', (req, res) => this.deviceController.checkNow(req, res));
  }
}
