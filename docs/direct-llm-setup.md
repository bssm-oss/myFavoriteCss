# Direct LLM setup

## English

Morph UI uses direct provider calls from the extension background. There is no Morph UI backend proxy and no shared product account.

### What you need

- one OpenAI API key or one Gemini API key
- a model name accepted by the selected provider
- Chrome host permission for the current site

### Provider setup flow

1. Open the side panel.
2. Find `Provider configuration`.
3. Paste the API key for `OpenAI` or `Gemini`.
4. Leave the default model unless you have a specific reason to change it.
5. Click `Validate and save`.
6. Confirm the card shows:
   - `Configured = Yes`
   - a masked key
   - a model name
   - `Last validated`

### What validation does

- sends a minimal request to the official provider endpoint
- checks that the key is accepted
- checks that the selected model can answer a strict JSON request
- stores the config only after validation succeeds

### Default model guidance

- OpenAI
  start with the default model already shown in the side panel
- Gemini
  start with the default model already shown in the side panel

If you change models, prefer fast general-purpose models first. Do not start with an expensive reasoning-heavy model unless you already know why the page needs it.

### Common failure cases

- invalid API key
  the provider rejects validation immediately
- unsupported model name
  the provider rejects the request or returns a model-not-found error
- strict-local mode
  the key can still be stored, but planning will not run on pages while strict-local blocks provider usage
- sensitive URL
  planning can still be blocked on login, payment, checkout, and similar pages

### Security posture

- the raw provider key is stored only in `chrome.storage.local`
- the key is not synced with `chrome.storage.sync`
- the key is not sent to any Morph UI backend because there is no Morph UI backend
- consumer subscription reuse is unsupported

## 한국어

Morph UI는 extension background에서 provider를 직접 호출합니다. Morph UI 백엔드 프록시도 없고, 공유 제품 계정도 없습니다.

### 필요한 것

- OpenAI API key 또는 Gemini API key 하나
- 선택한 provider가 허용하는 model 이름
- 현재 사이트에 대한 Chrome host permission

### provider 설정 절차

1. side panel을 엽니다.
2. `Provider configuration` 섹션을 찾습니다.
3. `OpenAI` 또는 `Gemini`용 API key를 붙여 넣습니다.
4. 특별한 이유가 없다면 기본 model 값을 그대로 둡니다.
5. `Validate and save`를 클릭합니다.
6. 카드에 다음이 표시되는지 확인합니다.
   - `Configured = Yes`
   - 마스킹된 key
   - model 이름
   - `Last validated`

### validation이 하는 일

- 공식 provider endpoint로 최소 요청을 보냅니다
- key가 실제로 유효한지 확인합니다
- 선택한 model이 strict JSON 요청을 처리할 수 있는지 확인합니다
- validation이 성공한 뒤에만 설정을 저장합니다

### 기본 model 가이드

- OpenAI
  side panel에 표시된 기본 model부터 시작합니다
- Gemini
  side panel에 표시된 기본 model부터 시작합니다

model을 바꾸더라도 처음에는 빠른 범용 모델부터 쓰는 편이 좋습니다. 페이지에 정말 필요하다는 근거가 없으면 비용이 큰 reasoning-heavy 모델부터 시작하지 않는 것이 좋습니다.

### 흔한 실패 케이스

- 잘못된 API key
  provider가 validation을 즉시 거절합니다
- 지원하지 않는 model 이름
  provider가 요청을 거절하거나 model-not-found 에러를 반환합니다
- strict-local mode
  key 저장은 가능하지만 strict-local이 provider 사용을 막는 동안에는 planning이 실행되지 않습니다
- 민감 URL
  로그인, 결제, checkout 같은 페이지에서는 planning이 계속 차단될 수 있습니다

### 보안 원칙

- 원본 provider key는 `chrome.storage.local`에만 저장됩니다
- key는 `chrome.storage.sync`로 동기화되지 않습니다
- Morph UI 백엔드가 없으므로 key가 Morph UI 서버로 전송되지 않습니다
- 소비자 구독 재사용은 지원하지 않습니다
