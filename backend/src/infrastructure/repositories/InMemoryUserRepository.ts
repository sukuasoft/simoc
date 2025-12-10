import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  findByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  findByEmailWithPassword(email: string): Promise<{ user: User; password: string; } | null> {
    throw new Error('Method not implemented.');
  }
  update(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}
