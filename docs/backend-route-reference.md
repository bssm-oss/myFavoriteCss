# Backend route reference

## English

This document is a practical route map that complements the schema-first API contract.

### Auth routes

- `POST /api/auth/session/exchange`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Provider and planning routes

- `GET /api/provider/capabilities`
- `POST /api/transform/plan`

### Cache routes

- `POST /api/cache/lookup`
- `POST /api/cache/save`

### User configuration routes

- `GET /api/profiles`
- `POST /api/profiles`
- `GET /api/site-settings`
- `POST /api/site-settings`

### Feedback and health

- `POST /api/feedback`
- `GET /health`

### Notes

- all request bodies are validated with Zod
- authenticated routes depend on Morph UI product session, not provider auth
- redacted payload logging is preferred over raw body logging

## 한국어

이 문서는 schema 중심 API 계약을 보완하는 실용적인 route 지도입니다.

### Auth route

- `POST /api/auth/session/exchange`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Provider 및 planning route

- `GET /api/provider/capabilities`
- `POST /api/transform/plan`

### Cache route

- `POST /api/cache/lookup`
- `POST /api/cache/save`

### 사용자 설정 route

- `GET /api/profiles`
- `POST /api/profiles`
- `GET /api/site-settings`
- `POST /api/site-settings`

### Feedback 및 health

- `POST /api/feedback`
- `GET /health`

### 참고

- 모든 요청 body는 Zod로 검증됩니다.
- 인증이 필요한 route는 provider auth가 아니라 Morph UI 제품 세션을 사용합니다.
- 원본 body 로그보다 redaction된 payload 로그를 우선합니다.
