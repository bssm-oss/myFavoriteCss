# Web app agent instructions

## English

These instructions apply to `apps/web`.

### Mission

The web app exists to serve trustworthy help/privacy content and deterministic local fixture pages. It is not a second product runtime.

### Hard rules

- keep fixture pages deterministic
- keep help/privacy pages aligned with real extension behavior
- do not duplicate extension runtime logic here
- do not use fixture pages as a dumping ground for experiments
- do not make fixture markup unstable without updating tests and docs

### Route responsibilities

- `src/routes/help/*`
  user-facing explanation of setup and operating behavior
- `src/routes/privacy/*`
  user-facing disclosure of local storage, provider calls, and privacy modes
- `src/routes/fixtures/*`
  controlled, repeatable page structures for browser tests and manual runs

### Fixture design policy

- fixtures should resemble real page families
- fixtures should stay visually rich enough to exercise Morph UI behavior
- fixtures should stay structurally stable enough for repeatable E2E checks
- if you change headings, major blocks, or forms, assume smoke docs may also need updates

### Copy policy

- avoid marketing language
- prefer explicit statements about extension-only mode
- keep provider wording honest
- keep privacy wording exact

### Verification

- fixture changes
  run the relevant E2E path when possible
- help/privacy copy changes
  at minimum run the web build
- if fixture structure changes materially
  update testing docs or smoke notes in the same change

## 한국어

이 지침은 `apps/web`에 적용됩니다.

### 미션

웹앱은 신뢰할 수 있는 help/privacy 콘텐츠와 deterministic 로컬 fixture 페이지를 제공하기 위한 것입니다. 두 번째 제품 런타임이 아닙니다.

### 강한 규칙

- fixture 페이지는 deterministic하게 유지합니다
- help/privacy 페이지는 실제 extension 동작과 일치해야 합니다
- extension 런타임 로직을 여기서 중복 구현하지 않습니다
- fixture 페이지를 실험 코드 보관소처럼 쓰지 않습니다
- fixture 마크업을 크게 바꾸면 테스트와 문서도 같이 갱신합니다

### 라우트별 책임

- `src/routes/help/*`
  설정과 운영 동작을 사용자에게 설명
- `src/routes/privacy/*`
  로컬 저장, provider 호출, privacy mode를 사용자에게 정확히 공개
- `src/routes/fixtures/*`
  브라우저 테스트와 수동 실행을 위한 통제된 반복 가능 페이지 구조

### Fixture 설계 정책

- fixture는 실제 페이지 계열과 닮아야 합니다
- Morph UI 동작을 충분히 시험할 수 있을 만큼 시각적으로 풍부해야 합니다
- 반복 가능한 E2E 확인이 가능할 만큼 구조적으로 안정적이어야 합니다
- heading, 주요 block, form을 바꾸면 smoke 문서도 같이 바뀐다고 가정합니다

### 카피 정책

- 마케팅 문구를 피합니다
- extension-only 구조를 명시적으로 설명합니다
- provider 관련 문구는 정직하게 유지합니다
- privacy 문구는 정확하게 유지합니다

### 검증

- fixture 변경
  가능하면 관련 E2E 경로 실행
- help/privacy 카피 변경
  최소한 web build 실행
- fixture 구조가 크게 바뀐 경우
  testing 문서나 smoke note도 같은 변경 안에서 같이 갱신
