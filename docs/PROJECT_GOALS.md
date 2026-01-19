# 프로젝트 목표 (Project Goals)

이 프로젝트는 콘서트 예매 시스템을 구축하며 다음과 같은 기술적 시나리오를 테스트하고 학습하는 것을 주 목표로 합니다.

## 1. MySQL 단독 사용 시나리오 분석

- **목표**: Redis 없이 MySQL만 사용하여 콘서트 예매 로직을 구현했을 때 발생하는 문제점을 파악한다.
- **테스트 포인트**:
  - 트랜잭션 격리 수준(Transaction Isolation Level)에 따른 동시성 이슈 확인.
  - 동시 다발적인 좌석 예매 시도(Race Condition) 시 데이터 정합성 문제 파악.
  - 낙관적 락(Optimistic Lock)과 비관적 락(Pessimistic Lock)의 성능 및 동작 차이 분석.

## 2. MySQL 단독 사용의 한계점 도출

- **목표**: MySQL로만 동시성 문제를 해결하려 할 때 발생하는 구조적, 성능적 단점을 명확히 한다.
- **분석 항목**:
  - 트래픽 급증 시 DB 커넥션 풀(Connection Pool) 고갈 문제.
  - 락(Lock) 대기 인한 응답 지연 및 타임아웃 발생 가능성.
  - 대기열 시스템 부재로 인한 DB 부하 집중.

## 3. Redis 도입에 따른 장단점 분석

- **목표**: Redis를 도입하여 캐싱, 대기열, 분산 락 등을 적용했을 때의 이점과 운영상 단점을 비교 분석한다.
- **분석 항목**:
  - **장점**:
    - 인메모리 기반의 고성능 대기열(Queue) 처리.
    - 분산 락(Distributed Lock)을 이용한 효율적인 동시성 제어.
    - 조회 성능 개선 (Caching).
  - **단점**:
    - 시스템 복잡도 증가 (운영 및 관리 포인트 증가).
    - 데이터 일관성 관리의 어려움 (Cache Invalidation, Write-Back/Through 전략).
    - Redis 장애 시의 SPOF(Single Point of Failure) 가능성 및 대응 방안.
