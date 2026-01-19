export enum ScheduleStatus {
  UPCOMING = 'UPCOMING',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

/**
 * ConcertSchedule 도메인 엔티티
 *
 * 특정 날짜와 시간의 공연 일정 및 전체 좌석 현황을 관리합니다.
 */
export class ConcertSchedule {
  constructor(
    private readonly _id: string,
    private readonly _concertId: string,
    private readonly _startAt: Date,
    private readonly _endAt: Date,
    private readonly _venue: string,
    private readonly _totalSeats: number,
    private _availableSeats: number,
    private readonly _status: ScheduleStatus,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  // Getters
  get id(): string {
    return this._id;
  }

  get concertId(): string {
    return this._concertId;
  }

  get startAt(): Date {
    return this._startAt;
  }

  get endAt(): Date {
    return this._endAt;
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

  get status(): ScheduleStatus {
    return this._status;
  }

  // Business Logic
  isReservable(seatCount: number = 1): boolean {
    return (
      this._status === ScheduleStatus.OPEN &&
      this._availableSeats >= seatCount &&
      new Date() < this._startAt
    );
  }

  decreaseAvailableSeats(count: number = 1): void {
    if (this._availableSeats < count) {
      throw new Error('No available seats');
    }
    this._availableSeats -= count;
  }

  increaseAvailableSeats(count: number = 1): void {
    if (this._availableSeats + count > this._totalSeats) {
      throw new Error('Available seats cannot exceed total seats');
    }
    this._availableSeats += count;
  }

  // Factory
  static create(props: {
    id: string;
    concertId: string;
    startAt: Date;
    endAt: Date;
    venue: string;
    totalSeats: number;
    availableSeats?: number;
    status?: ScheduleStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }): ConcertSchedule {
    return new ConcertSchedule(
      props.id,
      props.concertId,
      props.startAt,
      props.endAt,
      props.venue,
      props.totalSeats,
      props.availableSeats ?? props.totalSeats,
      props.status ?? ScheduleStatus.UPCOMING,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
