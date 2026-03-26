# AI provider integration

## English

Morph UI treats provider access as a server concern and exposes only capability-aware choices to the extension.

### Common adapter responsibilities

- accept a redacted planning payload
- express capabilities honestly
- request structured JSON output
- normalize provider-specific output to `TransformPlan`
- return typed failures for refusals and unsupported modes

### OpenAI path

- official API only
- server-owned API key mode supported
- consumer account reuse unsupported in this architecture
- structured output required

### Gemini path

- official API only
- server-owned API key mode supported
- consumer account reuse unsupported in this architecture
- structured output required

### Screenshot usage rules

- screenshots are optional input
- screenshots are blocked by strict privacy mode
- screenshots are blocked on sensitive sites by default
- screenshots are only sent on controlled cache-miss or user-requested improvement paths

### Why the extension never talks to providers directly

- provider secrets must remain server-side
- product session is not the same as provider billing identity
- browser-extension review risk is lower when the extension does not embed provider credentials

## 한국어

Morph UI는 provider 접근을 서버 책임으로 두고, extension에는 capability를 반영한 선택지만 노출합니다.

### 공통 adapter 책임

- redaction된 planning payload를 입력으로 받기
- capability를 정직하게 표현하기
- structured JSON 출력을 요청하기
- provider별 출력을 `TransformPlan`으로 정규화하기
- refusal, unsupported mode를 typed failure로 돌려주기

### OpenAI 경로

- 공식 API만 사용
- 서버 소유 API key 모드 지원
- 이 아키텍처에서 consumer account 재사용은 미지원
- structured output 필수

### Gemini 경로

- 공식 API만 사용
- 서버 소유 API key 모드 지원
- 이 아키텍처에서 consumer account 재사용은 미지원
- structured output 필수

### Screenshot 사용 규칙

- screenshot은 선택적 입력입니다.
- strict privacy mode에서는 screenshot을 차단합니다.
- 민감 사이트에서는 기본적으로 screenshot을 차단합니다.
- 통제된 cache miss나 사용자가 명시적으로 개선을 요청한 경로에서만 전송합니다.

### extension이 provider와 직접 통신하지 않는 이유

- provider secret은 반드시 서버에만 있어야 합니다.
- 제품 세션과 provider 과금 정체성은 동일하지 않습니다.
- extension이 provider credential을 내장하지 않을수록 스토어 심사 위험이 낮습니다.
