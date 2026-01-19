export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

/**
 * Reservation 도메인 엔티티
 *
 * 예약 정보를 관리합니다.
 * - 예약 시간, 만료 시간, 결제 정보 등을 포함합니다.
 */
export class Reservation {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _scheduleId: string,
    private readonly _seatId: string,
    private _status: ReservationStatus,
    private readonly _totalPrice: number,
    private readonly _reservedAt: Date, // 임시 점유 시작 시간
    private readonly _expiredAt: Date, // 임시 점유 만료 시간
    private _confirmedAt: Date | null,
    private _cancelledAt: Date | null,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get scheduleId(): string {
    return this._scheduleId;
  }

  get seatId(): string {
    return this._seatId;
  }

  get status(): ReservationStatus {
    return this._status;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  get expiredAt(): Date {
    return this._expiredAt;
  }

  // Business Logic
  confirm(now: Date = new Date()): void {
    if (this._status !== ReservationStatus.PENDING) {
      throw new Error('Reservation is not pending.');
    }
    if (now > this._expiredAt) {
      throw new Error('Reservation expired.');
    }
    this._status = ReservationStatus.CONFIRMED;
    this._confirmedAt = now;
  }

  cancel(now: Date = new Date()): void {
    if (this._status === ReservationStatus.CANCELLED) return;
    this._status = ReservationStatus.CANCELLED;
    this._cancelledAt = now;
  }

  expire(): void {
    if (this._status === ReservationStatus.PENDING) {
      this._status = ReservationStatus.EXPIRED;
    }
  }

  // Factory
  static create(props: {
    id: string;
    userId: string;
    scheduleId: string;
    seatId: string;
    totalPrice: number;
    reservedAt?: Date;
    expiredAt?: Date; // Default: reservedAt + 5 mins
    status?: ReservationStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }): Reservation {
    const reservedAt = props.reservedAt ?? new Date();
    // Default expiration: 5 minutes
    const expiredAt =
      props.expiredAt ?? new Date(reservedAt.getTime() + 5 * 60 * 1000);

    return new Reservation(
      props.id,
      props.userId,
      props.scheduleId,
      props.seatId,
      props.status ?? ReservationStatus.PENDING,
      props.totalPrice,
      reservedAt,
      expiredAt,
      null, // confirmedAt
      null, // cancelledAt
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
