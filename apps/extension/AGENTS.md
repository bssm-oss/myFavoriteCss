# Extension agent instructions

## English

These instructions apply to `apps/extension`.

### Mission

The extension is the real Morph UI product. It must stay store-review-safe, reversible, privacy-aware, and usable with direct provider calls.

### Runtime boundaries

- `background/`
  orchestration, provider access, cache coordination, permission flow, message routing
- `content/`
  page analysis, fingerprinting, selector recovery, transform apply, undo/reset support
- `sidepanel/`
  primary user workflow and diagnostics
- `popup/`
  quick actions only
- `lib/`
  browser-safe helpers, messaging, storage, permission wrappers
- `tests/`
  extension-local Vitest and Playwright coverage

### Hard rules

- keep Manifest V3 compatibility
- do not add remote code execution
- do not broaden permissions casually
- do not store provider keys anywhere except local extension storage
- do not break links, forms, focus behavior, keyboard navigation, or accessibility
- do not make structural apply irreversible
- do not hide provider or privacy errors behind silent fallbacks

### Permission policy

- keep core extension permissions minimal
- keep provider API host permissions limited to official provider endpoints
- keep page access optional and origin-scoped where possible
- any new host permission must have a concrete runtime reason and matching doc update

### Provider integration policy

- provider requests must originate from the background worker
- provider validation should happen before storing a new key or model
- provider capability copy must reflect implementation reality
- do not add hidden account reuse flows
- do not turn “not supported” into “coming soon” unless the code path truly exists

### Cache and apply policy

- prefer local cache before provider work
- preserve fast revisit behavior
- degrade safely on selector drift
- use conservative CSS-only fallback before giving up when partial drift is acceptable
- if drift is unsafe, abort rather than brute-force apply
- keep undo and reset first-class, not best-effort

### UI policy

- side panel remains the main control surface
- popup must stay intentionally thin
- diagnostics should be helpful but secondary
- privacy language must stay concrete, not vague
- provider setup UI must explain local-only storage and direct validation

### File-by-file guidance

- `manifest.json`
  keep permissions reviewable, host access minimal, and MV3-safe fields explicit
- `background/service-worker.ts`
  coordination and routing only; avoid presentation logic and duplicated schema rules
- `content/page-summary.ts`
  bias toward stable semantic extraction over noisy class-based heuristics
- `content/selector-stability.ts`
  preserve fuzzy re-resolution and avoid brittle nth-child-only selectors
- `content/fingerprint.ts`
  keep fingerprints semantic and versioned
- `content/apply-transform.ts`
  keep operation journaling and rollback logic intact
- `content/mutation-runtime.ts`
  avoid self-trigger loops and runaway observers
- `lib/storage.ts`
  treat key storage, diagnostics, and synced settings as separate concerns
- `sidepanel/App.tsx`
  product workflow first, debug detail second
- `popup/*`
  no feature duplication from the side panel

### When docs must be updated

- provider setup flow changes
- permission prompts or requirements change
- privacy mode behavior changes
- cache status meanings change
- side panel labels or action sequence change

### Verification

- runtime or provider integration changes
  run extension unit tests and typecheck
- browser-visible workflow changes
  run Playwright E2E
- manifest or permission changes
  rebuild the extension and verify the unpacked artifact still loads
- apply-engine changes
  prefer both unit coverage and at least one manual fixture pass

## 한국어

이 지침은 `apps/extension`에 적용됩니다.

### 미션

extension은 실제 Morph UI 제품입니다. 스토어 심사에 안전하고, reversible하며, privacy를 지키고, direct provider call로 계속 usable해야 합니다.

### 런타임 경계

- `background/`
  orchestration, provider 접근, cache 조율, permission 흐름, message routing
- `content/`
  페이지 분석, fingerprinting, selector 복구, transform 적용, undo/reset 지원
- `sidepanel/`
  핵심 사용자 워크플로우와 diagnostics
- `popup/`
  빠른 액션만 제공
- `lib/`
  브라우저 안전 helper, messaging, storage, permission wrapper
- `tests/`
  extension 전용 Vitest와 Playwright 커버리지

### 강한 규칙

- Manifest V3 호환성을 유지합니다
- 원격 코드 실행을 추가하지 않습니다
- 권한을 가볍게 넓히지 않습니다
- provider key는 로컬 extension storage 외 다른 곳에 저장하지 않습니다
- 링크, form, focus 동작, 키보드 내비게이션, 접근성을 깨뜨리지 않습니다
- 구조 apply를 irreversible하게 만들지 않습니다
- provider나 privacy 에러를 조용한 fallback으로 숨기지 않습니다

### Permission 정책

- 핵심 extension permission은 최소 수준으로 유지합니다
- provider API host permission은 공식 provider endpoint로 제한합니다
- 페이지 접근은 가능하면 optional, origin 단위로 유지합니다
- 새 host permission은 구체적 런타임 이유와 문서 업데이트가 함께 있어야 합니다

### Provider integration 정책

- provider 요청은 background worker에서 시작되어야 합니다
- 새 key나 model 저장 전 validation이 먼저 실행되어야 합니다
- provider capability 문구는 실제 구현 상태를 반영해야 합니다
- 숨겨진 계정 재사용 흐름을 추가하지 않습니다
- 실제 코드 경로가 없으면 “지원 예정” 같은 표현으로 흐리지 않습니다

### Cache와 apply 정책

- provider 작업보다 local cache를 우선합니다
- 재방문 시 빠른 적용 경험을 유지합니다
- selector drift에서는 안전하게 degrade합니다
- 부분 drift가 허용되면 먼저 conservative CSS-only fallback을 사용합니다
- drift가 위험하면 brute-force apply 대신 abort합니다
- undo와 reset을 best-effort가 아닌 핵심 동작으로 유지합니다

### UI 정책

- side panel이 주 제어 surface입니다
- popup은 의도적으로 얇아야 합니다
- diagnostics는 유용해야 하지만 주 흐름을 가리지 않아야 합니다
- privacy 문구는 구체적으로 유지합니다
- provider 설정 UI는 local-only storage와 direct validation을 설명해야 합니다

### 파일별 가이드

- `manifest.json`
  권한을 리뷰 가능하게 유지하고, host access를 최소화하며, MV3-safe 필드를 명시적으로 유지
- `background/service-worker.ts`
  coordination과 routing 중심, presentation 로직과 중복 schema 규칙 금지
- `content/page-summary.ts`
  noisy class heuristic보다 안정적인 semantic 추출 우선
- `content/selector-stability.ts`
  fuzzy re-resolution 유지, brittle한 nth-child-only selector 지양
- `content/fingerprint.ts`
  fingerprint는 semantic하고 versioned해야 함
- `content/apply-transform.ts`
  operation journaling과 rollback 로직 유지
- `content/mutation-runtime.ts`
  self-trigger loop와 runaway observer 방지
- `lib/storage.ts`
  key storage, diagnostics, synced settings를 서로 다른 concern으로 관리
- `sidepanel/App.tsx`
  product workflow 우선, debug detail은 그 다음
- `popup/*`
  side panel 기능 중복 금지

### 문서를 반드시 갱신해야 하는 경우

- provider 설정 흐름이 바뀔 때
- permission prompt나 요구사항이 바뀔 때
- privacy mode 동작이 바뀔 때
- cache status 의미가 바뀔 때
- side panel 라벨이나 액션 순서가 바뀔 때

### 검증

- 런타임 또는 provider integration 변경
  extension unit test와 typecheck 실행
- 브라우저 가시 워크플로우 변경
  Playwright E2E 실행
- manifest 또는 permission 변경
  extension을 다시 빌드하고 unpacked artifact가 실제로 로드되는지 확인
- apply-engine 변경
  unit coverage와 최소 한 번의 manual fixture pass를 함께 선호
