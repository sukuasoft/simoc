import { IMonitoringLogRepository } from '../../../domain/repositories/monitoring-log-repository';
import { MonitoringLogResponseDTO } from '../../dtos/MonitoringDTO';

export class GetDeviceLogsUseCase {
  constructor(private monitoringLogRepository: IMonitoringLogRepository) {}

  async execute(deviceId: string, limit: number = 100): Promise<MonitoringLogResponseDTO[]> {
    const logs = await this.monitoringLogRepository.findByDeviceId(deviceId, limit);
    return logs.map(log => log.toJSON());
  }

  async executeByDateRange(
    deviceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MonitoringLogResponseDTO[]> {
    const logs = await this.monitoringLogRepository.findByDateRange(deviceId, startDate, endDate);
    return logs.map(log => log.toJSON());
  }
}
