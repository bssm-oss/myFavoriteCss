# Content runtime agent instructions

## English

These instructions apply to `apps/extension/content`.

- preserve DOM-first understanding
- prefer semantic selectors and stable attributes over class noise
- keep fingerprints versioned and semantically meaningful
- never mutate scripts or styles as part of transform operations
- preserve forms, links, and focus flow
- any structural operation must remain undoable
- if selector drift becomes unsafe, abort or downgrade rather than guessing
- avoid observer loops and repeated self-triggered reapply storms

## 한국어

이 지침은 `apps/extension/content`에 적용됩니다.

- DOM-first understanding을 유지합니다
- class noise보다 semantic selector와 stable attribute를 우선합니다
- fingerprint는 versioned이고 semantic해야 합니다
- transform 과정에서 script나 style을 조작하지 않습니다
- form, link, focus 흐름을 보존합니다
- 모든 구조 작업은 undo 가능해야 합니다
- selector drift가 위험하면 추측 적용 대신 abort 또는 downgrade합니다
- observer loop와 self-triggered reapply 폭주를 피합니다
