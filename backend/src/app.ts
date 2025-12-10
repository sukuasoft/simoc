import express, { Application } from 'express';
import cors from 'cors';

// Infrastructure
import { SupabaseDeviceRepository } from './infrastructure/repositories/SupabaseDeviceRepository';
import { SupabaseMonitoringLogRepository } from './infrastructure/repositories/SupabaseMonitoringLogRepository';
import { SupabaseAlertRepository } from './infrastructure/repositories/SupabaseAlertRepository';
import { NotificationService } from './infrastructure/services/notifications/NotificationService';
import { HealthChecker } from './infrastructure/services/monitoring/HealthChecker';
import { MonitoringScheduler } from './infrastructure/services/monitoring/MonitoringScheduler';

// Use Cases - Device
import { CreateDeviceUseCase } from './application/use-cases/device/CreateDeviceUseCase';
import { ListDevicesUseCase } from './application/use-cases/device/ListDevicesUseCase';
import { UpdateDeviceUseCase } from './application/use-cases/device/UpdateDeviceUseCase';
import { DeleteDeviceUseCase } from './application/use-cases/device/DeleteDeviceUseCase';

// Use Cases - Monitoring
import { CheckDeviceHealthUseCase } from './application/use-cases/monitoring/CheckDeviceHealthUseCase';
import { GetDashboardStatsUseCase } from './application/use-cases/monitoring/GetDashboardStatsUseCase';
import { GetDeviceLogsUseCase } from './application/use-cases/monitoring/GetDeviceLogsUseCase';

// Use Cases - Alert
import { SendAlertUseCase } from './application/use-cases/alert/SendAlertUseCase';
import { ListAlertsUseCase } from './application/use-cases/alert/ListAlertsUseCase';

// Controllers
import { DeviceController } from './interfaces/controllers/DeviceController';
import { MonitoringController } from './interfaces/controllers/MonitoringController';
import { AlertController } from './interfaces/controllers/AlertController';

// Routes
import { DeviceRoutes } from './interfaces/routes/DeviceRoutes';
import { MonitoringRoutes } from './interfaces/routes/MonitoringRoutes';
import { AlertRoutes } from './interfaces/routes/AlertRoutes';

// Middlewares
import { errorMiddleware, notFoundMiddleware } from './interfaces/middlewares/errorMiddleware';

class App {
  public app: Application;
  private port: number;
  private monitoringScheduler?: MonitoringScheduler;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Repositories
    const deviceRepository = new SupabaseDeviceRepository();
    const monitoringLogRepository = new SupabaseMonitoringLogRepository();
    const alertRepository = new SupabaseAlertRepository();

    // Services
    const notificationService = new NotificationService();
    const healthChecker = new HealthChecker();

    // Use Cases - Device
    const createDeviceUseCase = new CreateDeviceUseCase(deviceRepository);
    const listDevicesUseCase = new ListDevicesUseCase(deviceRepository);
    const updateDeviceUseCase = new UpdateDeviceUseCase(deviceRepository);
    const deleteDeviceUseCase = new DeleteDeviceUseCase(deviceRepository);

    // Use Cases - Monitoring
    const checkDeviceHealthUseCase = new CheckDeviceHealthUseCase(
      deviceRepository,
      monitoringLogRepository,
      healthChecker
    );
    const getDashboardStatsUseCase = new GetDashboardStatsUseCase(
      deviceRepository,
      monitoringLogRepository,
      alertRepository
    );
    const getDeviceLogsUseCase = new GetDeviceLogsUseCase(monitoringLogRepository);

    // Use Cases - Alert
    const sendAlertUseCase = new SendAlertUseCase(alertRepository, notificationService);
    const listAlertsUseCase = new ListAlertsUseCase(alertRepository);

    // Controllers
    const deviceController = new DeviceController(
      createDeviceUseCase,
      listDevicesUseCase,
      updateDeviceUseCase,
      deleteDeviceUseCase,
      checkDeviceHealthUseCase
    );
    const monitoringController = new MonitoringController(
      getDashboardStatsUseCase,
      getDeviceLogsUseCase
    );
    const alertController = new AlertController(sendAlertUseCase, listAlertsUseCase);

    // Routes
    const deviceRoutes = new DeviceRoutes(deviceController);
    const monitoringRoutes = new MonitoringRoutes(monitoringController);
    const alertRoutes = new AlertRoutes(alertController);

    // API Routes
    this.app.use('/api/devices', deviceRoutes.router);
    this.app.use('/api/monitoring', monitoringRoutes.router);
    this.app.use('/api/alerts', alertRoutes.router);

    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        service: 'SIMOC API',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      });
    });

    // API Info
    this.app.get('/api', (req, res) => {
      res.status(200).json({
        name: 'SIMOC - Sistema de Monitoramento Corporativo',
        version: '1.0.0',
        endpoints: {
          devices: '/api/devices',
          monitoring: '/api/monitoring',
          alerts: '/api/alerts',
          health: '/health',
        },
      });
    });

    // Initialize Monitoring Scheduler
    this.monitoringScheduler = new MonitoringScheduler(
      deviceRepository,
      monitoringLogRepository,
      alertRepository,
      notificationService
    );
  }

  private setupErrorHandling(): void {
    this.app.use(notFoundMiddleware);
    this.app.use(errorMiddleware);
  }

  public async start(): Promise<void> {
    // Start monitoring scheduler if Supabase is configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        await this.monitoringScheduler?.start();
      } catch (error) {
        console.warn('⚠️ Could not start monitoring scheduler:', (error as Error).message);
      }
    } else {
      console.warn('⚠️ Supabase not configured - monitoring scheduler disabled');
    }

    this.app.listen(this.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🖥️  SIMOC - Sistema de Monitoramento Corporativo        ║
║                                                           ║
║   🚀 Server running on http://localhost:${this.port}            ║
║   📚 API Docs: http://localhost:${this.port}/api                ║
║   ❤️  Health: http://localhost:${this.port}/health              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  }

  public stop(): void {
    this.monitoringScheduler?.stop();
  }
}

// Start the server
const server = new App(parseInt(process.env.PORT || '3000'));
server.start();

export default App;
