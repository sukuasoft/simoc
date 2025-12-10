import { IDeviceRepository } from '../../../domain/repositories/device-repository';
import { DeviceResponseDTO } from '../../dtos/DeviceDTO';

export class ListDevicesUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(userId?: string): Promise<DeviceResponseDTO[]> {
    const devices = userId
      ? await this.deviceRepository.findByUserId(userId)
      : await this.deviceRepository.findAll();

    return devices.map(device => device.toJSON());
  }
}
