# Server agent instructions

## English

These instructions apply to `apps/server`.

### Core responsibility

The server owns trust boundaries:

- product auth and session exchange
- provider access
- remote cache lookup/save
- feedback ingestion
- capability reporting

### Hard rules

- validate request and response shapes with shared Zod schemas
- keep provider credentials server-side only
- redact sensitive payloads before logging
- do not trust extension input blindly
- return provider-independent normalized responses

### Data and schema expectations

- keep Drizzle schema and migrations aligned
- avoid silent schema drift
- document new env requirements
- preserve per-user cache isolation unless the product decision explicitly changes

### Provider adapter expectations

- expose honest capability flags
- keep unsupported consumer-account reuse explicitly unsupported
- prefer structured output paths
- handle refusals and unavailable modes with typed errors

### Verification

- run server tests for route or service changes
- run integration coverage when changing request lifecycles, redaction, cache, or auth

## 한국어

이 지침은 `apps/server`에 적용됩니다.

### 핵심 책임

서버는 신뢰 경계를 소유합니다.

- 제품 인증과 세션 교환
- provider 접근
- 원격 캐시 조회/저장
- feedback 수집
- capability 보고

### 강한 규칙

- 요청/응답 형태는 공용 Zod schema로 검증합니다.
- provider credential은 반드시 서버에만 둡니다.
- 로그 전에는 민감 payload를 redaction합니다.
- extension 입력을 그대로 신뢰하지 않습니다.
- 응답은 provider 독립적인 형태로 정규화합니다.

### 데이터 및 스키마 기대사항

- Drizzle schema와 migration을 일치시킵니다.
- 조용한 schema drift를 만들지 않습니다.
- 새 환경변수 요구사항은 문서화합니다.
- 제품 결정이 바뀌지 않는 한 사용자별 cache 격리를 유지합니다.

### Provider adapter 기대사항

- capability flag를 정직하게 노출합니다.
- 미지원 consumer-account 재사용은 계속 명시적으로 미지원 상태로 둡니다.
- structured output 경로를 우선합니다.
- refusal과 unavailable mode는 typed error로 처리합니다.

### 검증

- route나 service가 바뀌면 서버 테스트를 실행합니다.
- 요청 수명주기, redaction, cache, auth가 바뀌면 integration 검증도 실행합니다.
