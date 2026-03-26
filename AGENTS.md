# Morph UI agent instructions

## English

This repository is an extension-only Morph UI workspace. Treat these instructions as the default policy for the whole repo unless a deeper `AGENTS.md` overrides them for a subtree.

### Repository reality

- there is no Morph UI backend service
- there is no product account system
- there is no remote sync cache
- provider planning runs directly from the extension background worker
- provider API keys live only in local extension storage
- IndexedDB plus `chrome.storage` are the main persistence layers
- the web app exists only for hosted help/privacy content and deterministic local fixtures

### Scope rules

- this file applies to the entire repository by default
- a deeper `AGENTS.md` wins for its own subtree
- when two instructions seem to conflict, prefer the more specific file
- if a subtree has no `AGENTS.md`, inherit the closest parent file

### Primary goals

- keep the extension usable with real OpenAI and Gemini API keys
- keep the product Chrome Web Store review friendly
- keep all transforms reversible
- keep privacy claims accurate
- keep local-cache-first behavior intact
- keep documentation aligned with implementation

### Non-negotiable constraints

- keep Manifest V3 compatibility
- do not add a backend dependency back into the critical path
- do not add remote hosted executable code
- do not add `eval`, `new Function`, or fetched script execution
- do not add cookie scraping, session stealing, or hidden consumer-account reuse hacks
- do not sync provider API keys
- do not move provider keys into docs examples, fixture pages, tests, or shared packages
- do not claim support for ChatGPT Plus reuse, Gemini Advanced reuse, or official consumer OAuth unless it is truly implemented
- do not weaken reversible apply behavior to get a faster visual result

### Working order

1. Read this file.
2. Read the nearest scoped `AGENTS.md`.
3. Read the implementation docs most relevant to the task.
4. Inspect the existing code before deciding.
5. Make the smallest change that fully solves the actual problem.
6. Run the narrowest meaningful verification.
7. Update docs when behavior, setup, or operator expectations change.

### Architecture map

- `apps/extension`
  the real product runtime
- `apps/web`
  help/privacy pages and local fixtures only
- `packages/shared`
  Zod schemas, cross-runtime types, typed contracts
- `packages/config`
  heuristics, seeded defaults, URL normalization rules, sensitive-site logic
- `packages/cache`
  cache keys, similarity scoring, TTL helpers
- `packages/ai`
  provider abstraction, prompt building, config validation, transform compilation
- `packages/ui`
  shared React UI primitives and extension/web styling building blocks
- `docs`
  bilingual operating documentation
- `tests`
  human-readable verification assets, not colocated unit test source

### Change policy

- prefer DOM-first and CSS-first solutions
- prefer schema changes before ad-hoc shape drift
- prefer strict validation before permissive fallback logic
- prefer local extension state over introducing new external dependencies
- prefer new scoped documentation when behavior becomes more operationally complex
- do not use “temporary” architecture shortcuts that contradict extension-only mode

### Privacy and security policy

- any change touching provider calls must keep the request path direct from the extension
- any change touching provider config must keep raw keys in `chrome.storage.local` only
- any change touching screenshots must respect privacy mode and sensitive URL checks
- any change touching permissions must stay minimal and explainable in review
- any change touching transforms must preserve links, forms, focus handling, and keyboard navigation

### Verification expectations

- docs-only changes
  verify links, consistency, and scoped doc coverage
- shared package changes
  run package tests or root typecheck
- extension runtime changes
  run extension tests and, when browser-visible behavior changes, E2E
- fixture/help page changes
  run web build or the E2E path if fixtures affect tests
- provider integration changes
  run typecheck, unit tests, and the most relevant E2E path

### Documentation update triggers

Update docs when any of these change:

- setup steps
- provider configuration flow
- privacy behavior
- permissions
- cache behavior
- manual verification flow
- troubleshooting steps
- exported contracts that developers rely on

### Review checklist

- is the change still extension-only?
- is the provider story still honest?
- are secrets still local-only?
- does the user-visible workflow still match the docs?
- is the nearest `AGENTS.md` still accurate after the change?

## 한국어

이 저장소는 extension-only Morph UI 작업공간입니다. 더 깊은 `AGENTS.md`가 없는 한 이 파일을 저장소 기본 정책으로 취급합니다.

### 저장소의 현재 현실

- Morph UI 백엔드 서비스가 없습니다
- 제품 계정 시스템이 없습니다
- 원격 sync cache가 없습니다
- provider planning은 extension background worker에서 직접 실행됩니다
- provider API key는 로컬 extension storage에만 저장됩니다
- IndexedDB와 `chrome.storage`가 핵심 persistence 계층입니다
- 웹앱은 help/privacy 페이지와 deterministic 로컬 fixture 용도만 가집니다

### 적용 범위 규칙

- 기본적으로 이 파일은 전체 저장소에 적용됩니다
- 더 깊은 `AGENTS.md`가 있으면 그 subtree에서는 그 파일이 우선합니다
- 지침이 충돌해 보이면 더 구체적인 파일을 우선합니다
- subtree에 `AGENTS.md`가 없으면 가장 가까운 부모 지침을 상속합니다

### 핵심 목표

- 실제 OpenAI, Gemini API key로 extension이 계속 usable한 상태 유지
- Chrome Web Store review에 안전한 제품 상태 유지
- 모든 transform의 reversible 특성 유지
- privacy 관련 설명을 실제 구현과 맞게 유지
- local-cache-first 동작 유지
- 문서와 구현의 정합성 유지

### 절대 깨면 안 되는 제약

- Manifest V3 호환성을 유지합니다
- 핵심 경로에 백엔드 의존성을 다시 넣지 않습니다
- 원격 호스팅 실행 코드를 추가하지 않습니다
- `eval`, `new Function`, fetch한 스크립트 실행을 추가하지 않습니다
- 쿠키 스크래핑, 세션 탈취, 숨겨진 소비자 계정 재사용 해킹을 추가하지 않습니다
- provider API key를 sync하지 않습니다
- provider key를 문서 예제, fixture, 테스트, shared package 안으로 옮기지 않습니다
- ChatGPT Plus 재사용, Gemini Advanced 재사용, 공식 consumer OAuth를 실제 구현 없이 지원하는 것처럼 쓰지 않습니다
- 더 빠른 시각 효과를 위해 reversible apply를 약화시키지 않습니다

### 기본 작업 순서

1. 이 파일을 읽습니다.
2. 가장 가까운 scoped `AGENTS.md`를 읽습니다.
3. 작업에 필요한 구현 문서를 읽습니다.
4. 기존 코드를 먼저 확인합니다.
5. 실제 문제를 완전히 해결하는 가장 작은 변경을 합니다.
6. 의미 있는 가장 좁은 검증을 실행합니다.
7. 동작, 설정, 운영 기대가 바뀌면 문서를 갱신합니다.

### 아키텍처 지도

- `apps/extension`
  실제 제품 런타임
- `apps/web`
  help/privacy 페이지와 로컬 fixture 전용
- `packages/shared`
  Zod schema, cross-runtime type, typed contract
- `packages/config`
  heuristic, seeded default, URL 정규화 규칙, 민감 사이트 로직
- `packages/cache`
  cache key, similarity scoring, TTL helper
- `packages/ai`
  provider 추상화, prompt 생성, config 검증, transform 컴파일
- `packages/ui`
  shared React UI primitive와 스타일 빌딩 블록
- `docs`
  bilingual 운영 문서
- `tests`
  사람이 읽는 검증 자산, colocated unit test 소스 아님

### 변경 정책

- DOM-first, CSS-first 해법을 우선합니다
- ad-hoc shape drift보다 schema 정리를 우선합니다
- 느슨한 fallback보다 strict validation을 우선합니다
- 새 외부 의존성 도입보다 로컬 extension state 활용을 우선합니다
- 운영 복잡도가 커지면 scoped 문서를 새로 추가하는 편을 우선합니다
- extension-only 원칙을 깨는 “임시” 아키텍처 지름길을 만들지 않습니다

### Privacy와 보안 정책

- provider 호출을 건드리는 변경은 extension에서 직접 호출하는 경로를 유지해야 합니다
- provider 설정을 건드리는 변경은 raw key가 `chrome.storage.local`에만 있게 유지해야 합니다
- screenshot 관련 변경은 privacy mode와 민감 URL 차단을 지켜야 합니다
- permission 관련 변경은 최소 권한 원칙과 리뷰 가능성을 유지해야 합니다
- transform 관련 변경은 링크, form, focus 처리, 키보드 내비게이션을 보존해야 합니다

### 검증 기대사항

- docs-only 변경
  링크, 일관성, scoped 문서 범위 확인
- shared package 변경
  패키지 테스트 또는 루트 typecheck 실행
- extension 런타임 변경
  extension 테스트 실행, 브라우저 가시 동작이 바뀌면 E2E 실행
- fixture/help 페이지 변경
  fixture가 테스트에 영향 주면 web build 또는 E2E 실행
- provider integration 변경
  typecheck, unit test, 관련 E2E 경로 실행

### 문서 업데이트 트리거

다음이 바뀌면 문서도 같이 갱신합니다.

- setup 절차
- provider 설정 흐름
- privacy 동작
- permission
- cache 동작
- 수동 verification 흐름
- troubleshooting 절차
- 개발자가 의존하는 export contract

### 리뷰 체크리스트

- 이 변경이 여전히 extension-only 구조인가
- provider 설명이 여전히 정직한가
- secret이 계속 local-only인가
- 사용자 워크플로우와 문서가 여전히 일치하는가
- 가장 가까운 `AGENTS.md`도 함께 맞게 갱신되었는가
