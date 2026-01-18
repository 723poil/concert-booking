import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * 비밀번호 서비스 인터페이스
 */
export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

/**
 * Bcrypt 기반 비밀번호 서비스
 *
 * 비밀번호 해싱 및 비교를 담당합니다.
 */
@Injectable()
export class BcryptPasswordService implements IPasswordService {
  private readonly SALT_ROUNDS = 10;

  /**
   * 비밀번호 해싱
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * 비밀번호 비교
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export const PASSWORD_SERVICE = Symbol('IPasswordService');
