# Extension agent instructions

## English

These instructions apply to `apps/extension`.

### Core responsibility

The extension is the primary product runtime. It must remain store-review-safe, reversible, and privacy-aware.

### Hard rules

- Keep Manifest V3 compatibility.
- Do not add remote code execution paths.
- Do not broaden permissions casually.
- Do not move secrets or provider keys into the extension.
- Do not break links, forms, keyboard navigation, or accessibility.

### Extension architecture expectations

- side panel is the main UX
- popup remains minimal and secondary
- content script does page understanding and transform application
- background worker coordinates permissions, cache, messaging, and navigation events

### Cache and apply behavior

- prefer local cache hits before remote work
- preserve instant revisit behavior
- structural changes must stay reversible
- selector mismatch spikes should degrade safely, not brute-force apply

### File-specific guidance

- `manifest.json`: keep permissions minimal and reviewable
- `background/`: orchestration only, not UI logic
- `content/`: safe DOM/CSS operations, robust guards, no destructive shortcuts
- `lib/`: browser helpers and storage/messaging utilities
- `sidepanel/`: full product controls and diagnostics
- `popup/`: quick actions only

### Verification

- run relevant extension tests when runtime code changes
- run E2E when behavior visible in browser changes
- keep fixture-based flows deterministic

## 한국어

이 지침은 `apps/extension`에 적용됩니다.

### 핵심 책임

extension은 제품의 주 런타임입니다. 스토어 심사에 안전하고, 되돌릴 수 있으며, privacy를 고려한 상태를 유지해야 합니다.

### 강한 규칙

- Manifest V3 호환성을 유지합니다.
- 원격 코드 실행 경로를 추가하지 않습니다.
- 권한을 가볍게 넓히지 않습니다.
- secret이나 provider key를 extension 안으로 옮기지 않습니다.
- 링크, form, 키보드 내비게이션, 접근성을 깨뜨리지 않습니다.

### extension 아키텍처 기대사항

- side panel이 메인 UX입니다.
- popup은 최소 기능의 보조 surface입니다.
- content script가 page understanding과 transform 적용을 담당합니다.
- background worker가 권한, 캐시, 메시징, 내비게이션 이벤트를 조율합니다.

### 캐시 및 적용 동작

- 원격 작업보다 local cache hit를 우선합니다.
- 재방문 즉시 적용 경험을 유지합니다.
- 구조 변경은 되돌릴 수 있어야 합니다.
- selector mismatch가 늘면 무리하게 적용하지 말고 안전하게 degrade해야 합니다.

### 파일별 가이드

- `manifest.json`: 권한은 최소화하고 심사 가능하게 유지
- `background/`: orchestration 중심, UI 로직 금지
- `content/`: 안전한 DOM/CSS 작업, robust guard, 파괴적 지름길 금지
- `lib/`: 브라우저 헬퍼와 storage/messaging 유틸리티
- `sidepanel/`: 전체 제품 제어와 diagnostics
- `popup/`: 빠른 액션만

### 검증

- 런타임 코드가 바뀌면 관련 extension 테스트를 실행합니다.
- 브라우저에 보이는 동작이 바뀌면 E2E를 실행합니다.
- fixture 기반 흐름은 deterministic하게 유지합니다.
