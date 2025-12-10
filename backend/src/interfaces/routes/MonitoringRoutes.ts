import { Router } from 'express';
import { MonitoringController } from '../controllers/MonitoringController';

export class MonitoringRoutes {
  public router: Router;

  constructor(private monitoringController: MonitoringController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Dashboard
    this.router.get('/dashboard', (req, res) => this.monitoringController.getDashboardStats(req, res));
    
    // Logs de dispositivos
    this.router.get('/logs/:deviceId', (req, res) => this.monitoringController.getDeviceLogs(req, res));
    this.router.get('/logs/:deviceId/range', (req, res) => this.monitoringController.getDeviceLogsByDateRange(req, res));
  }
}
