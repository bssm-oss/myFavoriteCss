# Storage and sync layout

## English

Morph UI uses three browser storage layers.

### `chrome.storage.sync`

- small synced settings
- profile metadata
- onboarding and diagnostics flags

### `chrome.storage.local`

- site settings
- selected profiles by origin
- provider API keys and provider config metadata
- fast diagnostics metadata

### IndexedDB

- transform plans
- compiled CSS and operations
- fingerprints
- validation stats
- screenshot hashes

## 한국어

Morph UI는 브라우저 저장소 3계층을 사용합니다.

### `chrome.storage.sync`

- 작은 synced 설정
- 프로필 메타데이터
- onboarding 및 diagnostics 플래그

### `chrome.storage.local`

- 사이트 설정
- origin별 선택 프로필
- provider API key와 provider 설정 메타데이터
- 빠른 diagnostics 메타데이터

### IndexedDB

- transform plan
- compiled CSS와 operation
- fingerprint
- validation stat
- screenshot hash
