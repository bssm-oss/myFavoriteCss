# Side panel agent instructions

## English

These instructions apply to `apps/extension/sidepanel`.

- this is the primary Morph UI workflow surface
- provider setup, privacy controls, preview/apply, cache status, and diagnostics live here
- keep labels aligned with docs and runtime behavior
- keep the happy path obvious before exposing debug detail
- do not imply support for unsupported provider/account flows
- if you add a new action, document what it stores, what it sends, and how it is undone

## 한국어

이 지침은 `apps/extension/sidepanel`에 적용됩니다.

- 이 영역은 Morph UI의 핵심 워크플로우 surface입니다
- provider 설정, privacy control, preview/apply, cache status, diagnostics가 여기 있습니다
- 라벨은 문서와 실제 런타임 동작에 맞춰 유지합니다
- debug detail보다 happy path를 먼저 명확히 보여줍니다
- 미지원 provider/account 흐름을 지원하는 것처럼 암시하지 않습니다
- 새 액션을 추가하면 무엇을 저장하는지, 무엇을 보내는지, 어떻게 undo되는지 설명할 수 있어야 합니다
