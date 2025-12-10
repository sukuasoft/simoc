import { Device, DeviceProps, DeviceStatus, DeviceType, CheckType } from '../../domain/entities/Device';
import { IDeviceRepository } from '../../domain/repositories/device-repository';
import { SupabaseConfig } from '../database/supabase';

export class SupabaseDeviceRepository implements IDeviceRepository {
  private supabase = SupabaseConfig.getClient();

  private mapToEntity(row: any): Device {
    return new Device({
      id: row.id,
      name: row.name,
      type: row.type as DeviceType,
      host: row.host,
      port: row.port,
      checkType: row.check_type as CheckType,
      checkInterval: row.check_interval,
      timeout: row.timeout,
      status: row.status as DeviceStatus,
      lastCheck: row.last_check ? new Date(row.last_check) : undefined,
      lastResponseTime: row.last_response_time,
      isActive: row.is_active,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  private mapToRow(device: Device): any {
    return {
      id: device.id,
      name: device.name,
      type: device.type,
      host: device.host,
      port: device.port,
      check_type: device.checkType,
      check_interval: device.checkInterval,
      timeout: device.timeout,
      status: device.status,
      last_check: device.lastCheck?.toISOString(),
      last_response_time: device.lastResponseTime,
      is_active: device.isActive,
      user_id: device.userId,
      created_at: device.createdAt.toISOString(),
      updated_at: device.updatedAt.toISOString(),
    };
  }

  async save(device: Device): Promise<Device> {
    const { data, error } = await this.supabase
      .from('devices')
      .insert(this.mapToRow(device))
      .select()
      .single();

    if (error) throw new Error(`Failed to save device: ${error.message}`);
    return this.mapToEntity(data);
  }

  async findById(id: string): Promise<Device | null> {
    const { data, error } = await this.supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findByUserId(userId: string): Promise<Device[]> {
    const { data, error } = await this.supabase
      .from('devices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch devices: ${error.message}`);
    return (data || []).map(row => this.mapToEntity(row));
  }

  async findAllActive(): Promise<Device[]> {
    const { data, error } = await this.supabase
      .from('devices')
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(`Failed to fetch active devices: ${error.message}`);
    return (data || []).map(row => this.mapToEntity(row));
  }

  async findAll(): Promise<Device[]> {
    const { data, error } = await this.supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch devices: ${error.message}`);
    return (data || []).map(row => this.mapToEntity(row));
  }

  async update(device: Device): Promise<Device> {
    const { data, error } = await this.supabase
      .from('devices')
      .update(this.mapToRow(device))
      .eq('id', device.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update device: ${error.message}`);
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('devices')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete device: ${error.message}`);
  }
}
