# Web app agent instructions

## English

These instructions apply to `apps/web`.

### Core responsibility

The web app serves two roles:

- user-facing help/privacy content
- deterministic local fixtures for manual and automated testing

### Hard rules

- keep fixture pages deterministic
- avoid leaking experimental logic into fixture pages
- do not duplicate server business logic here
- help/privacy pages must match the actual product behavior

### Fixture expectations

- fixtures should exercise realistic structures such as article, docs, dashboard, commerce, and form-heavy pages
- fixture markup should remain stable enough for E2E and smoke evidence
- if fixture structure changes materially, update test docs and evidence expectations

### Verification

- run the relevant web build or E2E path when changing fixtures or docs pages that tests rely on

## 한국어

이 지침은 `apps/web`에 적용됩니다.

### 핵심 책임

웹앱은 두 가지 역할을 가집니다.

- 사용자용 help/privacy 콘텐츠
- 수동/자동 테스트용 deterministic 로컬 fixture

### 강한 규칙

- fixture 페이지는 deterministic하게 유지합니다.
- 실험용 로직을 fixture 안에 섞지 않습니다.
- 서버 비즈니스 로직을 여기서 중복 구현하지 않습니다.
- help/privacy 페이지는 실제 제품 동작과 일치해야 합니다.

### Fixture 기대사항

- fixture는 article, docs, dashboard, commerce, form-heavy 같은 현실적 구조를 보여야 합니다.
- fixture 마크업은 E2E와 smoke evidence가 가능할 정도로 안정적이어야 합니다.
- fixture 구조가 크게 바뀌면 테스트 문서와 evidence 기대치도 갱신합니다.

### 검증

- fixture나 테스트가 의존하는 docs 페이지가 바뀌면 관련 web build 또는 E2E 경로를 실행합니다.
