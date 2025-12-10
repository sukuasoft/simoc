import { Alert } from '../entities/Alert';

export interface IAlertRepository {
  save(alert: Alert): Promise<Alert>;
  findById(id: string): Promise<Alert | null>;
  findByDeviceId(deviceId: string): Promise<Alert[]>;
  findPending(): Promise<Alert[]>;
  findRecent(limit?: number): Promise<Alert[]>;
  update(alert: Alert): Promise<Alert>;
}
