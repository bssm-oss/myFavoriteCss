# Storage and sync layout

## English

Morph UI uses three browser-side storage layers and one remote cache layer.

### `chrome.storage.sync`

Use this only for tiny synced preferences:

- onboarding completed flag
- default provider id
- privacy mode
- profile metadata summaries
- diagnostics toggle

### `chrome.storage.local`

Use this for fast local metadata:

- site enabled flags
- auto-apply flags
- local auth session tokens
- last applied cache key
- active profile references

### IndexedDB

Use IndexedDB for larger artifacts:

- validated `TransformPlan`
- compiled CSS text
- compiled DOM operation bundle
- fingerprint features
- selector validation stats
- screenshot hash
- TTL timestamps

### Remote cache in Postgres

Remote cache is per-user in v1 and stores:

- canonical transform artifacts
- fingerprint metadata
- confidence and validation timestamps
- feedback-linked cache records

### Why the split matters

- sync is size-constrained and should stay tiny
- local metadata should be fast to read on every visit
- transform payloads are too large for sync and too important to fragment across many keys
- remote cache supports multi-device continuity without exposing provider credentials to the extension

## 한국어

Morph UI는 브라우저 측 3개의 저장소 계층과 1개의 원격 캐시 계층을 사용합니다.

### `chrome.storage.sync`

작고 동기화 가능한 설정만 넣습니다.

- onboarding 완료 플래그
- 기본 provider id
- privacy mode
- 프로필 메타데이터 요약
- diagnostics toggle

### `chrome.storage.local`

빠르게 읽어야 하는 로컬 메타데이터를 저장합니다.

- 사이트 enable 플래그
- auto-apply 플래그
- 로컬 auth session token
- 마지막 적용 cache key
- active profile 참조

### IndexedDB

큰 아티팩트는 IndexedDB를 사용합니다.

- 검증된 `TransformPlan`
- compiled CSS text
- compiled DOM operation bundle
- fingerprint feature
- selector validation 통계
- screenshot hash
- TTL timestamp

### Postgres 원격 캐시

v1의 원격 캐시는 사용자 단위로 분리되며 다음을 저장합니다.

- canonical transform artifact
- fingerprint metadata
- confidence와 validation 시각
- feedback와 연결된 cache record

### 왜 이렇게 나누는가

- sync는 용량 제약이 크므로 매우 작게 유지해야 합니다.
- local metadata는 매 방문마다 빨리 읽혀야 합니다.
- transform payload는 sync에 넣기엔 크고 key 단위로 쪼개면 관리가 나빠집니다.
- 원격 캐시는 provider credential을 extension에 노출하지 않고도 다중 기기 연속성을 제공합니다.
