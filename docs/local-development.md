# Local development

## English

Morph UI local development no longer requires Postgres or a backend service.

### Setup

```bash
pnpm local:setup
pnpm local:dev
```

### What runs

- fixture/help web app on `http://localhost:5173`
- extension build output in `apps/extension/dist`

### Manual usage

1. Load `apps/extension/dist` in Chrome
2. Visit a fixture page
3. Open the side panel
4. Paste a provider API key and click `Validate and save`
5. Enable the site
6. Preview and apply

### Verification

```bash
pnpm local:verify
```

## 한국어

Morph UI 로컬 개발은 이제 Postgres나 백엔드 서비스가 필요하지 않습니다.

### 설정

```bash
pnpm local:setup
pnpm local:dev
```

### 실행되는 것

- `http://localhost:5173` 의 fixture/help 웹앱
- `apps/extension/dist` 의 extension 빌드 출력

### 수동 사용 순서

1. Chrome에 `apps/extension/dist` 로드
2. fixture 페이지 방문
3. side panel 열기
4. provider API key를 붙여 넣고 `Validate and save` 클릭
5. 사이트 enable
6. preview 및 apply

### 검증

```bash
pnpm local:verify
```
