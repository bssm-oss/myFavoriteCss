# Shared packages agent instructions

## English

These instructions apply to `packages/*`.

### Core responsibility

The packages directory contains reusable, cross-app logic.

### Hard rules

- avoid app-specific imports from shared packages
- keep boundaries explicit between config, cache, ai, shared contracts, and ui
- prevent circular dependencies
- prefer stable exported APIs over ad-hoc deep imports

### Package intent

- `packages/shared`: Zod schemas, shared types, API contracts
- `packages/config`: config defaults, heuristics, seeded constants
- `packages/cache`: cache keys, similarity, TTL policy helpers
- `packages/ai`: provider abstraction, prompt helpers, transform compilation
- `packages/ui`: reusable React UI primitives and styles

### Verification

- run package tests or root typecheck when public package behavior changes
- update docs when exported contracts or assumptions change

## 한국어

이 지침은 `packages/*`에 적용됩니다.

### 핵심 책임

`packages` 디렉터리는 여러 앱이 함께 쓰는 재사용 로직을 담습니다.

### 강한 규칙

- shared package에서 app-specific import를 만들지 않습니다.
- config, cache, ai, shared contract, ui 경계를 명확히 유지합니다.
- 순환 의존성을 만들지 않습니다.
- 임시 deep import보다 안정적인 public export API를 우선합니다.

### 패키지 의도

- `packages/shared`: Zod schema, 공용 타입, API 계약
- `packages/config`: 기본 설정, heuristic, 시드 상수
- `packages/cache`: cache key, similarity, TTL 정책 헬퍼
- `packages/ai`: provider 추상화, prompt 헬퍼, transform 컴파일
- `packages/ui`: 재사용 가능한 React UI 프리미티브와 스타일

### 검증

- public package 동작이 바뀌면 패키지 테스트나 루트 typecheck를 실행합니다.
- export contract나 가정이 바뀌면 문서도 갱신합니다.
