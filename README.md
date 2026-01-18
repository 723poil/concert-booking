# 🎫 콘서트 티켓 예매 서비스

콘서트 티켓 예매 백엔드 서비스입니다.

## 기술 스택

| 기술           | 용도              |
| -------------- | ----------------- |
| **NestJS**     | 백엔드 프레임워크 |
| **TypeScript** | 개발 언어         |
| **Prisma**     | ORM               |
| **MySQL**      | 데이터베이스      |
| **Winston**    | 로깅              |

> 📖 기술 선택 이유는 [ARCHITECTURE_DECISIONS.md](./docs/ARCHITECTURE_DECISIONS.md)를 참고하세요.

## 요구 사항

- Node.js 24+ (`.nvmrc` 참고)
- MySQL 8.0+

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에서 DATABASE_URL 수정

# Prisma 클라이언트 생성
npx prisma generate

# 개발 서버 실행
npm run start:dev
```

## 프로젝트 구조 (DDD 기반)

```
src/
├── domain/              # 도메인 레이어 (순수 비즈니스 로직)
│   └── concert/
│       ├── concert.entity.ts      # 도메인 엔티티
│       └── concert.repository.ts  # 리포지토리 인터페이스
│
├── infrastructure/      # 인프라 레이어 (외부 시스템 통합)
│   ├── prisma/          # Prisma 설정
│   └── persistence/     # 리포지토리 구현
│
├── application/         # 애플리케이션 레이어 (유즈케이스) - 추후 구현
├── presentation/        # 프레젠테이션 레이어 (API) - 추후 구현
│
├── common/              # 공통 모듈 (로거 등)
├── app.module.ts        # 루트 모듈
└── main.ts              # 엔트리 포인트

prisma/
└── schema.prisma        # DB 스키마 정의

docs/
└── ARCHITECTURE_DECISIONS.md  # 기술 선택 이유 (ADR)
```

## 스크립트

```bash
npm run start:dev    # 개발 서버 (watch mode)
npm run build        # 빌드
npm run start:prod   # 프로덕션 실행
npm run test         # 단위 테스트
npm run test:e2e     # E2E 테스트
```

## 라이선스

MIT
