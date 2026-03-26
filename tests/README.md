# Root test assets

## English

This folder is for human-readable verification assets above the colocated automated test suites.

What belongs here:

- smoke checklists
- manual regression notes
- dated local run records
- links to screenshots and evidence

What does not belong here:

- package unit tests
- extension Vitest or Playwright source files

Those stay near the code in:

- `apps/extension/tests`
- `packages/*/src/*.test.ts`

Related contributor workflow:

- [../CONTRIBUTING.md](../CONTRIBUTING.md)

## 한국어

이 폴더는 코드 근처에 있는 자동 테스트와 별개로, 사람이 읽는 검증 자산을 두는 곳입니다.

여기에 들어가는 것:

- smoke 체크리스트
- 수동 회귀 테스트 노트
- 날짜가 붙은 로컬 실행 기록
- 스크린샷과 증거 파일 링크

여기에 넣지 않는 것:

- package unit test
- extension Vitest/Playwright 소스 파일

그런 테스트들은 다음 위치에 그대로 둡니다.

- `apps/extension/tests`
- `packages/*/src/*.test.ts`

관련 기여 가이드:

- [../CONTRIBUTING.md](../CONTRIBUTING.md)
