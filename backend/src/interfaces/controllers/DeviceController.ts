import { Request, Response } from 'express';
import { CreateDeviceUseCase } from '../../application/use-cases/device/CreateDeviceUseCase';
import { ListDevicesUseCase } from '../../application/use-cases/device/ListDevicesUseCase';
import { UpdateDeviceUseCase } from '../../application/use-cases/device/UpdateDeviceUseCase';
import { DeleteDeviceUseCase } from '../../application/use-cases/device/DeleteDeviceUseCase';
import { CheckDeviceHealthUseCase } from '../../application/use-cases/monitoring/CheckDeviceHealthUseCase';

export class DeviceController {
  constructor(
    private createDeviceUseCase: CreateDeviceUseCase,
    private listDevicesUseCase: ListDevicesUseCase,
    private updateDeviceUseCase: UpdateDeviceUseCase,
    private deleteDeviceUseCase: DeleteDeviceUseCase,
    private checkDeviceHealthUseCase: CheckDeviceHealthUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, type, host, port, checkType, checkInterval, timeout } = req.body;
      const userId = req.user?.id || 'default-user'; // Usar ID do usuário autenticado

      if (!name || !type || !host || !checkType) {
        res.status(400).json({ error: 'name, type, host, and checkType are required' });
        return;
      }

      const device = await this.createDeviceUseCase.execute({
        name,
        type,
        host,
        port,
        checkType,
        checkInterval,
        timeout,
        userId,
      });

      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string | undefined;
      const devices = await this.listDevicesUseCase.execute(userId);
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const devices = await this.listDevicesUseCase.execute();
      const device = devices.find(d => d.id === id);

      if (!device) {
        res.status(404).json({ error: 'Device not found' });
        return;
      }

      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const device = await this.updateDeviceUseCase.execute(id, updateData);

      if (!device) {
        res.status(404).json({ error: 'Device not found' });
        return;
      }

      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.deleteDeviceUseCase.execute(id);

      if (!deleted) {
        res.status(404).json({ error: 'Device not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async checkNow(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const log = await this.checkDeviceHealthUseCase.execute(id);

      if (!log) {
        res.status(404).json({ error: 'Device not found or inactive' });
        return;
      }

      res.status(200).json(log.toJSON());
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
