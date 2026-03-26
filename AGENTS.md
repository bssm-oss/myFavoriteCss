# Morph UI agent instructions

## English

This file is the root operating manual for coding agents working in this repository.

### Scope and precedence

- This file applies to the entire repository unless a deeper `AGENTS.md` exists.
- When working inside a subdirectory that contains its own `AGENTS.md`, follow both files, with the deeper file taking precedence for local decisions.

### Repository mission

Morph UI is a production-oriented system for reversible UI adaptation:

- `apps/extension` contains the Chrome MV3 product surface.
- `apps/server` contains auth, provider orchestration, remote cache, and feedback APIs.
- `apps/web` contains help/privacy pages and deterministic fixtures.
- `packages/*` contain shared contracts and runtime helpers.
- `docs/` contains bilingual engineering documentation.
- `tests/` contains human-readable smoke notes and verification assets.

### Non-negotiable product constraints

- Keep all provider secrets on the server.
- Do not add cookie scraping, hidden browser session reuse, or undocumented auth hacks.
- Do not add remote hosted executable code, `eval`, or dynamic JS execution.
- Preserve reversibility for applied transforms.
- Prefer DOM-first and CSS-first approaches over screenshots.
- Keep extension permissions minimal and explainable.

### Standard working order

1. Read this file.
2. Read the nearest scoped `AGENTS.md`.
3. Read the closest implementation docs needed for the task.
4. Inspect the code before deciding.
5. Make the narrowest change that fully solves the task.
6. Run the most relevant verification.
7. Update docs if behavior, architecture, or operating assumptions changed.

### Required reference documents

Start here when the task touches these areas:

- architecture: `docs/architecture.md`
- extension runtime: `docs/extension-runtime.md`
- transform contract: `docs/transform-plan-spec.md`
- privacy/data flow: `docs/privacy-and-data-flow.md`
- env/config: `docs/environment-variables.md`
- release work: `docs/release-playbook.md`
- debugging: `docs/diagnostics-and-observability.md`

### Change discipline

- Prefer small commits with one clear purpose each.
- Avoid drive-by refactors unless they are required to complete the task safely.
- Use `pnpm`.
- Keep naming explicit and production-oriented.
- Preserve existing typed contracts unless the task explicitly changes them.

### Verification expectations

Use the narrowest meaningful verification, but do not skip verification entirely.

- docs-only change: link/structure checks, markdown consistency checks
- script change: syntax check plus targeted invocation
- package logic change: package tests or typecheck
- extension runtime change: extension tests and, when relevant, E2E
- server/API change: server tests and relevant integration coverage

### Documentation expectations

- Root guides and `docs/` files should remain bilingual with `## English` and `## 한국어` sections.
- If a change affects user workflow, update `docs/user-workflow-guide.md` or the nearest equivalent.
- If a change affects env/config, update `docs/environment-variables.md`.
- If a change affects ops/release/debugging, update the matching runbook or playbook.

### Git expectations

- Work from a branch, not directly on `main`, unless explicitly instructed otherwise.
- Keep commits small and descriptive.
- Do not rewrite history that the user may be relying on.
- Do not use destructive git commands unless explicitly approved.

## 한국어

이 파일은 이 저장소에서 작업하는 코딩 에이전트를 위한 루트 운영 매뉴얼입니다.

### 적용 범위와 우선순위

- 이 파일은 전체 저장소에 적용됩니다. 단, 더 깊은 경로에 별도 `AGENTS.md`가 있으면 함께 따릅니다.
- 하위 디렉터리의 `AGENTS.md`는 해당 영역의 로컬 결정에 대해 더 높은 우선순위를 가집니다.

### 저장소 목적

Morph UI는 되돌릴 수 있는 UI 변형을 제공하는 프로덕션 지향 시스템입니다.

- `apps/extension` 은 Chrome MV3 제품 surface입니다.
- `apps/server` 는 인증, provider orchestration, 원격 캐시, feedback API를 담습니다.
- `apps/web` 는 help/privacy 페이지와 deterministic fixture를 담습니다.
- `packages/*` 는 공용 계약과 런타임 헬퍼를 담습니다.
- `docs/` 는 bilingual 엔지니어링 문서를 담습니다.
- `tests/` 는 사람이 읽는 smoke note와 검증 자산을 담습니다.

### 절대 어기면 안 되는 제품 제약

- 모든 provider secret은 서버에만 둡니다.
- 쿠키 스크래핑, 숨겨진 브라우저 세션 재사용, 비공식 인증 해킹을 추가하지 않습니다.
- 원격 호스팅 실행 코드, `eval`, 동적 JS 실행을 추가하지 않습니다.
- 적용된 transform은 되돌릴 수 있어야 합니다.
- screenshot보다 DOM-first, CSS-first를 우선합니다.
- extension 권한은 최소화하고 설명 가능해야 합니다.

### 기본 작업 순서

1. 이 파일을 읽습니다.
2. 가장 가까운 scoped `AGENTS.md`를 읽습니다.
3. 작업에 필요한 구현 문서를 읽습니다.
4. 코드를 먼저 확인합니다.
5. 문제를 완전히 해결하는 가장 좁은 변경을 합니다.
6. 가장 관련 있는 검증을 실행합니다.
7. 동작, 아키텍처, 운영 가정이 바뀌면 문서를 갱신합니다.

### 꼭 봐야 하는 기준 문서

영역별 시작 문서는 다음과 같습니다.

- 아키텍처: `docs/architecture.md`
- extension 런타임: `docs/extension-runtime.md`
- transform 계약: `docs/transform-plan-spec.md`
- privacy/data flow: `docs/privacy-and-data-flow.md`
- env/config: `docs/environment-variables.md`
- release 작업: `docs/release-playbook.md`
- 디버깅: `docs/diagnostics-and-observability.md`

### 변경 원칙

- 커밋은 작고 목적이 하나여야 합니다.
- 안전한 완료에 필요하지 않다면 옆길 리팩터링을 하지 않습니다.
- 패키지 매니저는 `pnpm`을 사용합니다.
- 이름은 명시적이고 프로덕션 지향적으로 유지합니다.
- 작업이 계약 변경을 요구하지 않는다면 기존 typed contract를 보존합니다.

### 검증 기대사항

가장 좁지만 의미 있는 검증을 사용하되, 검증을 건너뛰지는 않습니다.

- docs-only 변경: 링크/구조 확인, markdown 일관성 확인
- 스크립트 변경: 문법 검사와 대상 명령 실행
- 패키지 로직 변경: 해당 패키지 테스트 또는 typecheck
- extension 런타임 변경: extension 테스트와 필요 시 E2E
- server/API 변경: 서버 테스트와 관련 integration 검증

### 문서 기대사항

- 루트 가이드와 `docs/` 파일은 `## English`, `## 한국어` 섹션을 유지합니다.
- 사용자 흐름에 영향이 있으면 `docs/user-workflow-guide.md` 또는 가장 가까운 문서를 갱신합니다.
- env/config가 바뀌면 `docs/environment-variables.md`를 갱신합니다.
- 운영/release/debugging이 바뀌면 관련 runbook이나 playbook을 갱신합니다.

### Git 원칙

- 특별한 지시가 없으면 `main`이 아니라 브랜치에서 작업합니다.
- 커밋은 작고 설명적으로 유지합니다.
- 사용자가 의존할 수 있는 히스토리를 임의로 다시 쓰지 않습니다.
- 파괴적 git 명령은 명시적 승인 없이는 사용하지 않습니다.
