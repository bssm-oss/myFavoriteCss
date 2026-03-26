# Privacy and data flow

## English

Morph UI makes privacy behavior explicit.

### Privacy modes

- `strict-local`
  no remote planning, local cached transforms only
- `local-first`
  default mode, local analysis and cache first, remote planning allowed when policy permits
- `sync-enabled`
  same planning behavior as local-first plus remote artifact sync

### What stays local

- site enablement flags
- selected profiles
- synced settings
- diagnostics
- local transform cache

### What may go to the server

- redacted page summary
- fingerprint
- selected profile
- selected site setting
- accepted transform artifacts
- feedback events

### What may go to AI providers

- redacted structural summaries
- optional screenshot when policy allows it

### Sensitive-site defaults

Remote planning is blocked by default for likely login, payment, banking, mail, healthcare, government, password, and internal enterprise contexts.

## 한국어

Morph UI는 privacy 동작을 명시적으로 드러내도록 설계되어 있습니다.

### Privacy mode

- `strict-local`
  원격 planning 금지, 로컬 캐시 transform만 허용
- `local-first`
  기본 모드, 로컬 분석과 캐시를 우선하고 정책이 허용할 때만 원격 planning 허용
- `sync-enabled`
  local-first와 같은 planning 정책에 원격 artifact sync가 추가됨

### 로컬에만 남는 것

- 사이트 enable 플래그
- 선택된 프로필
- 동기화 설정
- 진단 정보
- 로컬 transform 캐시

### 서버로 갈 수 있는 것

- redacted page summary
- fingerprint
- 선택한 프로필
- 선택한 사이트 설정
- 승인된 transform artifact
- feedback event

### AI provider로 갈 수 있는 것

- redacted structural summary
- 정책이 허용하는 경우의 선택적 screenshot

### 민감 사이트 기본 정책

로그인, 결제, 은행, 메일, 헬스케어, 정부, 비밀번호, 사내 시스템으로 보이는 맥락에서는 원격 planning이 기본적으로 차단됩니다.
