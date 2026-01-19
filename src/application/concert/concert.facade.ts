import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  SEAT_REPOSITORY,
  type ISeatRepository,
} from 'src/domain/concert/repositories/seat.repository.interface';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class ConcertFacade {
  constructor(
    @Inject(SEAT_REPOSITORY)
    private readonly seatRepository: ISeatRepository,
    private readonly prisma: PrismaService, // 트랜잭션 관리를 위해 직접 주입 (또는 UnitOfWork 패턴 권장)
  ) {}

  /**
   * 예약 가능한 좌석 목록 조회
   */
  async getAvailableSeats(scheduleId: string) {
    return this.seatRepository.findAvailableSeats(scheduleId);
  }

  /**
   * 좌석 예약 요청 (트랜잭션 + 낙관적 락)
   */
  async reserveSeat(userId: string, seatId: string) {
    // 1. 트랜잭션 외부에서 먼저 좌석 정보 조회 (Optional: 부하 분산)
    const seat = await this.seatRepository.findById(seatId);
    if (!seat) {
      throw new NotFoundException('Seat not found');
    }

    if (!seat.isAvailable()) {
      throw new ConflictException('Seat is already reserved or unavailable');
    }

    // 2. 트랜잭션 시작
    return this.prisma.$transaction(async (tx) => {
      // 3. 좌석 상태 업데이트 (낙관적 락 적용)
      // 레포지토리의 updateStatus 메서드는 version 체크를 포함함
      // 여기서 tx를 레포지토리에 전달하려면 구조 변경이 필요할 수 있음.
      // 간단한 구현을 위해 여기서는 직접 updateMany를 호출하거나,
      // Repository가 TxClient를 받을 수 있게 설계해야 함.
      // * 이번 구현에서는 Repository Pattern의 순수성을 일부 양보하고 Prisma의존성을 Facade에서 활용하여 트랜잭션 처리 *

      const updateResult = await tx.seat.updateMany({
        where: {
          id: seatId,
          version: seat.version, // 읽어온 시점의 버전
          status: 'AVAILABLE', // 한 번 더 상태 체크
        },
        data: {
          status: 'HOLDING', // 임시 배정
          version: { increment: 1 },
        },
      });

      if (updateResult.count === 0) {
        throw new ConflictException(
          'Seat reservation failed due to concurrency conflict (Optimistic Lock)',
        );
      }

      // 4. 예약 정보 생성
      const reservation = await tx.reservation.create({
        data: {
          userId,
          scheduleId: seat.scheduleId,
          seatId: seat.id,
          totalPrice: seat.price,
          status: 'PENDING',
          reservedAt: new Date(),
          expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5분 만료
        },
      });

      return reservation;
    });
  }
}
