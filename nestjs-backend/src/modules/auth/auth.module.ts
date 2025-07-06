import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
