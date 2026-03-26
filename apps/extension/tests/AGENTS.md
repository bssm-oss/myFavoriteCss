# Extension test agent instructions

## English

These instructions apply to `apps/extension/tests`.

- keep unit tests close to runtime helpers and behavior they protect
- prefer deterministic fixture-driven assertions
- when behavior crosses browser boundaries, add or update Playwright coverage
- test names should describe user-visible guarantees, not only implementation trivia

## 한국어

이 지침은 `apps/extension/tests`에 적용됩니다.

- unit test는 보호하려는 런타임 helper와 동작 가까이에 둡니다
- deterministic fixture 기반 assertion을 선호합니다
- 브라우저 경계를 넘는 동작이면 Playwright 커버리지를 추가하거나 갱신합니다
- 테스트 이름은 구현 세부보다 사용자 가시 보장을 설명해야 합니다
