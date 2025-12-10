import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { JwtService } from '../../../infrastructure/services/auth/JwtService';
import { PasswordService } from '../../../infrastructure/services/auth/PasswordService';
import { RegisterDTO, AuthResponseDTO } from '../../dtos/AuthDTO';

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: JwtService,
    private passwordService: PasswordService
  ) {}

  async execute(data: RegisterDTO): Promise<AuthResponseDTO> {

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const hashedPassword = await this.passwordService.hash(data.password);

    // Criar usuário
    const user = User.create(data.email, data.name, hashedPassword,  data.phone);
    const savedUser = await this.userRepository.save(user);

    // Gerar token
    const tokenPayload = {
      userId: savedUser.id,
      email: savedUser.email,
    };

    const accessToken = this.jwtService.generateAccessToken(tokenPayload);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
      },
      accessToken,
    };
  }
}

