/**
 * User 도메인 엔티티
 *
 * DDD의 핵심 개념인 도메인 엔티티입니다.
 * - Prisma 모델과 분리된 순수 도메인 객체
 * - 비즈니스 로직을 메서드로 캡슐화
 * - 불변성과 유효성 검증 포함
 * - Soft Delete 지원
 */

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export class User {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
    private _password: string,
    private readonly _name: string,
    private readonly _role: UserRole, // 스키마에는 없으나 로직상 유지 (Default: USER)
    private _status: UserStatus,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date | null,
  ) {}

  // Getters
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get name(): string {
    return this._name;
  }

  get role(): UserRole {
    return this._role;
  }

  get status(): UserStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  // 팩토리 메서드
  static create(props: {
    id: string;
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    status?: UserStatus;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }): User {
    if (!props.email || !props.email.includes('@')) {
      throw new Error('유효한 이메일 주소가 필요합니다.');
    }

    if (!props.password || props.password.length < 8) {
      throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
    }

    if (!props.name || props.name.trim().length === 0) {
      throw new Error('이름은 필수입니다.');
    }

    return new User(
      props.id,
      props.email,
      props.password,
      props.name,
      props.role ?? UserRole.USER,
      props.status ?? UserStatus.ACTIVE,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.deletedAt ?? null,
    );
  }

  // 데이터베이스에서 복원할 때 사용 (유효성 검증 스킵)
  static fromPersistence(props: {
    id: string;
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    status?: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): User {
    return new User(
      props.id,
      props.email,
      props.password,
      props.name,
      props.role ?? UserRole.USER,
      props.status ?? UserStatus.ACTIVE,
      props.createdAt,
      props.updatedAt,
      props.deletedAt,
    );
  }

  // Soft Delete 관련 비즈니스 로직
  delete(): void {
    if (this._deletedAt !== null) {
      throw new Error('이미 삭제된 사용자입니다.');
    }
    this._deletedAt = new Date();
    this._status = UserStatus.DELETED;
    this._updatedAt = new Date();
  }

  restore(): void {
    if (this._deletedAt === null) {
      throw new Error('삭제되지 않은 사용자입니다.');
    }
    this._deletedAt = null;
    this._status = UserStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  // 비밀번호 변경
  changePassword(newPassword: string): void {
    if (!newPassword || newPassword.length < 8) {
      throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
    }
    this._password = newPassword;
    this._updatedAt = new Date();
  }

  // 관리자 권한 확인
  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }
}
