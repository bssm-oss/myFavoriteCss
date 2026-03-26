# Local smoke run - 2026-03-26

## English

This file records a real local smoke pass executed against the repository.

### Environment

- date: `2026-03-26`
- fixture host: `http://127.0.0.1:4173`
- tools: Playwright CLI and extension E2E harness

### Commands executed

```bash
pnpm --filter @morph-ui/web exec vite --host 127.0.0.1 --port 4173
pnpm test:e2e
```

### Verified extension baseline

- `pnpm test:e2e` passed
- current spec: `apps/extension/tests/e2e.spec.ts`
- covered: fixture site load plus extension runtime boot

### Verified article fixture

- URL: `http://127.0.0.1:4173/fixtures/article`
- observed `h1`: `Designing calmer reading experiences on dense news pages`
- observed `h2, h3` count: `3`
- console note: only `/favicon.ico` 404 observed

Artifacts:

- `output/playwright/2026-03-26/article-fixture.png`
- `output/playwright/2026-03-26/article-fixture-snapshot.yml`
- `output/playwright/2026-03-26/article-fixture-console.log`

### Verified form fixture

- URL: `http://127.0.0.1:4173/fixtures/form`
- observed `h1`: `Checkout`
- observed `document.forms.length`: `1`
- observed form control count: `3`
- console note: only `/favicon.ico` 404 observed

Artifacts:

- `output/playwright/2026-03-26/form-fixture.png`
- `output/playwright/2026-03-26/form-fixture-snapshot.yml`
- `output/playwright/2026-03-26/form-fixture-console.log`

## 한국어

이 파일은 저장소에 대해 실제로 수행한 로컬 스모크 실행 기록입니다.

### 환경

- 날짜: `2026-03-26`
- fixture 호스트: `http://127.0.0.1:4173`
- 사용 도구: Playwright CLI와 extension E2E harness

### 실행한 명령

```bash
pnpm --filter @morph-ui/web exec vite --host 127.0.0.1 --port 4173
pnpm test:e2e
```

### 확인한 extension baseline

- `pnpm test:e2e` 통과
- 현재 spec: `apps/extension/tests/e2e.spec.ts`
- 검증 범위: fixture 사이트 로드와 extension runtime 부팅

### 확인한 article fixture

- URL: `http://127.0.0.1:4173/fixtures/article`
- 관측한 `h1`: `Designing calmer reading experiences on dense news pages`
- 관측한 `h2, h3` 개수: `3`
- 콘솔 메모: `/favicon.ico` 404만 관측

아티팩트:

- `output/playwright/2026-03-26/article-fixture.png`
- `output/playwright/2026-03-26/article-fixture-snapshot.yml`
- `output/playwright/2026-03-26/article-fixture-console.log`

### 확인한 form fixture

- URL: `http://127.0.0.1:4173/fixtures/form`
- 관측한 `h1`: `Checkout`
- 관측한 `document.forms.length`: `1`
- 관측한 form control 개수: `3`
- 콘솔 메모: `/favicon.ico` 404만 관측

아티팩트:

- `output/playwright/2026-03-26/form-fixture.png`
- `output/playwright/2026-03-26/form-fixture-snapshot.yml`
- `output/playwright/2026-03-26/form-fixture-console.log`
