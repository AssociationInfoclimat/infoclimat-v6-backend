import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { v5DBPrismaClient } from 'src/database/v5-prisma-client';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class AuthRepository {
  private readonly logger = new FunctionLogger(AuthRepository.name);
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

  async createToken({
    accountId,
    token,
    expires,
    ip,
    uagent,
  }: {
    accountId: number;
    token: string;
    expires: number; // Unix timestamp
    ip: string;
    uagent: string;
  }): Promise<void> {
    try {
      await this.prisma.comptes_tokens.create({
        data: {
          id_compte: accountId,
          token,
          dh_creation: dayjs().toDate(),
          dh_expiration: dayjs(expires).toDate(),
          ip_creation: ip,
          uagent_creation: uagent,
        },
      });
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
