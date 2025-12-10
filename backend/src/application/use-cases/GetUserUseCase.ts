import { IUserRepository } from '../../domain/repositories/user-repository';
import { UserResponseDTO } from '../dtos/UserDTO';

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findById(id);
    return user ? user.toJSON() : null;
  }
}
