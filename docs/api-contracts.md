# API contracts

## English

Canonical request and response schemas live in `packages/shared/src/api.ts`.

### Auth routes

- `GET /api/auth/google/start`
  starts Morph UI product sign-in with Google OAuth
- `GET /api/auth/google/callback`
  completes the OAuth callback and redirects back to the extension with a one-time exchange code
- `POST /api/auth/session/exchange`
  exchanges the one-time code for Morph UI access and refresh tokens
- `POST /api/auth/session/refresh`
  refreshes the Morph UI access token

### Provider route

- `GET /api/provider/capabilities`
  returns capability cards for OpenAI and Gemini

### Profile routes

- `GET /api/profiles`
- `POST /api/profiles`

### Site setting routes

- `GET /api/site-settings`
- `POST /api/site-settings`

### Cache routes

- `POST /api/cache/lookup`
  looks up a per-user remote cache artifact
- `POST /api/cache/save`
  saves an accepted artifact to the remote cache

### Transform route

- `POST /api/transform/plan`
  validates input, calls the selected provider, validates the provider response, compiles the transform, and returns a provider-independent payload

### Feedback route

- `POST /api/feedback`
  stores accept, reject, tweak, undo, or reset feedback and can append learned adjustments to a profile

### Error handling

The current Fastify error handler returns:

```json
{ "error": "message" }
```

## 한국어

정식 요청/응답 스키마는 `packages/shared/src/api.ts`에 있습니다.

### 인증 라우트

- `GET /api/auth/google/start`
  Google OAuth로 Morph UI 제품 로그인 시작
- `GET /api/auth/google/callback`
  OAuth 콜백 완료 후 one-time exchange code를 붙여 확장으로 리다이렉트
- `POST /api/auth/session/exchange`
  one-time code를 Morph UI access/refresh token으로 교환
- `POST /api/auth/session/refresh`
  Morph UI access token 갱신

### Provider 라우트

- `GET /api/provider/capabilities`
  OpenAI/Gemini capability 카드 반환

### 프로필 라우트

- `GET /api/profiles`
- `POST /api/profiles`

### 사이트 설정 라우트

- `GET /api/site-settings`
- `POST /api/site-settings`

### 캐시 라우트

- `POST /api/cache/lookup`
  사용자별 원격 캐시 아티팩트 조회
- `POST /api/cache/save`
  승인된 아티팩트를 원격 캐시에 저장

### 변환 라우트

- `POST /api/transform/plan`
  입력 검증, 선택된 provider 호출, provider 응답 검증, transform 컴파일, provider 독립 payload 반환

### 피드백 라우트

- `POST /api/feedback`
  accept/reject/tweak/undo/reset 피드백 저장 및 profile learned adjustment 반영 가능

### 에러 처리

현재 Fastify 에러 핸들러는 다음 형태를 반환합니다.

```json
{ "error": "message" }
```
