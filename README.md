# Morph UI

## English

Morph UI is now an extension-only Chrome MV3 project for reversible UI adaptation.

It analyzes the live DOM, generates a schema-validated transform plan, applies safe CSS plus reversible DOM operations, and reuses local cache on revisit. There is no Morph UI backend, no product account system, and no server-side remote cache.

### What changed

- `apps/server` was removed
- Morph UI no longer uses Google product sign-in
- provider planning now runs directly from the extension background
- users configure their own OpenAI or Gemini API key locally
- provider configs are validated against the official API before they are stored
- transforms and large artifacts stay in IndexedDB plus `chrome.storage`

### Fastest local start

```bash
pnpm local:setup
pnpm local:dev
```

Then:

1. Open `chrome://extensions`
2. Enable Developer mode
3. Load unpacked from `apps/extension/dist`
4. Open `http://localhost:5173/fixtures/article`
5. Open the Morph UI side panel
6. Paste a provider API key and click `Validate and save`
7. Enable the site and preview/apply

### Important commands

```bash
pnpm local:setup
pnpm local:dev
pnpm local:verify
pnpm test
pnpm test:e2e
pnpm build
```

### Repository structure

- `apps/extension`
  Chrome MV3 extension, side panel UI, background worker, content scripts
- `apps/web`
  help/privacy pages and deterministic fixture pages
- `packages/shared`
  Zod-first contracts and shared types
- `packages/config`
  URL normalization, sensitive-site heuristics, seeded profiles, default models
- `packages/cache`
  cache keys, similarity scoring, TTL helpers
- `packages/ai`
  browser-safe provider planning, prompt building, transform compilation
- `packages/ui`
  shared React UI primitives and styles
- `docs`
  bilingual engineering documentation
- `tests`
  human-readable smoke notes and evidence

### Security and privacy posture

- provider API keys are stored locally in `chrome.storage.local`
- provider keys are never synced
- the extension requests fixed host permissions only for `https://api.openai.com/*` and `https://generativelanguage.googleapis.com/*`
- strict-local mode blocks provider-assisted planning
- sensitive URLs are blocked from provider-assisted planning by default
- consumer account reuse for ChatGPT Plus and Gemini Advanced is not supported

### Documentation map

- [AGENTS.md](./AGENTS.md)
- [docs/README.md](./docs/README.md)
- [docs/architecture.md](./docs/architecture.md)
- [docs/extension-runtime.md](./docs/extension-runtime.md)
- [docs/privacy-and-data-flow.md](./docs/privacy-and-data-flow.md)
- [docs/provider-capabilities.md](./docs/provider-capabilities.md)
- [docs/ai-provider-integration.md](./docs/ai-provider-integration.md)
- [docs/local-development.md](./docs/local-development.md)
- [docs/troubleshooting.md](./docs/troubleshooting.md)
- [docs/testing-matrix.md](./docs/testing-matrix.md)
- [tests/README.md](./tests/README.md)

## 한국어

Morph UI는 이제 되돌릴 수 있는 UI 변형을 위한 extension-only Chrome MV3 프로젝트입니다.

실제 DOM을 분석하고, 스키마 검증된 transform plan을 생성한 뒤, 안전한 CSS와 reversible DOM 조작을 적용하며, 재방문 시에는 로컬 캐시를 재사용합니다. Morph UI 백엔드, 제품 계정 시스템, 서버 측 원격 캐시는 더 이상 없습니다.

### 무엇이 바뀌었나

- `apps/server` 제거
- Google 제품 로그인 제거
- provider planning을 extension background에서 직접 실행
- 사용자가 OpenAI 또는 Gemini API key를 로컬에 직접 설정
- transform과 대용량 아티팩트는 IndexedDB와 `chrome.storage`에만 저장

### 가장 빠른 로컬 시작

```bash
pnpm local:setup
pnpm local:dev
```

그 다음:

1. `chrome://extensions` 열기
2. Developer mode 켜기
3. `apps/extension/dist`를 unpacked로 로드
4. `http://localhost:5173/fixtures/article` 열기
5. Morph UI side panel 열기
6. provider API key를 붙여 넣고 `Validate and save` 클릭
7. 사이트 enable 후 preview/apply

### 주요 명령

```bash
pnpm local:setup
pnpm local:dev
pnpm local:verify
pnpm test
pnpm test:e2e
pnpm build
```

### 저장소 구조

- `apps/extension`
  Chrome MV3 확장, side panel UI, background worker, content script
- `apps/web`
  help/privacy 페이지와 deterministic fixture 페이지
- `packages/shared`
  Zod 기반 공용 계약과 타입
- `packages/config`
  URL 정규화, 민감 사이트 규칙, 시드 프로필, 기본 모델
- `packages/cache`
  cache key, similarity scoring, TTL 헬퍼
- `packages/ai`
  브라우저 안전 provider planning, prompt 생성, transform 컴파일
- `packages/ui`
  공용 React UI 프리미티브와 스타일
- `docs`
  bilingual 엔지니어링 문서
- `tests`
  사람이 읽는 smoke note와 evidence

### 보안과 privacy 원칙

- provider API key는 `chrome.storage.local`에만 로컬 저장
- provider key는 sync되지 않음
- 확장은 `https://api.openai.com/*`, `https://generativelanguage.googleapis.com/*`에 대해서만 고정 host permission을 요청
- strict-local 모드는 provider-assisted planning을 차단
- 민감 URL은 기본적으로 provider-assisted planning에서 제외
- ChatGPT Plus, Gemini Advanced 소비자 구독 재사용은 지원하지 않음

### 문서 인덱스

- [AGENTS.md](./AGENTS.md)
- [docs/README.md](./docs/README.md)
- [docs/architecture.md](./docs/architecture.md)
- [docs/extension-runtime.md](./docs/extension-runtime.md)
- [docs/privacy-and-data-flow.md](./docs/privacy-and-data-flow.md)
- [docs/provider-capabilities.md](./docs/provider-capabilities.md)
- [docs/ai-provider-integration.md](./docs/ai-provider-integration.md)
- [docs/local-development.md](./docs/local-development.md)
- [docs/troubleshooting.md](./docs/troubleshooting.md)
- [docs/testing-matrix.md](./docs/testing-matrix.md)
- [tests/README.md](./tests/README.md)
