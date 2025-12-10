import { Request, Response } from 'express';
import { SendAlertUseCase } from '../../application/use-cases/alert/SendAlertUseCase';
import { ListAlertsUseCase } from '../../application/use-cases/alert/ListAlertsUseCase';

export class AlertController {
  constructor(
    private sendAlertUseCase: SendAlertUseCase,
    private listAlertsUseCase: ListAlertsUseCase
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const deviceId = req.query.deviceId as string | undefined;
      const alerts = await this.listAlertsUseCase.execute(deviceId);
      res.status(200).json(alerts);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getPending(req: Request, res: Response): Promise<void> {
    try {
      const alerts = await this.listAlertsUseCase.getPending();
      res.status(200).json(alerts);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async sendTest(req: Request, res: Response): Promise<void> {
    try {
      const { deviceId, deviceName, type, channel, recipientEmail, recipientPhone } = req.body;

      if (!deviceId || !deviceName || !type || !channel) {
        res.status(400).json({ error: 'deviceId, deviceName, type, and channel are required' });
        return;
      }

      const alert = await this.sendAlertUseCase.execute({
        deviceId,
        deviceName,
        type,
        channel,
        recipientEmail,
        recipientPhone,
      });

      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
