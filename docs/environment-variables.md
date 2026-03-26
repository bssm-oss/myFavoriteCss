# Environment variables

## English

Morph UI extension-only mode does not require a backend `.env` file for normal local use.

### Current status

- provider API keys are configured in the extension UI, not in shell env
- local fixtures run without provider env vars
- `.env.example` remains only as a marker that backend env is no longer required

## 한국어

Morph UI extension-only 모드는 일반적인 로컬 사용에 백엔드 `.env` 파일이 필요하지 않습니다.

### 현재 상태

- provider API key는 shell env가 아니라 extension UI에서 설정합니다
- 로컬 fixture는 provider env 없이 실행됩니다
- `.env.example` 은 백엔드 env가 더 이상 필요 없다는 표시 역할만 남아 있습니다
