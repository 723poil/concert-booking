import { User } from './user.entity';

/**
 * User 리포지토리 인터페이스
 *
 * DDD의 Repository 패턴을 구현합니다.
 * - 도메인 레이어에 인터페이스 정의 (의존성 역전)
 * - 실제 구현은 Infrastructure 레이어에서 수행
 * - Soft Delete를 고려한 조회 메서드
 */
export interface IUserRepository {
  /**
   * ID로 사용자 조회 (삭제되지 않은 사용자만)
   */
  findById(id: string): Promise<User | null>;

  /**
   * 이메일로 사용자 조회 (삭제되지 않은 사용자만)
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * ID로 사용자 조회 (삭제된 사용자 포함)
   */
  findByIdWithDeleted(id: string): Promise<User | null>;

  /**
   * 사용자 저장 (생성 또는 업데이트)
   */
  save(user: User): Promise<User>;

  /**
   * Soft Delete 수행
   */
  softDelete(id: string): Promise<void>;

  /**
   * 삭제된 사용자 복원
   */
  restore(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
