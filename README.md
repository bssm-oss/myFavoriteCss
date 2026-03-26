# Morph UI

## English

Morph UI is a production-oriented Chrome Extension plus backend for reversible UI adaptation. It analyzes the live DOM, generates a validated transformation plan, applies safe CSS and reversible DOM operations, and stores artifacts so revisits can reuse cache immediately.

### What the product does

Users can:

- create a global preference profile
- override preferences per site
- preview a transform before applying it
- apply, undo, and reset transforms
- enable auto-apply for a site
- inspect provider status, cache state, and diagnostics

The system is DOM-first and CSS-first. Screenshot input is optional and secondary. Provider credentials stay on the server.

### Fastest local start

```bash
pnpm local:setup
pnpm local:dev
```

What these commands do:

- `pnpm local:setup`
  installs dependencies, creates `.env` if missing, starts Postgres, runs migrations and seed, and builds the extension
- `pnpm local:dev`
  loads `.env` and starts the server, web app, and extension dev build together
- `pnpm local:verify`
  runs typecheck, tests, integration test, E2E, and build

### Manual local usage

1. Run `pnpm local:setup`
2. Run `pnpm local:dev`
3. Open `chrome://extensions`
4. Enable Developer mode
5. Load unpacked extension from `apps/extension/dist`
6. Visit `http://localhost:5173/fixtures/article`
7. Open the Morph UI side panel
8. Enable the site
9. Choose a profile such as `Reader Focus`
10. Preview, apply, undo, and reload to inspect cache behavior

### Important commands

```bash
pnpm local:setup
pnpm local:dev
pnpm local:verify
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm build
```

### Environment variables

Key values in `.env`:

- `SESSION_TOKEN_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_OAUTH_REDIRECT_URI`
- `OPENAI_API_KEY` or `GEMINI_API_KEY`

The sample file is:

- `.env.example`
- detailed reference: [docs/environment-variables.md](./docs/environment-variables.md)

### Repository structure

- `apps/extension`
  Chrome MV3 extension, side panel UI, background worker, content scripts
- `apps/server`
  Fastify backend, auth, provider adapters, cache routes, feedback routes
- `apps/web`
  help pages, privacy pages, and local fixture pages
- `packages/shared`
  Zod-first contracts and shared types
- `packages/config`
  URL normalization, sensitive-site heuristics, seeded profiles
- `packages/cache`
  cache keys, similarity scoring, TTL helpers
- `packages/ai`
  provider abstraction, prompt building, transform compilation
- `packages/ui`
  shared React UI primitives and styles
- `docs`
  engineering documentation
- `tests`
  root-level human-readable smoke notes and checklists

### Documentation map

- [AGENTS.md](./AGENTS.md)
- [docs/README.md](./docs/README.md)
- [docs/architecture.md](./docs/architecture.md)
- [docs/api-contracts.md](./docs/api-contracts.md)
- [docs/data-model.md](./docs/data-model.md)
- [docs/cache-and-fingerprint.md](./docs/cache-and-fingerprint.md)
- [docs/transform-plan-spec.md](./docs/transform-plan-spec.md)
- [docs/privacy-and-data-flow.md](./docs/privacy-and-data-flow.md)
- [docs/provider-capabilities.md](./docs/provider-capabilities.md)
- [docs/extension-runtime.md](./docs/extension-runtime.md)
- [docs/environment-variables.md](./docs/environment-variables.md)
- [docs/diagnostics-and-observability.md](./docs/diagnostics-and-observability.md)
- [docs/local-development.md](./docs/local-development.md)
- [docs/user-workflow-guide.md](./docs/user-workflow-guide.md)
- [docs/storage-and-sync-layout.md](./docs/storage-and-sync-layout.md)
- [docs/ai-provider-integration.md](./docs/ai-provider-integration.md)
- [docs/backend-route-reference.md](./docs/backend-route-reference.md)
- [docs/operations-runbook.md](./docs/operations-runbook.md)
- [docs/release-playbook.md](./docs/release-playbook.md)
- [docs/testing-fixtures.md](./docs/testing-fixtures.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [tests/README.md](./tests/README.md)

### Verification already recorded in the repo

- root smoke note: [tests/manual/local-smoke-2026-03-26.md](./tests/manual/local-smoke-2026-03-26.md)
- captured evidence: [tests/evidence/README.md](./tests/evidence/README.md)

### Important limitations

- v1 does not reuse ChatGPT Plus or Gemini Advanced consumer subscriptions
- provider-linked end-user billing is intentionally not implemented
- screenshot planning is optional and privacy-gated
- path overrides exist in schema and database but the current UX is focused on site-level flows first

## 한국어

Morph UI는 기존 웹페이지를 안전하게 변형하는 프로덕션 지향 Chrome Extension + 백엔드 프로젝트입니다. 실제 DOM을 분석하고, 검증된 변환 계획을 만든 뒤, 안전한 CSS와 되돌릴 수 있는 DOM 조작을 적용하며, 재방문 시에는 캐시를 즉시 재사용할 수 있도록 아티팩트를 저장합니다.

### 제품이 하는 일

사용자는 다음을 할 수 있습니다.

- 전역 UI 선호 프로필 생성
- 사이트별 설정 오버라이드
- 적용 전 미리보기
- 적용, 되돌리기, 초기화
- 사이트별 자동 적용 설정
- provider 상태, 캐시 상태, 진단 정보 확인

시스템은 DOM-first, CSS-first 전략을 사용합니다. 스크린샷 입력은 선택적이며 보조 수단입니다. Provider 비밀키는 서버에만 존재합니다.

### 가장 빠른 로컬 실행

```bash
pnpm local:setup
pnpm local:dev
```

각 명령의 역할:

- `pnpm local:setup`
  의존성 설치, `.env` 자동 생성, Postgres 시작, 마이그레이션/시드 실행, 확장 빌드
- `pnpm local:dev`
  `.env`를 읽고 서버, 웹앱, 확장 개발 빌드를 한 번에 실행
- `pnpm local:verify`
  타입체크, 테스트, 통합 테스트, E2E, 빌드를 한 번에 실행

### 로컬에서 직접 써보는 순서

1. `pnpm local:setup` 실행
2. `pnpm local:dev` 실행
3. `chrome://extensions` 열기
4. Developer mode 활성화
5. `apps/extension/dist`를 unpacked extension으로 로드
6. `http://localhost:5173/fixtures/article` 접속
7. Morph UI 사이드패널 열기
8. 사이트 enable
9. `Reader Focus` 같은 프로필 선택
10. Preview, Apply, Undo, 새로고침 후 캐시 동작 확인

### 주요 명령어

```bash
pnpm local:setup
pnpm local:dev
pnpm local:verify
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm build
```

### 환경변수

`.env`에서 특히 중요한 값:

- `SESSION_TOKEN_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_OAUTH_REDIRECT_URI`
- `OPENAI_API_KEY` 또는 `GEMINI_API_KEY`

샘플 파일:

- `.env.example`
- 상세 설명: [docs/environment-variables.md](./docs/environment-variables.md)

### 저장소 구조

- `apps/extension`
  Chrome MV3 확장, 사이드패널 UI, 백그라운드 워커, 콘텐츠 스크립트
- `apps/server`
  Fastify 백엔드, 인증, provider adapter, 캐시/피드백 라우트
- `apps/web`
  도움말/프라이버시 페이지와 로컬 fixture 페이지
- `packages/shared`
  Zod 기반 공용 스키마와 타입
- `packages/config`
  URL 정규화, 민감 사이트 규칙, 시드 프로필
- `packages/cache`
  캐시 키, 유사도 계산, TTL 정책
- `packages/ai`
  provider 추상화, 프롬프트 생성, 변환 컴파일
- `packages/ui`
  공용 React UI 프리미티브와 스타일
- `docs`
  엔지니어링 문서
- `tests`
  사람이 읽는 스모크 노트와 체크리스트

### 문서 인덱스

- [AGENTS.md](./AGENTS.md)
- [docs/README.md](./docs/README.md)
- [docs/architecture.md](./docs/architecture.md)
- [docs/api-contracts.md](./docs/api-contracts.md)
- [docs/data-model.md](./docs/data-model.md)
- [docs/cache-and-fingerprint.md](./docs/cache-and-fingerprint.md)
- [docs/transform-plan-spec.md](./docs/transform-plan-spec.md)
- [docs/privacy-and-data-flow.md](./docs/privacy-and-data-flow.md)
- [docs/provider-capabilities.md](./docs/provider-capabilities.md)
- [docs/extension-runtime.md](./docs/extension-runtime.md)
- [docs/environment-variables.md](./docs/environment-variables.md)
- [docs/diagnostics-and-observability.md](./docs/diagnostics-and-observability.md)
- [docs/local-development.md](./docs/local-development.md)
- [docs/user-workflow-guide.md](./docs/user-workflow-guide.md)
- [docs/storage-and-sync-layout.md](./docs/storage-and-sync-layout.md)
- [docs/ai-provider-integration.md](./docs/ai-provider-integration.md)
- [docs/backend-route-reference.md](./docs/backend-route-reference.md)
- [docs/operations-runbook.md](./docs/operations-runbook.md)
- [docs/release-playbook.md](./docs/release-playbook.md)
- [docs/testing-fixtures.md](./docs/testing-fixtures.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [tests/README.md](./tests/README.md)

### 저장소 안에 이미 남겨둔 검증 기록

- 스모크 실행 기록: [tests/manual/local-smoke-2026-03-26.md](./tests/manual/local-smoke-2026-03-26.md)
- 캡처 증거 파일: [tests/evidence/README.md](./tests/evidence/README.md)

### 현재 제한사항

- v1은 ChatGPT Plus, Gemini Advanced 같은 소비자 구독 재사용을 하지 않습니다
- provider 연동형 최종 사용자 과금은 의도적으로 구현하지 않았습니다
- 스크린샷 기반 planning은 선택적이며 privacy 규칙에 묶여 있습니다
- path override는 스키마/DB에는 있지만 현재 UX는 사이트 단위 흐름이 우선입니다
