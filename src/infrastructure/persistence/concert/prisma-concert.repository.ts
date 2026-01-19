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
      artist: data.artist || '', // artist is nullable in schema, handle it
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async findAll(): Promise<Concert[]> {
    const dataList = await this.prisma.concert.findMany({
      orderBy: { createdAt: 'desc' }, // 정렬 기준 변경 (date 없음)
    });

    return dataList.map((data) =>
      Concert.create({
        id: data.id,
        name: data.name,
        artist: data.artist || '',
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }),
    );
  }

  // Concert 자체에는 날짜가 없으므로 Schedule을 통해 조회해야 함.
  // 이 메서드는 Interface 변경이 필요하거나, ScheduleRepository로 이동해야 함.
  // 여기서는 일단 구현을 비워두거나, 스케줄을 조인해서 가져오는 방식으로 변경해야 함.
  // 하지만 현재 IConcertRepository 인터페이스 정의상 Concert[]를 반환해야 하므로,
  // 기간 내 스케줄이 있는 콘서트를 조회하는 로직으로 변경.
  async findByDateRange(startDate: Date, endDate: Date): Promise<Concert[]> {
    const dataList = await this.prisma.concert.findMany({
      where: {
        schedules: {
          some: {
            startAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      distinct: ['id'], // 중복 제거
      orderBy: { name: 'asc' },
    });

    return dataList.map((data) =>
      Concert.create({
        id: data.id,
        name: data.name,
        artist: data.artist || '',
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
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
        artist: concert.artist,
        description: concert.description,
        thumbnailUrl: concert.thumbnailUrl,
      },
      create: {
        id: concert.id,
        name: concert.name,
        artist: concert.artist,
        description: concert.description,
        thumbnailUrl: concert.thumbnailUrl,
      },
    });

    return Concert.create({
      id: data.id,
      name: data.name,
      artist: data.artist || '',
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
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
