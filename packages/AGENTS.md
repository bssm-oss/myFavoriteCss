# Shared packages agent instructions

## English

These instructions apply to `packages/*`.

### Mission

The `packages` directory is where repository-wide contracts and reusable logic live. Changes here affect multiple runtimes at once, so be stricter than you would be inside a single app.

### Hard rules

- avoid app-specific imports from shared packages
- keep boundaries explicit between config, cache, ai, shared contracts, and ui
- prevent circular dependencies
- prefer stable exported APIs over ad-hoc deep imports
- do not leak browser-only details into packages that must stay runtime-agnostic
- do not leak provider secrets or environment assumptions into shared code

### Package intent

- `packages/shared`
  Zod schemas, shared types, typed contracts
- `packages/config`
  seeded defaults, heuristics, URL normalization rules, sensitive-site logic
- `packages/cache`
  cache keys, similarity scoring, TTL helpers
- `packages/ai`
  provider abstraction, prompt building, config validation, transform compilation
- `packages/ui`
  reusable React UI primitives and shared styles

### API discipline

- exported types and schemas should change together
- if a schema becomes stricter, review all callers
- if a public helper changes semantics, update docs and tests together
- keep package surfaces small and intentional

### Cross-package discipline

- `shared` should remain the canonical contract source
- `config` can depend on `shared` only when it truly needs shared types
- `cache` should stay deterministic and side-effect-light
- `ai` should consume contracts, not redefine them
- `ui` should not import app runtime code

### Verification

- schema or contract changes
  run package tests and typecheck
- AI package changes
  run AI tests and extension verification when behavior is user-visible
- config or cache changes
  run their tests because small logic shifts can have wide effects

## 한국어

이 지침은 `packages/*`에 적용됩니다.

### 미션

`packages` 디렉터리는 저장소 전체가 함께 쓰는 계약과 재사용 로직의 위치입니다. 여기 변경은 여러 런타임에 동시에 영향을 주므로 단일 앱 안에서보다 더 엄격하게 다뤄야 합니다.

### 강한 규칙

- shared package에서 app-specific import를 만들지 않습니다
- config, cache, ai, shared contract, ui 경계를 명확히 유지합니다
- 순환 의존성을 만들지 않습니다
- 임시 deep import보다 안정적인 public export를 우선합니다
- 런타임 중립이어야 하는 패키지에 browser-only 세부사항을 새지 않게 합니다
- shared code에 provider secret이나 환경 의존 가정을 넣지 않습니다

### 패키지별 의도

- `packages/shared`
  Zod schema, shared type, typed contract
- `packages/config`
  seeded default, heuristic, URL 정규화 규칙, 민감 사이트 로직
- `packages/cache`
  cache key, similarity scoring, TTL helper
- `packages/ai`
  provider 추상화, prompt 생성, config 검증, transform 컴파일
- `packages/ui`
  재사용 가능한 React UI primitive와 공용 스타일

### API 규율

- export되는 type과 schema는 같이 바뀌어야 합니다
- schema가 더 엄격해지면 모든 caller를 같이 검토합니다
- public helper 의미가 바뀌면 문서와 테스트를 같이 갱신합니다
- package surface는 작고 의도적으로 유지합니다

### 패키지 간 규율

- `shared`는 계약의 정본이어야 합니다
- `config`는 shared type이 진짜 필요할 때만 `shared`에 의존합니다
- `cache`는 deterministic하고 side-effect가 적어야 합니다
- `ai`는 계약을 소비해야지 다시 정의하면 안 됩니다
- `ui`는 app runtime 코드를 import하지 않습니다

### 검증

- schema 또는 contract 변경
  패키지 테스트와 typecheck 실행
- AI package 변경
  AI 테스트와, 사용자 가시 동작이 바뀌면 extension 검증도 함께 실행
- config 또는 cache 변경
  작은 로직 변화도 넓게 영향 주므로 전용 테스트 실행
