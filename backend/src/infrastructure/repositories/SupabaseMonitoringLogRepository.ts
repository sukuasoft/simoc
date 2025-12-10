import { MonitoringLog } from '../../domain/entities/MonitoringLog';
import { DeviceStatus } from '../../domain/entities/Device';
import { IMonitoringLogRepository } from '../../domain/repositories/monitoring-log-repository';
import { SupabaseConfig } from '../database/supabase';

export class SupabaseMonitoringLogRepository implements IMonitoringLogRepository {
  private supabase = SupabaseConfig.getClient();

  private mapToEntity(row: any): MonitoringLog {
    return new MonitoringLog({
      id: row.id,
      deviceId: row.device_id,
      status: row.status as DeviceStatus,
      responseTime: row.response_time,
      errorMessage: row.error_message,
      checkedAt: new Date(row.checked_at),
    });
  }

  async save(log: MonitoringLog): Promise<MonitoringLog> {
    const { data, error } = await this.supabase
      .from('monitoring_logs')
      .insert({
        id: log.id,
        device_id: log.deviceId,
        status: log.status,
        response_time: log.responseTime,
        error_message: log.errorMessage,
        checked_at: log.checkedAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save log: ${error.message}`);
    return this.mapToEntity(data);
  }

  async findByDeviceId(deviceId: string, limit: number = 100): Promise<MonitoringLog[]> {
    const { data, error } = await this.supabase
      .from('monitoring_logs')
      .select('*')
      .eq('device_id', deviceId)
      .order('checked_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch logs: ${error.message}`);
    return (data || []).map(row => this.mapToEntity(row));
  }

  async findByDateRange(deviceId: string, startDate: Date, endDate: Date): Promise<MonitoringLog[]> {
    const { data, error } = await this.supabase
      .from('monitoring_logs')
      .select('*')
      .eq('device_id', deviceId)
      .gte('checked_at', startDate.toISOString())
      .lte('checked_at', endDate.toISOString())
      .order('checked_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch logs: ${error.message}`);
    return (data || []).map(row => this.mapToEntity(row));
  }

  async getStatsByDeviceId(deviceId: string): Promise<{
    totalChecks: number;
    onlineCount: number;
    offlineCount: number;
    avgResponseTime: number;
    uptime: number;
  }> {
    const { data, error } = await this.supabase
      .from('monitoring_logs')
      .select('status, response_time')
      .eq('device_id', deviceId);

    if (error) throw new Error(`Failed to get stats: ${error.message}`);

    const logs = data || [];
    const totalChecks = logs.length;
    const onlineCount = logs.filter(l => l.status === 'online').length;
    const offlineCount = logs.filter(l => l.status === 'offline').length;
    
    const responseTimes = logs
      .filter(l => l.response_time !== null)
      .map(l => l.response_time as number);
    
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    const uptime = totalChecks > 0 ? (onlineCount / totalChecks) * 100 : 100;

    return {
      totalChecks,
      onlineCount,
      offlineCount,
      avgResponseTime: Math.round(avgResponseTime),
      uptime: Math.round(uptime * 100) / 100,
    };
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const { data, error } = await this.supabase
      .from('monitoring_logs')
      .delete()
      .lt('checked_at', date.toISOString())
      .select('id');

    if (error) throw new Error(`Failed to delete old logs: ${error.message}`);
    return (data || []).length;
  }
}
