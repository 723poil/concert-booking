import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT 토큰 페이로드 인터페이스
 */
export interface JwtPayload {
  sub: string; // 사용자 ID
  email: string;
  role: string;
}

/**
 * 토큰 응답 인터페이스
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * JWT 토큰 서비스
 *
 * Access Token과 Refresh Token의 생성 및 검증을 담당합니다.
 */
@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Access Token 생성
   */
  generateAccessToken(payload: JwtPayload): string {
    const expiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    );
    return this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: expiresIn as JwtSignOptions['expiresIn'],
      },
    );
  }

  /**
   * Refresh Token 생성
   */
  generateRefreshToken(payload: JwtPayload): string {
    const expiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );
    return this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: expiresIn as JwtSignOptions['expiresIn'],
      },
    );
  }

  /**
   * Access Token과 Refresh Token 모두 생성
   */
  generateTokens(payload: JwtPayload): TokenResponse {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * 토큰 검증 및 페이로드 추출
   */
  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * 토큰에서 페이로드 추출 (검증 없이)
   */
  decodeToken(token: string): JwtPayload | null {
    return this.jwtService.decode<JwtPayload>(token);
  }
}
