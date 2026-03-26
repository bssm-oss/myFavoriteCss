# User workflow guide

## English

This document describes the intended product workflow from the user's point of view.

### First-run onboarding

1. Open the side panel.
2. Read the privacy explanation.
3. Choose a privacy mode.
4. Choose a default provider.
5. Decide whether screenshot-on-miss is allowed.
6. Finish onboarding and persist the small settings in `chrome.storage.sync`.

### Enable a site

1. Visit a page.
2. Open the side panel or popup.
3. Toggle enable for the current origin.
4. Grant optional host permission for the current site.
5. Persist the site flag in `chrome.storage.local`.

### Preview and apply

1. The content script extracts a `PageSummary` and fingerprint.
2. The background worker checks local IndexedDB and local metadata.
3. If a safe cache hit exists, Morph UI can preview from cache immediately.
4. If no usable cache exists and privacy rules allow it, the extension asks the server for a fresh plan.
5. The plan is validated, compiled, previewed, and can then be applied.

### Undo and reset

- `Undo` rolls back the active reversible journal for the current tab.
- `Reset site` removes site-level enablement state, local cache references, and active transform markers for the origin.

### Auto-apply revisit behavior

1. User revisits a known page.
2. Minimal page fingerprint is computed quickly.
3. A strong cache match applies instantly.
4. A background revalidation may refresh the cache if the page drifted.

### Typical demo path

Use the local fixture pages in this order:

1. `/fixtures/article` with `Reader Focus`
2. `/fixtures/docs` with `Docs Navigator`
3. `/fixtures/form` to confirm that forms remain intact

## 한국어

이 문서는 사용자 관점에서 Morph UI의 기본 사용 흐름을 설명합니다.

### 첫 실행 온보딩

1. 사이드패널을 엽니다.
2. privacy 설명을 읽습니다.
3. privacy mode를 고릅니다.
4. 기본 provider를 선택합니다.
5. cache miss 시 screenshot 허용 여부를 결정합니다.
6. 온보딩을 마치면 작은 설정이 `chrome.storage.sync`에 저장됩니다.

### 사이트 활성화

1. 페이지에 방문합니다.
2. 사이드패널 또는 팝업을 엽니다.
3. 현재 origin에 대해 enable을 켭니다.
4. 현재 사이트에 대한 optional host permission을 승인합니다.
5. 사이트 활성화 플래그는 `chrome.storage.local`에 저장됩니다.

### Preview와 apply

1. content script가 `PageSummary`와 fingerprint를 추출합니다.
2. background worker가 local IndexedDB와 local metadata를 확인합니다.
3. 안전한 cache hit가 있으면 즉시 cache 기반 preview가 가능합니다.
4. 사용할 cache가 없고 privacy 규칙이 허용하면 서버에 새 plan을 요청합니다.
5. plan은 검증되고 컴파일되며 preview 뒤 apply할 수 있습니다.

### Undo와 reset

- `Undo`는 현재 탭에 적용된 reversible journal을 되돌립니다.
- `Reset site`는 해당 origin의 사이트 설정, local cache 참조, active transform marker를 제거합니다.

### Auto-apply 재방문 동작

1. 사용자가 이미 다뤘던 페이지에 다시 방문합니다.
2. 최소 fingerprint를 빠르게 계산합니다.
3. 강한 cache match가 있으면 즉시 적용합니다.
4. 배경 revalidation이 필요하면 drift를 확인하고 cache를 갱신합니다.

### 추천 데모 경로

로컬 fixture는 다음 순서로 보는 것이 좋습니다.

1. `/fixtures/article` 에서 `Reader Focus`
2. `/fixtures/docs` 에서 `Docs Navigator`
3. `/fixtures/form` 에서 form이 깨지지 않는지 확인
