import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Concert, IConcertRepository } from '../../../domain/concert';

/**
 * Prisma 기반 Concert 리포지토리 구현
 *
 * Infrastructure 레이어에서 실제 데이터 접근을 구현합니다.
 * - Prisma 모델 <-> 도메인 엔티티 변환
 * - 도메인 레이어는 이 구현에 의존하지 않음
 */
@Injectable()
export class PrismaConcertRepository implements IConcertRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Concert | null> {
    const data = await this.prisma.concert.findUnique({
      where: { id },
    });

    if (!data) return null;

    return Concert.create({
      id: data.id,
      name: data.name,
      date: data.date,
      venue: data.venue,
      totalSeats: data.totalSeats,
      availableSeats: data.availableSeats,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async findAll(): Promise<Concert[]> {
    const dataList = await this.prisma.concert.findMany({
      orderBy: { date: 'asc' },
    });

    return dataList.map((data) =>
      Concert.create({
        id: data.id,
        name: data.name,
        date: data.date,
        venue: data.venue,
        totalSeats: data.totalSeats,
        availableSeats: data.availableSeats,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }),
    );
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Concert[]> {
    const dataList = await this.prisma.concert.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    return dataList.map((data) =>
      Concert.create({
        id: data.id,
        name: data.name,
        date: data.date,
        venue: data.venue,
        totalSeats: data.totalSeats,
        availableSeats: data.availableSeats,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }),
    );
  }

  async save(concert: Concert): Promise<Concert> {
    const data = await this.prisma.concert.upsert({
      where: { id: concert.id },
      update: {
        name: concert.name,
        date: concert.date,
        venue: concert.venue,
        totalSeats: concert.totalSeats,
        availableSeats: concert.availableSeats,
      },
      create: {
        id: concert.id,
        name: concert.name,
        date: concert.date,
        venue: concert.venue,
        totalSeats: concert.totalSeats,
        availableSeats: concert.availableSeats,
      },
    });

    return Concert.create({
      id: data.id,
      name: data.name,
      date: data.date,
      venue: data.venue,
      totalSeats: data.totalSeats,
      availableSeats: data.availableSeats,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.concert.delete({
      where: { id },
    });
  }
}
