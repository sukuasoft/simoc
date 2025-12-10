import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { JwtService } from '../../../infrastructure/services/auth/JwtService';
import { PasswordService } from '../../../infrastructure/services/auth/PasswordService';
import { LoginDTO, AuthResponseDTO } from '../../dtos/AuthDTO';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: JwtService,
    private passwordService: PasswordService
  ) {}

  async execute(data: LoginDTO): Promise<AuthResponseDTO> {

    // Buscar usuário com senha
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      throw new Error('Conta desativada. Entre em contato com o administrador.');
    }

    // Verificar senha
    const isPasswordValid = await this.passwordService.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.generateAccessToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    };
  }
}
