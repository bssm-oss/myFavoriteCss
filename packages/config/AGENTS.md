# Config package agent instructions

## English

These instructions apply to `packages/config`.

- keep heuristics deterministic and reviewable
- URL normalization changes must be treated as cache behavior changes
- sensitive-site logic must err on the side of blocking
- seeded defaults should stay realistic and documented

## 한국어

이 지침은 `packages/config`에 적용됩니다.

- heuristic은 deterministic하고 리뷰 가능하게 유지합니다
- URL 정규화 변경은 cache 동작 변경으로 취급합니다
- 민감 사이트 로직은 차단 쪽으로 보수적으로 동작해야 합니다
- seeded default는 현실적이고 문서화된 상태를 유지합니다
