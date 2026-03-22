import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.types';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUser(userId: number): Promise<User> {
    const user = await this.repository.getUserById(userId);
    if (!user) {
      throw new Error('errors.user.user_not_found');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.getUserByUsername({
      username,
      includesPasswordHash: true, // This `findByUsername` is used for auth, so we need to include the password hash
    });
  }
}
