# Cache package agent instructions

## English

These instructions apply to `packages/cache`.

- keep cache helpers deterministic
- similarity thresholds are user-visible behavior, not internal trivia
- TTL logic should remain explainable in docs
- avoid hidden randomness or time-sensitive behavior in pure helpers

## 한국어

이 지침은 `packages/cache`에 적용됩니다.

- cache helper는 deterministic하게 유지합니다
- similarity threshold는 내부 trivia가 아니라 사용자 가시 동작입니다
- TTL 로직은 문서로 설명 가능한 상태를 유지해야 합니다
- 순수 helper에 숨겨진 randomness나 시간 의존 동작을 넣지 않습니다
