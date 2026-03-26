# Local development

## English

Morph UI local development no longer requires Postgres or a backend service.

### Preconditions

- Chrome or Chromium with Developer mode enabled
- `pnpm` available locally
- an OpenAI or Gemini API key you are willing to store only on your machine
- no backend credentials are required

### Setup

```bash
pnpm local:setup
pnpm local:dev
```

### What runs

- fixture/help web app on `http://localhost:5173`
- extension build output in `apps/extension/dist`
- extension watcher that rebuilds on source changes

### Manual usage

1. Load `apps/extension/dist` in Chrome
2. Visit a fixture page
3. Open the side panel
4. Paste a provider API key and click `Validate and save`
5. Enable the site
6. Preview and apply

### Recommended local loop

1. Keep `pnpm local:dev` running in one terminal.
2. Edit the extension or docs.
3. Reload the unpacked extension in `chrome://extensions`.
4. Refresh the fixture page.
5. Repeat `Preview`, `Apply`, `Undo`, and revisit checks.

### When to use fixtures

- `fixtures/article`
  best first pass for reader-style transforms
- `fixtures/docs`
  good for content width, TOC, and sticky navigation checks
- `fixtures/form`
  good for confirming Morph UI does not break form structure
- `fixtures/dashboard`
  useful for denser spacing and chrome simplification checks

### Verification

```bash
pnpm local:verify
```

`pnpm local:verify` should be your default pre-PR check even for mostly doc-driven changes when you touched extension runtime or shared contracts.

## 한국어

Morph UI 로컬 개발은 이제 Postgres나 백엔드 서비스가 필요하지 않습니다.

### 사전 조건

- Developer mode가 켜진 Chrome 또는 Chromium
- 로컬에서 사용 가능한 `pnpm`
- 내 컴퓨터에만 저장할 OpenAI 또는 Gemini API key
- 백엔드 credential은 필요하지 않음

### 설정

```bash
pnpm local:setup
pnpm local:dev
```

### 실행되는 것

- `http://localhost:5173` 의 fixture/help 웹앱
- `apps/extension/dist` 의 extension 빌드 출력
- 소스 변경 시 자동 재빌드하는 extension watcher

### 수동 사용 순서

1. Chrome에 `apps/extension/dist` 로드
2. fixture 페이지 방문
3. side panel 열기
4. provider API key를 붙여 넣고 `Validate and save` 클릭
5. 사이트 enable
6. preview 및 apply

### 권장 로컬 반복 루프

1. 한 터미널에서 `pnpm local:dev`를 계속 실행합니다.
2. extension 또는 docs를 수정합니다.
3. `chrome://extensions`에서 unpacked extension을 다시 로드합니다.
4. fixture 페이지를 새로고침합니다.
5. `Preview`, `Apply`, `Undo`, 재방문 체크를 반복합니다.

### fixture를 언제 쓰면 좋은가

- `fixtures/article`
  reader 스타일 변형의 첫 검증에 가장 적합
- `fixtures/docs`
  content width, TOC, sticky navigation 확인에 적합
- `fixtures/form`
  form 구조를 깨뜨리지 않는지 확인하는 데 적합
- `fixtures/dashboard`
  더 촘촘한 spacing과 chrome 단순화 확인에 유용

### 검증

```bash
pnpm local:verify
```

extension runtime이나 shared contract를 건드렸다면 문서 변경이 중심이어도 PR 전에 `pnpm local:verify`를 기본 검증으로 보는 것이 좋습니다.
