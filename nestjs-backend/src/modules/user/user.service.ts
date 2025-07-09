import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.types';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUser(userId: number): Promise<User | null> {
    try {
      return await this.repository.getUserById(userId);
    } catch (error) {
      throw new Error('errors.user.user_not_found');
    }
  }
}
