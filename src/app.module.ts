import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/auth';
import { LoggerModule } from './infrastructure/logger';
import { JwtAuthGuard } from './presentation/auth';
import { AuthPresentationModule } from './presentation/auth/auth.module';

@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 로깅 모듈
    LoggerModule,
    // 인증 인프라 모듈
    AuthModule,
    // 인증 프레젠테이션 모듈
    AuthPresentationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 전역 인증 가드 설정
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
