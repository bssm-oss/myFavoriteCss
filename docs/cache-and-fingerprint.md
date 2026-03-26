# Cache and fingerprint design

## English

Cache behavior is central to Morph UI. The goal is to avoid repeated planning for the same page and profile.

### Cache layers

- `chrome.storage.local`
  fast local metadata
- `chrome.storage.sync`
  small synced settings
- IndexedDB
  large local transform artifacts
- Postgres remote cache
  optional per-user sync across machines

### URL normalization

The system removes tracking-like params such as `utm_*`, `fbclid`, `gclid`, and preserves meaningful params such as `q`, `search`, `category`, `product`, `page`, and `version`.

### Fingerprint inputs

- normalized URL
- path signature
- page type guess
- landmark signature
- region signatures
- interactive density
- layout complexity
- repeated pattern score

### Similarity thresholds

- `1.00`
  exact match
- `>= 0.88`
  safe auto-apply
- `0.72 - 0.87`
  conservative CSS-only fallback
- `< 0.72`
  re-analysis required

### Invalidation triggers

- fingerprint version change
- profile change
- site override change
- schema change
- high selector mismatch
- TTL expiry

## 한국어

캐시 동작은 Morph UI의 핵심입니다. 목표는 같은 페이지와 프로필에 대해 planning을 반복 호출하지 않는 것입니다.

### 캐시 계층

- `chrome.storage.local`
  빠른 로컬 메타데이터
- `chrome.storage.sync`
  작은 동기화 설정
- IndexedDB
  큰 로컬 transform 아티팩트
- Postgres 원격 캐시
  기기 간 사용자별 선택적 동기화

### URL 정규화

시스템은 `utm_*`, `fbclid`, `gclid` 같은 추적성 파라미터는 제거하고, `q`, `search`, `category`, `product`, `page`, `version` 같은 의미 있는 파라미터는 유지합니다.

### Fingerprint 입력 요소

- normalized URL
- path signature
- page type guess
- landmark signature
- region signatures
- interactive density
- layout complexity
- repeated pattern score

### 유사도 임계값

- `1.00`
  완전 일치
- `>= 0.88`
  안전한 자동 적용
- `0.72 - 0.87`
  보수적 CSS-only fallback
- `< 0.72`
  재분석 필요

### 무효화 조건

- fingerprint 버전 변경
- 프로필 변경
- 사이트 오버라이드 변경
- 스키마 변경
- selector mismatch 증가
- TTL 만료
