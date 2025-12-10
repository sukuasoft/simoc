import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../../application/use-cases/ListUsersUseCase';
import { DeleteUserUseCase } from '../../application/use-cases/DeleteUserUseCase';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private listUsersUseCase: ListUsersUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required' });
        return;
      }

      const user = await this.createUserUseCase.execute({ name, email });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.listUsersUseCase.execute();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
