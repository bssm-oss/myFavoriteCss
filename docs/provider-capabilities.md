# Provider capabilities

## English

Morph UI exposes provider capabilities as implemented.

### OpenAI

- `canUseOfficialOAuth`: `false`
- `canUseServerOwnedApiKey`: `true`
- `supportsVisionInput`: `true`
- `supportsStructuredOutput`: `true`
- `supportsConsumerAccountReuse`: `false`

Meaning:

- official OpenAI API is supported from the server
- ChatGPT consumer account reuse is not supported

### Gemini

- `canUseOfficialOAuth`: provider/platform capability exists
- `canUseServerOwnedApiKey`: `true`
- `supportsVisionInput`: `true`
- `supportsStructuredOutput`: `true`
- `supportsConsumerAccountReuse`: `false`

Meaning:

- official Gemini API is supported from the server
- Gemini Advanced subscription reuse is not supported

### Product auth versus provider auth

Morph UI product sign-in uses Google OAuth. Provider execution uses server-owned credentials. These are separate concepts.

## 한국어

Morph UI는 실제로 구현된 capability만 노출합니다.

### OpenAI

- `canUseOfficialOAuth`: `false`
- `canUseServerOwnedApiKey`: `true`
- `supportsVisionInput`: `true`
- `supportsStructuredOutput`: `true`
- `supportsConsumerAccountReuse`: `false`

의미:

- 서버에서 공식 OpenAI API 호출은 지원
- ChatGPT 소비자 계정 재사용은 지원하지 않음

### Gemini

- `canUseOfficialOAuth`: provider/platform 수준 capability는 존재
- `canUseServerOwnedApiKey`: `true`
- `supportsVisionInput`: `true`
- `supportsStructuredOutput`: `true`
- `supportsConsumerAccountReuse`: `false`

의미:

- 서버에서 공식 Gemini API 호출은 지원
- Gemini Advanced 구독 재사용은 지원하지 않음

### 제품 인증과 provider 인증

Morph UI 제품 로그인은 Google OAuth를 사용합니다. Provider 실행은 서버 소유 credential을 사용합니다. 둘은 별개의 개념입니다.
