import { Injectable } from '@nestjs/common';
import { ISeatRepository } from '../../../domain/concert/repositories/seat.repository.interface';
import {
  Seat,
  SeatGrade,
  SeatStatus,
} from '../../../domain/concert/seat.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaSeatRepository implements ISeatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailableSeats(scheduleId: string): Promise<Seat[]> {
    const seats = await this.prisma.seat.findMany({
      where: {
        scheduleId: scheduleId,
        status: 'AVAILABLE',
      },
      orderBy: [
        { grade: 'asc' }, // VIP first
        { section: 'asc' },
        { seatNumber: 'asc' },
      ],
    });

    return seats.map(this.toDomain);
  }

  async findById(id: string): Promise<Seat | null> {
    const seat = await this.prisma.seat.findUnique({
      where: { id },
    });

    return seat ? this.toDomain(seat) : null;
  }

  async save(seat: Seat): Promise<Seat> {
    // Upsert logic if needed, but usually we use updateStatus for concurrency
    // This simple save might be used for creation or non-critical updates
    const saved = await this.prisma.seat.upsert({
      where: { id: seat.id },
      create: {
        id: seat.id,
        scheduleId: seat.scheduleId,
        section: seat.section,
        rowNumber: seat.rowNumber,
        seatNumber: seat.seatNumber,
        grade: seat.grade,
        price: seat.price,
        status: seat.status,
        version: seat.version,
      },
      update: {
        status: seat.status,
        version: seat.version,
      },
    });

    return this.toDomain(saved);
  }

  async updateStatus(
    id: string,
    status: string,
    version: number,
  ): Promise<boolean> {
    // 낙관적 락: 현재 버전이 일치할 때만 업데이트하고 버전을 1 증가시킴
    const result = await this.prisma.seat.updateMany({
      where: {
        id: id,
        version: version, // 조건절에 버전 포함
      },
      data: {
        // @ts-ignore
        status: status,
        version: { increment: 1 },
      },
    });

    return result.count > 0;
  }

  private toDomain(ormEntity: any): Seat {
    return new Seat(
      ormEntity.id,
      ormEntity.scheduleId,
      ormEntity.section,
      ormEntity.rowNumber,
      ormEntity.seatNumber,
      ormEntity.grade as SeatGrade,
      ormEntity.price,
      ormEntity.status as SeatStatus,
      ormEntity.version,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }
}
