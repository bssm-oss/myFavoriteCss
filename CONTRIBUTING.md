# Contributing

## English

This repository expects small, reviewable changes with matching docs and verification.

### Workflow

1. Branch from `main`.
2. Keep commits small and purpose-specific.
3. Run the narrowest useful verification while developing.
4. Read [AGENTS.md](./AGENTS.md) and the nearest scoped `AGENTS.md` before making non-trivial changes.
5. Update docs when behavior, architecture, env, or operational assumptions change.
6. Update smoke notes or evidence when the user-facing flow materially changes.
7. Open a PR with a clear summary and explicit risk notes.

### Minimum verification before PR

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

If runtime behavior changed, also run:

- `pnpm test:integration`
- `pnpm test:e2e`

### Documentation expectations

- Root guides and `docs/` documents should stay bilingual where this repository already uses English and Korean sections.
- Add or update the nearest document instead of dropping important assumptions only into a PR body.

### Test asset expectations

- automated tests stay near the code
- human-readable smoke evidence stays in `tests/`

## 한국어

이 저장소는 작은 단위의 리뷰 가능한 변경과, 그에 맞는 문서 및 검증을 기대합니다.

### 작업 흐름

1. `main`에서 브랜치를 만듭니다.
2. 커밋은 작고 목적이 분명하게 유지합니다.
3. 개발 중에는 가장 좁지만 유의미한 검증을 실행합니다.
4. 규모 있는 변경 전에는 [AGENTS.md](./AGENTS.md) 와 가장 가까운 scoped `AGENTS.md`를 읽습니다.
5. 동작, 아키텍처, 환경변수, 운영 가정이 바뀌면 문서도 함께 갱신합니다.
6. 사용자 흐름이 바뀌면 smoke note나 evidence도 갱신합니다.
7. 명확한 요약과 위험 메모를 포함해 PR을 엽니다.

### PR 전 최소 검증

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

런타임 동작이 바뀌었다면 추가로 실행합니다.

- `pnpm test:integration`
- `pnpm test:e2e`

### 문서 기대사항

- 이 저장소에서 이미 사용 중인 English/Korean 섹션 구조를 유지합니다.
- 중요한 가정을 PR 본문에만 두지 말고 가장 가까운 문서에 반영합니다.

### 테스트 자산 기대사항

- 자동 테스트는 코드 근처에 둡니다.
- 사람이 읽는 smoke evidence는 `tests/`에 둡니다.
