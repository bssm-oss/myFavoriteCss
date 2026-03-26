# Testing matrix

## English

| Area | Unit | E2E | Manual |
| --- | --- | --- | --- |
| URL normalization | yes | indirect | optional |
| Fingerprint similarity | yes | indirect | optional |
| Transform schema | yes | indirect | optional |
| Provider config validation | yes | no | yes |
| Extension load | no | yes | yes |
| Provider-assisted preview/apply | limited | manual-first | yes |
| Cache revisit behavior | limited | indirect | yes |

### Main commands

- `pnpm test`
- `pnpm test:e2e`
- `pnpm local:verify`

### Recommended manual pass

1. Validate and save one provider config.
2. Run preview on `fixtures/article`.
3. Apply and refresh.
4. Confirm the second load uses cache.
5. Undo and reset the site.

## 한국어

| 영역 | Unit | E2E | Manual |
| --- | --- | --- | --- |
| URL 정규화 | yes | 간접 | 선택 |
| Fingerprint 유사도 | yes | 간접 | 선택 |
| Transform schema | yes | 간접 | 선택 |
| Provider config validation | yes | no | yes |
| Extension 로드 | no | yes | yes |
| Provider-assisted preview/apply | 제한적 | 수동 우선 | yes |
| Cache 재방문 동작 | 제한적 | 간접 | yes |

### 주요 명령

- `pnpm test`
- `pnpm test:e2e`
- `pnpm local:verify`

### 권장 수동 확인 절차

1. provider config 하나를 Validate and save로 저장합니다.
2. `fixtures/article`에서 preview를 실행합니다.
3. apply 후 새로고침합니다.
4. 두 번째 로드에서 cache가 쓰이는지 확인합니다.
5. undo와 reset site를 실행합니다.
