import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// By default, JSON cannot stringify big ints that come from db rows:
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
