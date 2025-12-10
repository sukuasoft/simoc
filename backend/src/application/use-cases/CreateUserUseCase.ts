import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateUserDTO, UserResponseDTO } from '../dtos/UserDTO';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<UserResponseDTO> {
    const user = User.create(data.name, data.email, data.password, data.phone);
    const savedUser = await this.userRepository.save(user);
    return savedUser.toJSON();
  }
}
