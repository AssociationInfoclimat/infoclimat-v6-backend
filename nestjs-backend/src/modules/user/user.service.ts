import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUser(userId: number) {
    return await this.repository.getUserById(userId);
  }
}
