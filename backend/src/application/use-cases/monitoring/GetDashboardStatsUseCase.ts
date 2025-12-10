import { IDeviceRepository } from '../../../domain/repositories/device-repository';
import { IMonitoringLogRepository } from '../../../domain/repositories/monitoring-log-repository';
import { IAlertRepository } from '../../../domain/repositories/alert-repository';
import { DashboardStatsDTO } from '../../dtos/MonitoringDTO';

export class GetDashboardStatsUseCase {
  constructor(
    private deviceRepository: IDeviceRepository,
    private monitoringLogRepository: IMonitoringLogRepository,
    private alertRepository: IAlertRepository
  ) {}

  async execute(userId?: string): Promise<DashboardStatsDTO> {
    const devices = userId
      ? await this.deviceRepository.findByUserId(userId)
      : await this.deviceRepository.findAll();

    const totalDevices = devices.length;
    const onlineDevices = devices.filter(d => d.status === 'online').length;
    const offlineDevices = devices.filter(d => d.status === 'offline').length;
    const warningDevices = devices.filter(d => d.status === 'warning').length;

    // Calcular uptime geral
    let totalUptime = 0;
    for (const device of devices) {
      const stats = await this.monitoringLogRepository.getStatsByDeviceId(device.id);
      totalUptime += stats.uptime;
    }
    const overallUptime = totalDevices > 0 ? totalUptime / totalDevices : 100;

    // Alertas recentes (últimas 24 horas)
    const recentAlerts = await this.alertRepository.findRecent(100);
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentAlertsCount = recentAlerts.filter(a => a.createdAt >= last24h).length;

    return {
      totalDevices,
      onlineDevices,
      offlineDevices,
      warningDevices,
      overallUptime: Math.round(overallUptime * 100) / 100,
      recentAlerts: recentAlertsCount,
    };
  }
}
