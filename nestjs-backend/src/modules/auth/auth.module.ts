import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthRepository } from './auth.repository';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [UserModule],
  providers: [AuthService, AuthRepository, AuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
