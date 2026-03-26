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
- local provider configuration handling
- optional host permission management
- content script registration
- local cache lookup and save orchestration
- provider-assisted preview, apply, undo, and reset routing

### Content script responsibilities

- page analysis
- `PageSummary` extraction
- fingerprint generation
- compiled transform apply
- undo/reset journal
- SPA route observation

## 한국어

Morph UI는 side panel 중심 workflow를 기준으로 만든 Manifest V3 확장입니다.

### 런타임 surface

- background service worker
- side panel
- popup
- 동적으로 등록되는 content script

### Background 책임

- side panel 동작 설정
- 로컬 provider 설정 처리
- optional host permission 관리
- content script 등록
- 로컬 캐시 조회/저장 orchestration
- provider-assisted preview/apply/undo/reset 라우팅

### Content script 책임

- 페이지 분석
- `PageSummary` 추출
- fingerprint 생성
- compiled transform 적용
- undo/reset용 journal 관리
- SPA route 관찰
