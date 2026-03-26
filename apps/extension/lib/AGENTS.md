# Extension library agent instructions

## English

These instructions apply to `apps/extension/lib`.

- keep helpers browser-safe
- keep storage concerns separated between local, sync, and IndexedDB
- keep message types and payloads explicit
- keep permission wrappers narrow and reviewable
- utility code should not hide user-visible state transitions
- if helper semantics change, review all callers because these files are highly shared inside the extension

## 한국어

이 지침은 `apps/extension/lib`에 적용됩니다.

- helper는 browser-safe하게 유지합니다
- storage concern을 local, sync, IndexedDB로 분리해 유지합니다
- message type과 payload는 명시적으로 유지합니다
- permission wrapper는 좁고 리뷰 가능하게 유지합니다
- 유틸리티 코드가 사용자 가시 상태 전환을 숨기면 안 됩니다
- helper 의미가 바뀌면 extension 내부 여러 caller가 공유하므로 전부 다시 봅니다
