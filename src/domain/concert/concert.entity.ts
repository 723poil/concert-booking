/**
 * Concert 도메인 엔티티
 *
 * DDD의 핵심 개념인 도메인 엔티티입니다.
 * - Prisma 모델과 분리된 순수 도메인 객체
 * - 비즈니스 로직을 메서드로 캡슐화
 * - 불변성과 유효성 검증 포함
 */
export class Concert {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _date: Date,
    private readonly _venue: string,
    private readonly _totalSeats: number,
    private _availableSeats: number,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get date(): Date {
    return this._date;
  }

  get venue(): string {
    return this._venue;
  }

  get totalSeats(): number {
    return this._totalSeats;
  }

  get availableSeats(): number {
    return this._availableSeats;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // 팩토리 메서드
  static create(props: {
    id: string;
    name: string;
    date: Date;
    venue: string;
    totalSeats: number;
    availableSeats?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }): Concert {
    if (props.totalSeats <= 0) {
      throw new Error('총 좌석 수는 0보다 커야 합니다.');
    }

    return new Concert(
      props.id,
      props.name,
      props.date,
      props.venue,
      props.totalSeats,
      props.availableSeats ?? props.totalSeats,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }

  // 비즈니스 로직
  canReserve(seatCount: number): boolean {
    return this._availableSeats >= seatCount;
  }

  reserve(seatCount: number): void {
    if (!this.canReserve(seatCount)) {
      throw new Error('예약 가능한 좌석이 부족합니다.');
    }
    this._availableSeats -= seatCount;
  }

  cancelReservation(seatCount: number): void {
    const newAvailable = this._availableSeats + seatCount;
    if (newAvailable > this._totalSeats) {
      throw new Error('취소할 좌석 수가 올바르지 않습니다.');
    }
    this._availableSeats = newAvailable;
  }

  isUpcoming(): boolean {
    return this._date > new Date();
  }

  isSoldOut(): boolean {
    return this._availableSeats === 0;
  }
}
