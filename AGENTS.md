# Morph UI agent instructions

## English

This repository is extension-only.

### Scope

- This file applies to the whole repository unless a deeper `AGENTS.md` exists.
- Deeper `AGENTS.md` files override local decisions for their subtree.

### Core product reality

- there is no Morph UI backend
- there is no product sign-in flow
- provider planning runs directly from the extension background
- provider API keys live only in local extension storage
- local cache is the main persistence path

### Hard rules

- keep Manifest V3 compatibility
- do not add remote hosted executable code, `eval`, or dynamic JS execution
- do not add cookie scraping or hidden consumer-account reuse hacks
- do not sync provider API keys
- keep transforms reversible
- prefer DOM-first and CSS-first strategies
- keep permissions minimal and explainable

### Working order

1. Read this file.
2. Read the nearest scoped `AGENTS.md`.
3. Read the closest implementation docs needed for the task.
4. Inspect code before deciding.
5. Make the narrowest change that fully solves the task.
6. Run relevant verification.
7. Update docs when behavior or operating assumptions change.

### Verification expectations

- docs-only: link and consistency checks
- extension runtime: extension tests and, when relevant, E2E
- shared package changes: package tests or root typecheck
- fixture/help page changes: web build or E2E path when applicable

## 한국어

이 저장소는 extension-only 구조입니다.

### 적용 범위

- 이 파일은 더 깊은 `AGENTS.md`가 없는 한 전체 저장소에 적용됩니다.
- 하위 `AGENTS.md`는 해당 subtree의 로컬 결정에 우선합니다.

### 현재 제품 현실

- Morph UI 백엔드가 없습니다
- 제품 로그인 플로우가 없습니다
- provider planning은 extension background에서 직접 실행됩니다
- provider API key는 로컬 extension storage에만 저장됩니다
- 로컬 캐시가 주 persistence 경로입니다

### 강한 규칙

- Manifest V3 호환성을 유지합니다
- 원격 호스팅 실행 코드, `eval`, 동적 JS 실행을 추가하지 않습니다
- 쿠키 스크래핑이나 숨겨진 소비자 계정 재사용 해킹을 추가하지 않습니다
- provider API key를 sync하지 않습니다
- transform은 되돌릴 수 있어야 합니다
- DOM-first, CSS-first 전략을 우선합니다
- 권한은 최소화하고 설명 가능하게 유지합니다

### 작업 순서

1. 이 파일을 읽습니다.
2. 가장 가까운 scoped `AGENTS.md`를 읽습니다.
3. 필요한 구현 문서를 읽습니다.
4. 코드를 먼저 확인합니다.
5. 문제를 완전히 해결하는 가장 좁은 변경을 합니다.
6. 관련 검증을 실행합니다.
7. 동작이나 운영 가정이 바뀌면 문서를 갱신합니다.

### 검증 기대사항

- docs-only: 링크와 일관성 확인
- extension 런타임: extension 테스트와 필요 시 E2E
- shared package 변경: 패키지 테스트 또는 루트 typecheck
- fixture/help 페이지 변경: 필요 시 web build 또는 E2E 경로
