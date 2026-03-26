# Environment variables

## English

This document explains the main configuration values used by Morph UI.

### Required for local development

- `DATABASE_URL`
- `SESSION_TOKEN_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_OAUTH_REDIRECT_URI`

### Provider configuration

At least one of the following should be set for real provider-backed planning:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`

### Optional values

- web origin overrides
- server port overrides
- log-level configuration

### Failure modes

- missing `DATABASE_URL`: server cannot boot or migrate
- missing `SESSION_TOKEN_SECRET`: session issuance should fail hard
- missing Google OAuth values: product sign-in flow cannot complete
- missing provider keys: capability route still works, but planning should surface unavailable provider modes

## 한국어

이 문서는 Morph UI에서 사용하는 주요 환경변수를 설명합니다.

### 로컬 개발에 필요한 값

- `DATABASE_URL`
- `SESSION_TOKEN_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_OAUTH_REDIRECT_URI`

### Provider 설정

실제 provider planning을 사용하려면 아래 중 최소 하나가 필요합니다.

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`

### 선택 값

- 웹 origin override
- 서버 포트 override
- 로그 레벨 설정

### 값이 없을 때의 실패 형태

- `DATABASE_URL` 없음: 서버 부팅/마이그레이션 불가
- `SESSION_TOKEN_SECRET` 없음: 세션 발급을 강하게 실패시켜야 함
- Google OAuth 값 없음: 제품 로그인 플로우 불가
- Provider 키 없음: capability route는 동작할 수 있지만 planning은 unavailable mode를 노출해야 함
