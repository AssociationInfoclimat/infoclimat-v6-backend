import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [SignupService],
  exports: [SignupService],
})
export class SignupModule {}