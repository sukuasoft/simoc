import { IAlertRepository } from '../../../domain/repositories/alert-repository';
import { AlertResponseDTO } from '../../dtos/AlertDTO';

export class ListAlertsUseCase {
  constructor(private alertRepository: IAlertRepository) {}

  async execute(deviceId?: string): Promise<AlertResponseDTO[]> {
    const alerts = deviceId
      ? await this.alertRepository.findByDeviceId(deviceId)
      : await this.alertRepository.findRecent(100);

    return alerts.map(alert => alert.toJSON());
  }

  async getPending(): Promise<AlertResponseDTO[]> {
    const alerts = await this.alertRepository.findPending();
    return alerts.map(alert => alert.toJSON());
  }
}
