import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../../entity-modules/user/user.module';
import { AuthRepository } from './auth.repository';
import { AuthStrategy } from './auth.strategy';
import { CacheManagerModule } from '../redis-cache-manager/redis-cache-manager.module';

@Module({
  imports: [UserModule, CacheManagerModule],
  providers: [AuthService, AuthRepository, AuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
