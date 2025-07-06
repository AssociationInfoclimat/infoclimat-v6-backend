import { PrismaService } from 'src/database/prisma.service';
import { FunctionLogger } from 'src/shared/utils';

export class UserRepository {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new FunctionLogger(UserRepository.name);

  async getUserById(userId: number) {}
}
