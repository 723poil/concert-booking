import { Seat } from '../seat.entity';

export interface ISeatRepository {
  findAvailableSeats(scheduleId: string): Promise<Seat[]>;
  findById(id: string): Promise<Seat | null>;
  // Optimistic Lock을 지원하는 저장 메서드
  save(seat: Seat): Promise<Seat>;
  // 트랜잭션 내에서 여러 좌석 상태 업데이트 (필요 시)
  updateStatus(id: string, status: string, version: number): Promise<boolean>;
}

export const SEAT_REPOSITORY = Symbol('ISeatRepository');
