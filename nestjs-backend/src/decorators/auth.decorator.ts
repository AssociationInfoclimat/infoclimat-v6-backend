import { applyDecorators, UseGuards } from '@nestjs/common';
import { InfoclimatAuthGuard } from 'src/modules/auth/auth.guard';

export function Auth(_params?: {}) {
  return applyDecorators(UseGuards(InfoclimatAuthGuard));
}
