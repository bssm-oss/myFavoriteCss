# Troubleshooting

## English

### Preview fails immediately

Check:

- a provider API key is configured in the side panel
- `Validate and save` succeeded for the current provider and model
- privacy mode is not `strict-local`
- the current site is enabled

### `Validate and save` fails

Check:

- the provider key is really an API key, not a consumer product session token
- the selected model exists for that provider account
- outbound requests to the provider endpoint are not blocked by your network
- the extension was reloaded after recent manifest changes

### The extension does not affect the page

Check:

- host permission was granted
- content script is registered for the origin
- a local cache hit or provider plan actually exists

### Fixture page does not open

Check:

- `pnpm local:dev` is running
- `http://localhost:5173` is reachable

## 한국어

### Preview가 바로 실패함

다음을 확인:

- side panel에 provider API key가 설정되었는지
- privacy mode가 `strict-local`이 아닌지
- 현재 사이트가 enable 상태인지

### 확장이 페이지에 영향을 주지 않음

다음을 확인:

- host permission이 부여되었는지
- content script가 origin에 등록되었는지
- 실제로 local cache hit 또는 provider plan이 존재하는지

### `Validate and save`가 실패함

다음을 확인:

- 입력한 값이 소비자 제품 세션 토큰이 아니라 실제 provider API key인지
- 선택한 model이 해당 provider 계정에서 실제로 존재하는지
- 네트워크가 provider endpoint로의 outbound 요청을 막고 있지 않은지
- 최근 manifest 변경 뒤 extension을 다시 로드했는지

### Fixture 페이지가 열리지 않음

다음을 확인:

- `pnpm local:dev` 가 실행 중인지
- `http://localhost:5173` 에 접속 가능한지
