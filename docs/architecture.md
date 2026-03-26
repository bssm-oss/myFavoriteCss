# Architecture

## English

Morph UI now has two runtime surfaces and no dedicated backend.

### Surfaces

- `apps/extension`
  the Chrome MV3 product runtime
- `apps/web`
  help/privacy pages and deterministic fixture pages

### Shared packages

- `packages/shared`
  Zod-first contracts and types
- `packages/config`
  normalization, sensitivity heuristics, seeded profiles, default models
- `packages/cache`
  similarity scoring and TTL logic
- `packages/ai`
  browser-safe provider planning and transform compilation
- `packages/ui`
  shared React UI components

### Main execution flow

1. User enables a site.
2. Content script builds a `PageSummary` and fingerprint.
3. Background worker checks local IndexedDB cache.
4. If cache is strong enough, Morph UI applies immediately.
5. If cache misses and privacy rules allow it, the background worker calls the selected provider directly with the structured page summary.
6. The returned plan is validated, compiled, previewed, and stored locally.

### Key design choices

- no product account system
- no Morph UI backend cache
- no server-owned provider credentials
- user-supplied provider API keys stored only in `chrome.storage.local`
- local cache first, provider second

## 한국어

Morph UI는 이제 두 개의 런타임 surface만 가지며, 전용 백엔드는 없습니다.

### Surface

- `apps/extension`
  Chrome MV3 제품 런타임
- `apps/web`
  help/privacy 페이지와 deterministic fixture 페이지

### 공유 패키지

- `packages/shared`
  Zod 기반 공용 계약과 타입
- `packages/config`
  정규화, 민감도 heuristic, 시드 프로필, 기본 모델
- `packages/cache`
  similarity scoring과 TTL 로직
- `packages/ai`
  브라우저 안전 provider planning과 transform 컴파일
- `packages/ui`
  공용 React UI 컴포넌트

### 메인 실행 흐름

1. 사용자가 사이트를 enable합니다.
2. content script가 `PageSummary`와 fingerprint를 만듭니다.
3. background worker가 로컬 IndexedDB 캐시를 확인합니다.
4. 캐시가 충분히 맞으면 즉시 적용합니다.
5. 캐시 miss이고 privacy 규칙이 허용하면 background worker가 선택된 provider를 직접 호출합니다.
6. 반환된 plan을 검증, 컴파일, preview 후 로컬에 저장합니다.

### 핵심 설계 선택

- 제품 계정 시스템 없음
- Morph UI 백엔드 캐시 없음
- 서버 소유 provider credential 없음
- 사용자가 제공한 provider API key는 `chrome.storage.local`에만 저장
- local cache 우선, provider 호출은 그 다음
