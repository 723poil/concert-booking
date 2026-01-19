/**
 * Concert 도메인 엔티티
 *
 * 공연의 기본 정보(이름, 아티스트 등)를 관리합니다.
 * 스케줄 정보는 ConcertSchedule 애그리거트에서 별도로 관리합니다.
 */
export class Concert {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _artist: string,
    private readonly _description: string | null,
    private readonly _thumbnailUrl: string | null,
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

  get artist(): string {
    return this._artist;
  }

  get description(): string | null {
    return this._description;
  }

  get thumbnailUrl(): string | null {
    return this._thumbnailUrl;
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
    artist: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Concert {
    return new Concert(
      props.id,
      props.name,
      props.artist,
      props.description ?? null,
      props.thumbnailUrl ?? null,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
