# Privacy and data flow

## English

Morph UI is extension-only, so the main data boundary is between the extension and the selected AI provider.

### Stored locally

- profiles and synced settings
- site enablement flags
- provider configuration summaries
- provider API keys in `chrome.storage.local`
- IndexedDB transform artifacts, fingerprints, compiled CSS, and validation stats

### Sent to providers

- structured page summary
- selected profile and site policy
- optional screenshot only when allowed

### Never sent

- cookies
- password values
- hidden auth tokens
- payment card values
- private secrets extracted from obvious token-like fields

### Strict-local mode

In `strict-local`, Morph UI uses only existing local cache and does not call a provider.

## 한국어

Morph UI는 extension-only 구조이므로, 주요 데이터 경계는 extension과 선택된 AI provider 사이에 있습니다.

### 로컬 저장

- 프로필과 synced 설정
- 사이트 enable 플래그
- provider 설정 요약
- `chrome.storage.local`에 저장되는 provider API key
- IndexedDB의 transform artifact, fingerprint, compiled CSS, validation stat

### Provider로 전송되는 것

- 구조화된 페이지 요약
- 선택된 프로필과 사이트 정책
- 허용된 경우에만 선택적 screenshot

### 전송하지 않는 것

- cookie
- 비밀번호 값
- 숨겨진 auth token
- 결제 카드 값
- 명백한 token-like field에서 추출된 private secret

### Strict-local mode

`strict-local`에서는 기존 로컬 캐시만 사용하고 provider를 호출하지 않습니다.
