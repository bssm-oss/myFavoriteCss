# Testing fixtures and validation strategy

## English

`apps/web` exposes deterministic local fixture routes:

- `/fixtures/article`
- `/fixtures/ecommerce`
- `/fixtures/dashboard`
- `/fixtures/docs`
- `/fixtures/form`

These routes are used for:

- page type heuristics
- fingerprint stability
- selector stability
- privacy checks
- extension smoke coverage

### Test layers

- unit tests in packages and extension helpers
- backend integration test with Testcontainers
- extension E2E with Playwright
- root-level manual smoke notes under `tests/`

### Real local evidence

- `tests/manual/local-smoke-2026-03-26.md`
- `output/playwright/2026-03-26/`

## 한국어

`apps/web`는 결정적인 로컬 fixture 라우트를 제공합니다.

- `/fixtures/article`
- `/fixtures/ecommerce`
- `/fixtures/dashboard`
- `/fixtures/docs`
- `/fixtures/form`

이 라우트들은 다음 용도로 사용됩니다.

- 페이지 타입 휴리스틱 검증
- fingerprint 안정성 검증
- selector 안정성 검증
- privacy 체크
- 확장 스모크 검증

### 테스트 계층

- packages와 extension helper의 unit test
- Testcontainers 기반 backend integration test
- Playwright 기반 extension E2E
- `tests/` 아래 루트 수동 smoke 기록

### 실제 로컬 증거

- `tests/manual/local-smoke-2026-03-26.md`
- `output/playwright/2026-03-26/`
