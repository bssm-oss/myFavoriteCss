# Extension messaging reference

## English

Morph UI uses typed message contracts between UI surfaces, the background worker, and content scripts.

### Runtime messages

Examples:

- `GET_BOOTSTRAP`
- `START_GOOGLE_SIGN_IN`
- `SAVE_PROFILE`
- `UPSERT_SITE_SETTING`
- `UPDATE_SYNCED_SETTINGS`
- `ENABLE_SITE`
- `DISABLE_SITE`
- `PREVIEW_TRANSFORM`
- `APPLY_TRANSFORM`
- `UNDO_TRANSFORM`
- `RESET_SITE`
- `TOGGLE_AUTO_APPLY`
- `PAGE_READY`
- `INSPECT_CACHE`
- `OPEN_SIDE_PANEL`
- `QUICK_APPLY`
- `QUICK_UNDO`

### Content messages

Examples:

- `MORPH_ANALYZE_PAGE`
- `MORPH_APPLY_COMPILED`
- `MORPH_UNDO_TRANSFORM`
- `MORPH_RESET_SITE`
- `MORPH_GET_RUNTIME_STATE`

Canonical definitions live in:

- `apps/extension/lib/chrome-messaging.ts`

## 한국어

Morph UI는 UI surface, background worker, content script 사이에서 타입이 있는 메시지 계약을 사용합니다.

### Runtime 메시지

예시:

- `GET_BOOTSTRAP`
- `START_GOOGLE_SIGN_IN`
- `SAVE_PROFILE`
- `UPSERT_SITE_SETTING`
- `UPDATE_SYNCED_SETTINGS`
- `ENABLE_SITE`
- `DISABLE_SITE`
- `PREVIEW_TRANSFORM`
- `APPLY_TRANSFORM`
- `UNDO_TRANSFORM`
- `RESET_SITE`
- `TOGGLE_AUTO_APPLY`
- `PAGE_READY`
- `INSPECT_CACHE`
- `OPEN_SIDE_PANEL`
- `QUICK_APPLY`
- `QUICK_UNDO`

### Content 메시지

예시:

- `MORPH_ANALYZE_PAGE`
- `MORPH_APPLY_COMPILED`
- `MORPH_UNDO_TRANSFORM`
- `MORPH_RESET_SITE`
- `MORPH_GET_RUNTIME_STATE`

정식 정의 위치:

- `apps/extension/lib/chrome-messaging.ts`
