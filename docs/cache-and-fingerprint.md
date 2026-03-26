# Cache and fingerprint

## English

Morph UI is local-cache-first.

### Cache layers

- IndexedDB stores large transform artifacts
- `chrome.storage.local` stores fast metadata
- there is no Morph UI remote cache in extension-only mode

### Visit flow

1. compute page fingerprint
2. check local artifact candidates
3. auto-apply exact or strong matches
4. use conservative CSS-only fallback for drifted matches
5. call the selected provider only when local cache is not enough and privacy allows it

## 한국어

Morph UI는 local-cache-first 전략을 사용합니다.

### 캐시 계층

- IndexedDB는 큰 transform artifact를 저장합니다
- `chrome.storage.local`은 빠른 메타데이터를 저장합니다
- extension-only 모드에는 Morph UI 원격 캐시가 없습니다

### 방문 흐름

1. 페이지 fingerprint 계산
2. 로컬 artifact 후보 확인
3. exact 또는 강한 match는 자동 적용
4. drift가 있으면 conservative CSS-only fallback 사용
5. 로컬 캐시가 충분하지 않고 privacy가 허용할 때만 provider 호출
