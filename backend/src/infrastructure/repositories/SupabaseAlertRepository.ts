import { Alert, AlertType, AlertChannel, AlertStatus } from '../../domain/entities/Alert';
import { IAlertRepository } from '../../domain/repositories/alert-repository';
import { SupabaseConfig } from '../database/supabase';

export class SupabaseAlertRepository implements IAlertRepository {
  private supabase = SupabaseConfig.getClient();

  private mapToEntity(row: any): Alert {
    return new Alert({
      id: row.id,
      deviceId: row.device_id,
      deviceName: row.device_name,
      type: row.type as AlertType,
      message: row.message,
      channel: row.channel as AlertChannel,
      status: row.status as AlertStatus,
      recipientEmail: row.recipient_email,
      recipientPhone: row.recipient_phone,
      sentAt: row.sent_at ? new Date(row.sent_at) : undefined,
      createdAt: new Date(row.created_at),
    });
  }

  async save(alert: Alert): Promise<Alert> {
    const { data, error } = await this.supabase
      .from('alerts')
      .insert({
        id: alert.id,
        device_id: alert.deviceId,
        device_name: alert.deviceName,
        type: alert.type,
        message: alert.message,
        channel: alert.channel,
        status: alert.status,
        recipient_email: alert.recipientEmail,
        recipient_phone: alert.recipientPhone,
        sent_at: alert.sentAt?.toISOString(),
        created_at: alert.createdAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save alert: ${error.message}`);
    return this.mapToEntity(data);
  }

  async findById(id: string): Promise<Alert | null> {
    const { data, error } = await this.supabase
      .from('alerts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findByDeviceId(deviceId: string): Promise<Alert[]> {
    const { data, error } = await this.supabase
      .from('alerts')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch alerts: ${error.message}`);
    return (data || []).map(row => this.mapToEntity(row));
  }

  async findPending(): Promise<Alert[]> {
    const { data, error } = await this.supabase
      .from('alerts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Failed to fetch pending alerts: ${error.message}`);
    return (data || []).map(row => this.mapToEntity(row));
  }

  async findRecent(limit: number = 50): Promise<Alert[]> {
    const { data, error } = await this.supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch recent alerts: ${error.message}`);
    return (data || []).map(row => this.mapToEntity(row));
  }

  async update(alert: Alert): Promise<Alert> {
    const { data, error } = await this.supabase
      .from('alerts')
      .update({
        status: alert.status,
        sent_at: alert.sentAt?.toISOString(),
      })
      .eq('id', alert.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update alert: ${error.message}`);
    return this.mapToEntity(data);
  }
}
