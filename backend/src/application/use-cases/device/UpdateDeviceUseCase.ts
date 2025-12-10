import { IDeviceRepository } from '../../../domain/repositories/device-repository';
import { DeviceResponseDTO, UpdateDeviceDTO } from '../../dtos/DeviceDTO';

export class UpdateDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(id: string, data: UpdateDeviceDTO): Promise<DeviceResponseDTO | null> {
    const device = await this.deviceRepository.findById(id);
    
    if (!device) {
      return null;
    }

    if (data.name !== undefined) device.name = data.name;
    if (data.type !== undefined) device.type = data.type;
    if (data.host !== undefined) device.host = data.host;
    if (data.port !== undefined) device.port = data.port;
    if (data.checkType !== undefined) device.checkType = data.checkType;
    if (data.checkInterval !== undefined) device.checkInterval = data.checkInterval;
    if (data.timeout !== undefined) device.timeout = data.timeout;
    if (data.isActive !== undefined) device.isActive = data.isActive;
    
    device.updatedAt = new Date();

    const updatedDevice = await this.deviceRepository.update(device);
    return updatedDevice.toJSON();
  }
}
