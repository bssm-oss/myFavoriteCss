# Diagnostics and observability

## English

Morph UI has lightweight observability intended for local debugging and safe production operation.

### What to inspect first

- side panel cache status
- side panel provider status
- diagnostics toggle output
- Playwright screenshots and smoke notes

### Cache-oriented debugging

- confirm the normalized URL
- confirm profile id and privacy mode
- inspect last applied cache key
- compare fingerprint similarity bucket

### Planning-oriented debugging

- confirm provider capability state
- confirm a local provider key is configured
- confirm strict privacy mode is not blocking provider-assisted planning

### Evidence sources in the repository

- `tests/manual/`
- `tests/evidence/`
- fixture screenshots under `output/playwright/`

## 한국어

Morph UI는 로컬 디버깅과 안전한 운영을 위한 경량 observability를 갖습니다.

### 가장 먼저 볼 것

- 사이드패널 cache status
- 사이드패널 provider status
- diagnostics toggle 출력
- Playwright 스크린샷과 smoke note

### Cache 중심 디버깅

- normalized URL 확인
- profile id와 privacy mode 확인
- 마지막 적용 cache key 확인
- fingerprint similarity bucket 비교

### Planning 중심 디버깅

- provider capability 상태 확인
- 로컬 provider key가 설정되어 있는지 확인
- strict privacy mode가 provider-assisted planning을 막고 있지 않은지 확인

### 저장소 안의 증거 위치

- `tests/manual/`
- `tests/evidence/`
- `output/playwright/` 아래 fixture screenshot
