# Troubleshooting

## English

### Preview fails immediately

Check:

- a provider API key is configured in the side panel
- privacy mode is not `strict-local`
- the current site is enabled

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

### Fixture 페이지가 열리지 않음

다음을 확인:

- `pnpm local:dev` 가 실행 중인지
- `http://localhost:5173` 에 접속 가능한지
