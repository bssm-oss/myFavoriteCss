# Local development

## English

### Fastest path

```bash
pnpm local:setup
pnpm local:dev
```

Shortcuts:

- `pnpm local:setup`
  install deps, create `.env` if missing, start Postgres, migrate, seed, build extension
- `pnpm local:dev`
  load `.env` and run server, web app, and extension builder together
- `pnpm local:verify`
  run typecheck, tests, integration test, E2E, and build

Underlying helper:

- `scripts/morph-local.sh`

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker
- Chrome 120+

### Manual step-by-step

```bash
pnpm install
docker compose up -d postgres
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev:server
pnpm dev:web
pnpm dev:extension
```

Local URLs:

- server: `http://localhost:8787`
- web app: `http://localhost:5173`
- fixtures: `http://localhost:5173/fixtures/article`
- extension bundle: `apps/extension/dist`

### Loading the extension

1. Open `chrome://extensions`
2. Enable Developer mode
3. Choose `Load unpacked`
4. Select `apps/extension/dist`
5. Open the side panel

### Recommended smoke flow

1. Visit `http://localhost:5173/fixtures/article`
2. Open the side panel
3. Enable the site
4. Choose `Reader Focus`
5. Preview
6. Apply
7. Undo
8. Reload and check cache behavior

### Verification commands

```bash
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm build
pnpm local:verify
```

Related evidence:

- `tests/manual/local-smoke-2026-03-26.md`
- `output/playwright/2026-03-26/`

## 한국어

### 가장 빠른 실행 경로

```bash
pnpm local:setup
pnpm local:dev
```

단축 명령:

- `pnpm local:setup`
  의존성 설치, `.env` 자동 생성, Postgres 시작, 마이그레이션/시드 실행, 확장 빌드
- `pnpm local:dev`
  `.env`를 읽고 서버, 웹앱, 확장 빌더를 함께 실행
- `pnpm local:verify`
  타입체크, 테스트, 통합 테스트, E2E, 빌드까지 한 번에 실행

실제 스크립트:

- `scripts/morph-local.sh`

### 준비물

- Node.js 20+
- pnpm 9+
- Docker
- Chrome 120+

### 수동 실행 절차

```bash
pnpm install
docker compose up -d postgres
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev:server
pnpm dev:web
pnpm dev:extension
```

로컬 URL:

- 서버: `http://localhost:8787`
- 웹앱: `http://localhost:5173`
- fixture: `http://localhost:5173/fixtures/article`
- 확장 번들: `apps/extension/dist`

### 확장 로드 방법

1. `chrome://extensions` 열기
2. Developer mode 활성화
3. `Load unpacked` 선택
4. `apps/extension/dist` 선택
5. 사이드패널 열기

### 추천 스모크 흐름

1. `http://localhost:5173/fixtures/article` 접속
2. 사이드패널 열기
3. 사이트 enable
4. `Reader Focus` 선택
5. Preview
6. Apply
7. Undo
8. 새로고침 후 캐시 동작 확인

### 검증 명령

```bash
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm build
pnpm local:verify
```

관련 증거:

- `tests/manual/local-smoke-2026-03-26.md`
- `output/playwright/2026-03-26/`
