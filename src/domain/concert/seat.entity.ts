export enum SeatGrade {
  VIP = 'VIP',
  R = 'R',
  S = 'S',
  A = 'A',
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  HOLDING = 'HOLDING',
  RESERVED = 'RESERVED',
}

/**
 * Seat 도메인 엔티티
 *
 * 개별 좌석의 정보와 상태를 관리합니다.
 * - 동시성 제어를 위한 version 필드를 포함합니다.
 */
export class Seat {
  constructor(
    private readonly _id: string,
    private readonly _scheduleId: string,
    private readonly _section: string,
    private readonly _rowNumber: number,
    private readonly _seatNumber: number,
    private readonly _grade: SeatGrade,
    private readonly _price: number,
    private _status: SeatStatus,
    private _version: number, // Optimistic Lock Version
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  // Getters
  get id(): string {
    return this._id;
  }

  get scheduleId(): string {
    return this._scheduleId;
  }

  get section(): string {
    return this._section;
  }

  get rowNumber(): number {
    return this._rowNumber;
  }

  get seatNumber(): number {
    return this._seatNumber;
  }

  get grade(): SeatGrade {
    return this._grade;
  }

  get price(): number {
    return this._price;
  }

  get status(): SeatStatus {
    return this._status;
  }

  get version(): number {
    return this._version;
  }

  // Business Logic
  isAvailable(): boolean {
    return this._status === SeatStatus.AVAILABLE;
  }

  hold(): void {
    if (!this.isAvailable()) {
      throw new Error('Seat is not available.');
    }
    this._status = SeatStatus.HOLDING;
  }

  reserve(): void {
    // HOLDING 상태에서만 RESERVED로 넘어갈 수 있다고 가정
    if (this._status !== SeatStatus.HOLDING) {
      throw new Error('Seat must be in HOLDING status to be reserved.');
    }
    this._status = SeatStatus.RESERVED;
  }

  release(): void {
    this._status = SeatStatus.AVAILABLE;
  }

  // Factory
  static create(props: {
    id: string;
    scheduleId: string;
    section: string;
    rowNumber: number;
    seatNumber: number;
    grade: SeatGrade;
    price: number;
    status?: SeatStatus;
    version?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }): Seat {
    return new Seat(
      props.id,
      props.scheduleId,
      props.section,
      props.rowNumber,
      props.seatNumber,
      props.grade,
      props.price,
      props.status ?? SeatStatus.AVAILABLE,
      props.version ?? 0,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
