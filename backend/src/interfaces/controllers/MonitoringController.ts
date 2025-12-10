import { Request, Response } from 'express';
import { GetDashboardStatsUseCase } from '../../application/use-cases/monitoring/GetDashboardStatsUseCase';
import { GetDeviceLogsUseCase } from '../../application/use-cases/monitoring/GetDeviceLogsUseCase';

export class MonitoringController {
  constructor(
    private getDashboardStatsUseCase: GetDashboardStatsUseCase,
    private getDeviceLogsUseCase: GetDeviceLogsUseCase
  ) {}

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string | undefined;
      const stats = await this.getDashboardStatsUseCase.execute(userId);
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getDeviceLogs(req: Request, res: Response): Promise<void> {
    try {
      const { deviceId } = req.params;
      const limit = parseInt(req.query.limit as string) || 100;
      
      const logs = await this.getDeviceLogsUseCase.execute(deviceId, limit);
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getDeviceLogsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { deviceId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({ error: 'startDate and endDate are required' });
        return;
      }

      const logs = await this.getDeviceLogsUseCase.executeByDateRange(
        deviceId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
