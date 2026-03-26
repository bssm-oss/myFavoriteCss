# Auth and session flow

## English

Morph UI separates product authentication from AI provider execution.

### Product auth

Current product auth flow:

1. The extension starts Google OAuth through `chrome.identity.launchWebAuthFlow`
2. The backend generates an OAuth state and code challenge
3. Google redirects back to the backend callback
4. The backend issues a one-time exchange code for the extension callback
5. The extension exchanges that code for Morph UI access and refresh tokens

### Server session model

The backend stores:

- hashed access tokens
- hashed refresh tokens
- expiry timestamps
- optional user agent metadata

The extension stores Morph UI session tokens in extension storage, not in page context.

### Important boundaries

- Morph UI product sign-in is separate from OpenAI or Gemini identity
- provider API keys stay server-side
- the extension never stores provider secrets
- consumer ChatGPT Plus or Gemini Advanced account reuse is not implemented

## 한국어

Morph UI는 제품 인증과 AI provider 실행을 분리합니다.

### 제품 인증

현재 제품 인증 흐름:

1. 확장이 `chrome.identity.launchWebAuthFlow`로 Google OAuth 시작
2. 백엔드가 OAuth state와 code challenge 생성
3. Google이 백엔드 callback으로 리다이렉트
4. 백엔드가 확장 callback용 one-time exchange code 발급
5. 확장이 그 코드를 Morph UI access/refresh token으로 교환

### 서버 세션 모델

백엔드는 다음을 저장합니다.

- 해시된 access token
- 해시된 refresh token
- 만료 시각
- 선택적 user agent 메타데이터

확장은 Morph UI 세션 토큰을 페이지 컨텍스트가 아닌 확장 스토리지에 저장합니다.

### 중요한 경계

- Morph UI 제품 로그인과 OpenAI/Gemini identity는 별개
- provider API key는 서버에만 존재
- 확장은 provider 비밀키를 저장하지 않음
- ChatGPT Plus, Gemini Advanced 같은 소비자 계정 재사용은 구현하지 않음
