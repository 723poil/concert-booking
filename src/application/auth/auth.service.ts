import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../../domain';
import { USER_REPOSITORY } from '../../domain';
import { JwtPayload, JwtTokenService } from '../../infrastructure/auth';
import type { IPasswordService } from '../../infrastructure/auth/bcrypt-password.service';
import { PASSWORD_SERVICE } from '../../infrastructure/auth/bcrypt-password.service';
import {
  LoginDto,
  LoginResponseDto,
} from '../../presentation/auth/dto/login.dto';

/**
 * 인증 애플리케이션 서비스
 *
 * 로그인, 토큰 갱신 등 인증 관련 유스케이스를 처리합니다.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    @Inject(PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * 사용자 로그인
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // 1. 이메일로 사용자 조회
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    // 2. 삭제된 사용자 체크
    if (user.isDeleted()) {
      throw new UnauthorizedException('비활성화된 계정입니다.');
    }

    // 3. 비밀번호 검증
    const isPasswordValid = await this.passwordService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    // 4. JWT 토큰 생성
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = this.jwtTokenService.generateTokens(payload);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtTokenService.verifyToken(refreshToken);

      const user = await this.userRepository.findById(payload.sub);
      if (!user || user.isDeleted()) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        accessToken: this.jwtTokenService.generateAccessToken(newPayload),
      };
    } catch {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }
  }
}
