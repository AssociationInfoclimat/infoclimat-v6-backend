import { Injectable } from '@nestjs/common';
import { v5DBPrismaClient } from 'src/database/v5-prisma-client';

@Injectable()
export class AuthRepository {
  private prisma = v5DBPrismaClient;

  constructor() {}

  async verifyToken({
    tokenToVerify,
    accountId,
  }: {
    tokenToVerify: string;
    accountId: number;
  }): Promise<number | null> {
    const token = await this.prisma.comptes_tokens.findFirst({
      where: {
        token: tokenToVerify,
        id_compte: accountId,
      },
    });
    if (!token) {
      return null;
    }
    return token.id_compte; // Actually, just return the accountId
  }
}
