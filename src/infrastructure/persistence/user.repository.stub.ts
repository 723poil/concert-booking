import { Injectable } from '@nestjs/common';
import { IUserRepository, User, UserRole } from '../../domain';
import { BcryptPasswordService } from '../auth/bcrypt-password.service';

/**
 * User Repository Stub
 *
 * 개발/테스트용 임시 리포지토리입니다.
 * 실제 데이터베이스 연동 전까지 사용합니다.
 *
 * TODO: Prisma 기반 실제 구현체로 교체 필요
 */
@Injectable()
export class UserRepositoryStub implements IUserRepository {
  private users: Map<string, User> = new Map();
  private passwordService = new BcryptPasswordService();

  constructor() {
    // 테스트용 사용자 초기화
    this.initTestUsers();
  }

  private async initTestUsers(): Promise<void> {
    const hashedPassword = await this.passwordService.hash('password123');

    const testUser = User.fromPersistence({
      id: 'test-user-id-1',
      email: 'test@example.com',
      password: hashedPassword,
      name: '테스트 사용자',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const adminUser = User.fromPersistence({
      id: 'admin-user-id-1',
      email: 'admin@example.com',
      password: hashedPassword,
      name: '관리자',
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    this.users.set(testUser.id, testUser);
    this.users.set(adminUser.id, adminUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    if (!user || user.isDeleted()) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email && !user.isDeleted()) {
        return user;
      }
    }
    return null;
  }

  async findByIdWithDeleted(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async softDelete(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.delete();
    }
  }

  async restore(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.restore();
    }
  }
}
