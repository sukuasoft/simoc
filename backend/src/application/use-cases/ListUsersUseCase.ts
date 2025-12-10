import { IUserRepository } from '../../domain/repositories/user-repository';
import { UserResponseDTO } from '../dtos/UserDTO';

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => user.toJSON());
  }
}
