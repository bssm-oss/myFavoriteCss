# Test assets agent instructions

## English

These instructions apply to `tests/`.

### Mission

This directory stores human-readable verification assets. It is for evidence, checklists, and manual notes, not for colocated automated test source.

### Hard rules

- keep automated test source near the code, not here
- keep manual notes dated when they represent a concrete run
- keep evidence references stable and descriptive
- update smoke notes when user-visible flows materially change
- do not leave ambiguous scratch notes here

### What belongs here

- smoke checklists
- manual verification notes
- evidence indices
- links to screenshots or captured outputs
- summaries of what was actually observed in a run

### What does not belong here

- Vitest source files
- Playwright spec files that belong near the app under test
- temporary debugging notes with no verification value
- copied log dumps with no explanation

### Naming expectations

- use dates for run-specific notes
- use descriptive names for evidence folders
- prefer explicit page or flow names over vague labels like `misc`

### Verification expectations

- if a manual flow changes, update the checklist
- if new evidence paths are added, update the relevant index doc
- if fixture behavior changes, make sure notes still point to the right page and expectation

## 한국어

이 지침은 `tests/`에 적용됩니다.

### 미션

이 디렉터리는 사람이 읽는 검증 자산을 저장하는 곳입니다. colocated 자동 테스트 소스가 아니라 evidence, checklist, manual note를 두는 위치입니다.

### 강한 규칙

- 자동 테스트 소스는 여기 말고 코드 근처에 둡니다
- 구체적인 실행 기록에는 날짜를 붙입니다
- evidence 참조는 안정적이고 설명적으로 유지합니다
- 사용자 가시 흐름이 크게 바뀌면 smoke note를 갱신합니다
- 의미 없는 임시 메모를 여기에 남기지 않습니다

### 여기에 들어가야 하는 것

- smoke checklist
- 수동 검증 노트
- evidence 인덱스
- 스크린샷이나 캡처 산출물 링크
- 실제 실행에서 무엇을 관찰했는지에 대한 요약

### 여기에 두지 말아야 하는 것

- Vitest 소스 파일
- 테스트 대상 앱 근처에 있어야 할 Playwright spec 파일
- 검증 가치가 없는 임시 디버깅 메모
- 설명 없이 복사한 로그 덤프

### 네이밍 기대사항

- 실행별 노트에는 날짜를 사용합니다
- evidence 폴더는 설명적인 이름을 사용합니다
- `misc` 같은 모호한 라벨보다 페이지나 흐름 이름을 직접 씁니다

### 검증 기대사항

- 수동 흐름이 바뀌면 checklist를 갱신합니다
- 새 evidence 경로가 추가되면 관련 index 문서를 함께 갱신합니다
- fixture 동작이 바뀌면 note가 여전히 올바른 페이지와 기대를 가리키는지 확인합니다
