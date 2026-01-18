import { Concert } from './concert.entity';

/**
 * Concert 리포지토리 인터페이스
 *
 * DDD의 Repository 패턴을 구현합니다.
 * - 도메인 레이어에 인터페이스 정의 (의존성 역전)
 * - 실제 구현은 Infrastructure 레이어에서 수행
 */
export interface IConcertRepository {
  findById(id: string): Promise<Concert | null>;
  findAll(): Promise<Concert[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Concert[]>;
  save(concert: Concert): Promise<Concert>;
  delete(id: string): Promise<void>;
}

export const CONCERT_REPOSITORY = Symbol('IConcertRepository');
