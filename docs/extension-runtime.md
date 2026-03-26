# Extension runtime

## English

Morph UI is a Manifest V3 extension built around a side panel-first workflow.

### Runtime surfaces

- background service worker
- side panel
- popup
- dynamically registered content script

### Background responsibilities

- side panel behavior setup
- auth flow kickoff and refresh
- optional host permission management
- content script registration
- cache lookup and save orchestration
- preview, apply, undo, and reset routing

### Content script responsibilities

- page analysis
- `PageSummary` extraction
- fingerprint generation
- compiled transform apply
- undo/reset journal
- SPA route observation

### Safety rules

- allowlisted CSS only
- validated plan before apply
- mismatch rate can abort structural apply
- sensitive form regions are guarded

## 한국어

Morph UI는 사이드패널 중심 workflow를 기준으로 만든 Manifest V3 확장입니다.

### 런타임 surface

- background service worker
- side panel
- popup
- 동적으로 등록되는 content script

### Background 책임

- side panel 동작 설정
- 인증 시작과 refresh
- optional host permission 관리
- content script 등록
- 캐시 조회/저장 오케스트레이션
- preview/apply/undo/reset 라우팅

### Content script 책임

- 페이지 분석
- `PageSummary` 추출
- fingerprint 생성
- compiled transform 적용
- undo/reset용 journal 관리
- SPA route 관찰

### 안전 규칙

- allowlist 기반 CSS만 적용
- apply 전 plan 검증
- mismatch rate가 높으면 구조적 적용 중단
- 민감한 form 영역 보호
