import { Module } from '@nestjs/common';
import { PrismaUserRepository } from '../../infrastructure/persistence/user/prisma-user.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuthService } from '../../application/auth';
import { USER_REPOSITORY } from '../../domain';
import { AuthModule as AuthInfraModule } from '../../infrastructure/auth';
import { AuthController } from './auth.controller';

/**
 * Auth Presentation 모듈
 *
 * 인증 관련 컨트롤러와 서비스를 등록합니다.
 */
@Module({
  imports: [AuthInfraModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthPresentationModule {}
