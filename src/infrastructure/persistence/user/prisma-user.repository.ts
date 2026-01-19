import { Injectable } from '@nestjs/common';
import {
  IUserRepository,
  User,
  UserRole,
  UserStatus,
} from '../../../domain/user';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Prisma 기반 User 리포지토리 구현
 */
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!data || data.deletedAt) {
      return null; // 논리적 삭제된 유저는 조회하지 않음
    }

    return this.toDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!data || data.deletedAt) {
      return null;
    }

    return this.toDomain(data);
  }

  async findByIdWithDeleted(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async save(user: User): Promise<User> {
    // 패스워드와 상태 등을 DB 스키마에 맞게 매핑
    const data = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        passwordHash: user.password, // 도메인 password -> DB passwordHash
        status: user.status as any, // Enum mapping if needed
        updatedAt: new Date(),
        deletedAt: user.deletedAt,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        passwordHash: user.password,
        status: user.status as any,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
    });

    return this.toDomain(data);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        status: 'DELETED',
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        deletedAt: null,
      },
    });
  }

  private toDomain(ormEntity: any): User {
    return User.fromPersistence({
      id: ormEntity.id,
      email: ormEntity.email,
      password: ormEntity.passwordHash || '', // DB passwordHash -> Domain password
      name: ormEntity.name,
      role: UserRole.USER, // DB에 role 필드가 없으므로 기본값 설정
      status: ormEntity.status as UserStatus,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
    });
  }
}
