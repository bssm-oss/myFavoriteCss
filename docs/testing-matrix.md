# Testing matrix

## English

This document maps requirements to verification layers.

| Area | Unit | Integration | E2E | Manual |
| --- | --- | --- | --- | --- |
| Normalized URL logic | yes | no | indirect | optional |
| Fingerprint similarity | yes | no | indirect | optional |
| Transform plan schema | yes | yes | indirect | optional |
| Provider capability fallback | yes | yes | yes | optional |
| Cache lookup/save flow | yes | yes | yes | recommended |
| Side panel happy path | no | limited | yes | yes |
| Apply and undo on fixtures | no | limited | yes | yes |
| Site reset | no | limited | yes | yes |
| Privacy strict mode | yes | yes | yes | recommended |
| Screenshot disabled path | yes | yes | yes | recommended |

### Automated commands

- `pnpm test`
- `pnpm test:integration`
- `pnpm test:e2e`
- `pnpm local:verify`

### Manual checks still worth doing

- real Chrome profile load-unpacked flow
- Google auth flow against a real backend origin
- provider-backed planning with real API keys
- revisit behavior on a non-fixture SPA

## 한국어

이 문서는 요구사항과 검증 계층의 대응 관계를 정리합니다.

| 영역 | Unit | Integration | E2E | Manual |
| --- | --- | --- | --- | --- |
| Normalized URL 로직 | yes | no | 간접 | 선택 |
| Fingerprint 유사도 | yes | no | 간접 | 선택 |
| Transform plan schema | yes | yes | 간접 | 선택 |
| Provider capability fallback | yes | yes | yes | 선택 |
| Cache lookup/save 흐름 | yes | yes | yes | 권장 |
| Side panel happy path | no | 제한적 | yes | yes |
| Fixture에서 apply/undo | no | 제한적 | yes | yes |
| Site reset | no | 제한적 | yes | yes |
| Privacy strict mode | yes | yes | yes | 권장 |
| Screenshot disabled 경로 | yes | yes | yes | 권장 |

### 자동화 명령

- `pnpm test`
- `pnpm test:integration`
- `pnpm test:e2e`
- `pnpm local:verify`

### 여전히 수동 확인이 가치 있는 항목

- 실제 Chrome 프로필에서 load-unpacked 흐름
- 실제 백엔드 origin과 연결된 Google auth 플로우
- 실제 API key를 이용한 provider planning
- fixture가 아닌 SPA에서의 revisit 동작
