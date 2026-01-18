import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt-token.service';
import {
  BcryptPasswordService,
  PASSWORD_SERVICE,
} from './bcrypt-password.service';
import { JwtStrategy } from './jwt.strategy';

/**
 * Auth Infrastructure 모듈
 *
 * JWT 인증 관련 인프라스트럭처를 제공합니다.
 * - JwtModule 설정
 * - PassportModule 설정
 * - JWT 토큰 서비스
 * - 비밀번호 서비스
 * - JWT Strategy
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const expiresIn = configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '15m',
        );
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: expiresIn as JwtSignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  providers: [
    JwtTokenService,
    JwtStrategy,
    {
      provide: PASSWORD_SERVICE,
      useClass: BcryptPasswordService,
    },
    BcryptPasswordService,
  ],
  exports: [
    JwtTokenService,
    JwtModule,
    PassportModule,
    PASSWORD_SERVICE,
    BcryptPasswordService,
  ],
})
export class AuthModule {}
