# Manual verification guide

## English

Use this guide when you want a human acceptance pass, not just automated tests.

### Recommended sequence

1. Run `pnpm local:dev`.
2. Load `apps/extension/dist` as an unpacked extension.
3. Open `http://localhost:5173/fixtures/article`.
4. Validate and save one provider config.
5. Enable the site.
6. Run `Preview`.
7. Confirm the page changes and the plan summary appears in the side panel.
8. Run `Apply`.
9. Refresh the page.
10. Confirm the page adapts again from local cache.
11. Run `Undo`.
12. Run `Reset site`.

### Expected observations

- provider card shows a validation timestamp
- cache status changes from `none` to a planned or hit state
- preview shows a plan summary and confidence
- apply keeps links and forms usable
- refresh on the same fixture should use the local fast path
- reset clears the site state and local artifact path

### Suggested fixture coverage

- `fixtures/article`
  content emphasis and centered reading flow
- `fixtures/docs`
  content width, sticky navigation, and docs layout behavior
- `fixtures/dashboard`
  density and chrome simplification
- `fixtures/form`
  safe behavior around forms and sensitive controls

### Failure notes to capture

- exact page
- profile used
- provider used
- privacy mode
- whether validation succeeded
- whether preview failed or apply failed
- whether refresh used cache

## 한국어

이 문서는 자동화 테스트가 아니라 사람이 직접 acceptance 확인을 할 때 사용하는 가이드입니다.

### 권장 순서

1. `pnpm local:dev`를 실행합니다.
2. `apps/extension/dist`를 unpacked extension으로 로드합니다.
3. `http://localhost:5173/fixtures/article`를 엽니다.
4. provider config 하나를 `Validate and save`로 저장합니다.
5. 사이트를 enable합니다.
6. `Preview`를 실행합니다.
7. 페이지가 변하고 side panel에 plan 요약이 보이는지 확인합니다.
8. `Apply`를 실행합니다.
9. 페이지를 새로고침합니다.
10. 로컬 캐시에서 다시 즉시 적용되는지 확인합니다.
11. `Undo`를 실행합니다.
12. `Reset site`를 실행합니다.

### 기대 관찰 결과

- provider 카드에 validation 시각이 표시됨
- cache status가 `none`에서 planned 또는 hit 상태로 바뀜
- preview에 plan 요약과 confidence가 표시됨
- apply 후에도 링크와 form이 계속 사용 가능함
- 같은 fixture에서 새로고침 시 local fast path가 사용됨
- reset 후 사이트 상태와 로컬 artifact 경로가 정리됨

### 권장 fixture 범위

- `fixtures/article`
  콘텐츠 강조와 centered reading 흐름 확인
- `fixtures/docs`
  content width, sticky navigation, docs 레이아웃 확인
- `fixtures/dashboard`
  density와 chrome 단순화 확인
- `fixtures/form`
  form과 민감 제어 주변의 안전 동작 확인

### 실패 시 기록하면 좋은 내용

- 정확한 페이지
- 사용한 프로필
- 사용한 provider
- privacy mode
- validation 성공 여부
- preview 실패인지 apply 실패인지
- 새로고침 시 cache가 사용되었는지
