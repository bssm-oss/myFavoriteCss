# AI provider integration

## English

Morph UI calls providers directly from the extension background.

### Supported model

- user-supplied OpenAI API key
- user-supplied Gemini API key
- validation before save against the selected provider/model

### Not supported

- server-owned provider credentials
- consumer account reuse
- hidden browser-session reuse

### Flow

1. User stores a provider API key locally.
2. The side panel validates the selected key/model against the official provider API before saving it.
3. Background worker builds a structured prompt from the page summary and selected profile.
4. The provider returns strict JSON.
5. Morph UI validates and compiles the plan locally.

## 한국어

Morph UI는 extension background에서 provider를 직접 호출합니다.

### 지원 모델

- 사용자가 제공한 OpenAI API key
- 사용자가 제공한 Gemini API key
- 선택한 provider/model에 대한 저장 전 검증

### 지원하지 않는 것

- 서버 소유 provider credential
- 소비자 계정 재사용
- 숨겨진 브라우저 세션 재사용

### 흐름

1. 사용자가 provider API key를 로컬에 입력합니다.
2. side panel이 저장 전에 선택한 key/model을 공식 provider API로 검증합니다.
3. background worker가 페이지 요약과 선택된 프로필로 구조화된 prompt를 만듭니다.
4. provider가 strict JSON을 반환합니다.
5. Morph UI가 로컬에서 plan을 검증하고 컴파일합니다.
