# Morph UI architecture

## English

Morph UI separates page execution, extension orchestration, and server-owned provider logic.

### Main goals

- reversible UI transformation
- fast cache-hit revisits
- clear privacy boundaries
- honest provider capability reporting

### Monorepo responsibilities

- `apps/extension`
  MV3 extension, side panel, background worker, content scripts
- `apps/server`
  Fastify API, auth, provider orchestration, remote cache, feedback
- `apps/web`
  help pages, privacy pages, local fixtures
- `packages/shared`
  shared Zod contracts
- `packages/config`
  normalization rules and seeded defaults
- `packages/cache`
  cache matching and TTL helpers
- `packages/ai`
  provider abstraction and transform compilation
- `packages/ui`
  shared UI primitives

### Runtime flow

1. User enables a site from the side panel
2. Extension requests optional host permission
3. Content script analyzes the page
4. Background checks local cache
5. Remote cache is checked if local cache misses and privacy allows it
6. Server-assisted provider planning happens only when needed
7. The server validates and compiles the plan
8. The extension previews or applies it
9. Accepted artifacts are persisted locally and optionally remotely

### Design principles

- prefer CSS over DOM mutation
- prefer wrappers over destructive edits
- validate provider output before apply
- keep provider secrets server-side
- treat logging as non-blocking, not part of the success path

## 한국어

Morph UI는 페이지 실행, 확장 오케스트레이션, 서버 소유 provider 로직을 분리해서 설계했습니다.

### 주요 목표

- 되돌릴 수 있는 UI 변환
- 빠른 캐시 재방문
- 명확한 privacy 경계
- 정직한 provider capability 표시

### 모노레포 책임 분리

- `apps/extension`
  MV3 확장, 사이드패널, 백그라운드 워커, 콘텐츠 스크립트
- `apps/server`
  Fastify API, 인증, provider 오케스트레이션, 원격 캐시, 피드백
- `apps/web`
  도움말/프라이버시 페이지와 로컬 fixture
- `packages/shared`
  공용 Zod 계약
- `packages/config`
  정규화 규칙과 시드 기본값
- `packages/cache`
  캐시 매칭과 TTL 헬퍼
- `packages/ai`
  provider 추상화와 transform 컴파일
- `packages/ui`
  공용 UI 프리미티브

### 런타임 흐름

1. 사용자가 사이드패널에서 사이트를 enable
2. 확장이 optional host permission 요청
3. 콘텐츠 스크립트가 페이지 분석
4. 백그라운드가 로컬 캐시 조회
5. 로컬 미스이고 privacy가 허용하면 원격 캐시 조회
6. 필요할 때만 서버 보조 provider planning 실행
7. 서버가 plan을 검증하고 컴파일
8. 확장이 preview 또는 apply
9. 승인된 아티팩트는 로컬과 선택적 원격 저장소에 저장

### 설계 원칙

- DOM 변경보다 CSS를 우선
- 파괴적 편집보다 wrapper를 우선
- apply 전에 provider 출력을 검증
- provider 비밀키는 서버에만 유지
- 로깅은 성공 경로의 필수 요소가 아니어야 함
