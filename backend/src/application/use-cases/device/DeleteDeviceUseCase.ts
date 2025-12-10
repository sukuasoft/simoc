import { IDeviceRepository } from '../../../domain/repositories/device-repository';

export class DeleteDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(id: string): Promise<boolean> {
    const device = await this.deviceRepository.findById(id);
    
    if (!device) {
      return false;
    }

    await this.deviceRepository.delete(id);
    return true;
  }
}
