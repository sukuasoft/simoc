import { Device } from '../entities/Device';

export interface IDeviceRepository {
  save(device: Device): Promise<Device>;
  findById(id: string): Promise<Device | null>;
  findByUserId(userId: string): Promise<Device[]>;
  findAllActive(): Promise<Device[]>;
  findAll(): Promise<Device[]>;
  update(device: Device): Promise<Device>;
  delete(id: string): Promise<void>;
}
