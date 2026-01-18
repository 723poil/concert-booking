import { Module } from '@nestjs/common';
import { UserRepositoryStub } from 'src/infrastructure/persistence/user.repository.stub';
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
  imports: [AuthInfraModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    // TODO: 실제 UserRepository 구현체로 교체 필요
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryStub,
    },
  ],
})
export class AuthPresentationModule {}
