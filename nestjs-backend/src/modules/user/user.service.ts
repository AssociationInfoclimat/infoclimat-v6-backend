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

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.repository.getUserByUsername({
        username,
        includesPasswordHash: true, // This `findByUsername` is used for auth, so we need to include the password hash
      });
    } catch (error) {
      throw new Error('errors.user.user_not_found');
    }
  }
}
