# Background worker agent instructions

## English

These instructions apply to `apps/extension/background`.

- keep this area focused on orchestration, not rendering
- provider calls originate here
- permission prompts and content-script registration decisions originate here
- cache lookup, preview/apply routing, and diagnostics coordination belong here
- do not duplicate schema logic that already exists in shared packages
- do not move DOM-specific logic here unless it is truly tab-routing glue
- when changing message handling, check both side panel callers and content-script receivers
- when changing provider save flow, preserve validation-before-store behavior
- when changing cache flow, preserve exact-hit fast path and safe degraded fallback

## 한국어

이 지침은 `apps/extension/background`에 적용됩니다.

- 이 영역은 렌더링이 아니라 orchestration에 집중합니다
- provider 호출은 여기서 시작됩니다
- permission prompt와 content-script 등록 결정은 여기서 시작됩니다
- cache lookup, preview/apply 라우팅, diagnostics 조율이 여기 책임입니다
- shared package에 이미 있는 schema 로직을 여기서 중복하지 않습니다
- 진짜 tab-routing glue가 아니라면 DOM 전용 로직을 여기로 옮기지 않습니다
- message handling을 바꾸면 side panel caller와 content-script receiver를 함께 확인합니다
- provider 저장 흐름을 바꾸면 validation-before-store 동작을 유지합니다
- cache 흐름을 바꾸면 exact-hit fast path와 안전한 degraded fallback을 유지합니다
