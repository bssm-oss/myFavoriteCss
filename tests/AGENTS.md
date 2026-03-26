# Test assets agent instructions

## English

These instructions apply to `tests/`.

### Core responsibility

This directory is for human-readable verification assets, not the colocated automated test source.

### Hard rules

- keep automated test source near the code, not here
- keep manual notes dated when they represent a run
- keep evidence references stable and descriptive
- update smoke notes when user-visible flows materially change

### What belongs here

- smoke checklists
- manual verification notes
- evidence indices
- links to screenshots or captured outputs

### What does not belong here

- Vitest source files
- Playwright spec files that belong near the app under test
- arbitrary scratch notes with no verification value

## 한국어

이 지침은 `tests/`에 적용됩니다.

### 핵심 책임

이 디렉터리는 코드 근처의 자동 테스트 소스가 아니라, 사람이 읽는 검증 자산을 위한 곳입니다.

### 강한 규칙

- 자동 테스트 소스는 여기 말고 코드 근처에 둡니다.
- 실행 기록은 날짜를 붙여 유지합니다.
- evidence 참조는 안정적이고 설명적으로 유지합니다.
- 사용자 흐름이 크게 바뀌면 smoke note도 갱신합니다.

### 여기에 들어가야 하는 것

- smoke 체크리스트
- 수동 검증 노트
- evidence 인덱스
- 스크린샷이나 캡처 산출물 링크

### 여기에 두지 말아야 하는 것

- Vitest 소스 파일
- 테스트 대상 앱 근처에 있어야 할 Playwright spec 파일
- 검증 가치가 없는 임시 메모
