import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() 데코레이터
 *
 * 이 데코레이터가 적용된 라우트는 JWT 인증을 건너뜁니다.
 * 로그인, 회원가입 등 공개 API에 사용합니다.
 *
 * @example
 * @Public()
 * @Post('login')
 * async login(@Body() loginDto: LoginDto) {
 *   // ...
 * }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
