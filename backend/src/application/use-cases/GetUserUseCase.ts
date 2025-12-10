import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserResponseDTO } from '../dtos/UserDTO';

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findById(id);
    return user ? user.toJSON() : null;
  }
}
