# User workflow guide

## English

### Happy path

1. Open the side panel on a normal `http` or `https` page.
2. Paste a provider API key and click `Validate and save`.
3. Wait for the provider card to show a stored key and a validation timestamp.
4. Enable the current site when the origin-level permission prompt appears.
5. Choose the profile you want to use for this site.
6. Run `Preview` and inspect the plan summary, confidence, and provider status.
7. Run `Apply` if the preview is acceptable.
8. Use `Undo` if the result is not acceptable.
9. Refresh or revisit the page to confirm local cache reuse.

### What each action means

- `Validate and save`
  confirms the API key and model against the official provider endpoint before storing them locally
- `Enable on this site`
  grants host access for the current origin and lets Morph UI analyze the page
- `Preview`
  applies a reversible preview path without treating it as final acceptance
- `Apply`
  commits the current preview or creates a fresh plan when no preview exists
- `Undo`
  rolls back the current transform session
- `Reset site`
  clears local artifacts and site-level settings for the current origin

### Best first-run sequence

1. Start with `fixtures/article`.
2. Use the default profile first.
3. Keep privacy mode on `local-first`.
4. Leave screenshots disabled unless you need them.
5. Confirm the second page load uses cache before trying more complex sites.

## 한국어

### 기본 사용 흐름

1. 일반적인 `http` 또는 `https` 페이지에서 side panel을 엽니다.
2. provider API key를 붙여 넣고 `Validate and save`를 클릭합니다.
3. provider 카드에 저장된 key와 검증 시각이 표시되는지 확인합니다.
4. origin 단위 permission prompt가 나오면 현재 사이트를 enable합니다.
5. 이 사이트에 적용할 프로필을 고릅니다.
6. `Preview`를 실행하고 plan 요약, confidence, provider 상태를 확인합니다.
7. 결과가 괜찮으면 `Apply`를 실행합니다.
8. 결과가 마음에 들지 않으면 `Undo`를 사용합니다.
9. 새로고침하거나 다시 방문해서 로컬 캐시가 재사용되는지 확인합니다.

### 각 액션의 의미

- `Validate and save`
  공식 provider endpoint에 key와 model을 확인한 뒤에만 로컬 저장합니다
- `Enable on this site`
  현재 origin에 대한 host access를 부여하고 Morph UI가 페이지를 분석할 수 있게 합니다
- `Preview`
  최종 확정 전 단계의 reversible preview 경로를 적용합니다
- `Apply`
  현재 preview를 확정하거나 preview가 없으면 새 plan을 만들어 적용합니다
- `Undo`
  현재 transform 세션을 롤백합니다
- `Reset site`
  현재 origin에 대한 로컬 artifact와 사이트 설정을 지웁니다

### 첫 실행 권장 순서

1. 먼저 `fixtures/article`에서 시작합니다.
2. 처음에는 기본 프로필을 그대로 사용합니다.
3. privacy mode는 `local-first`로 둡니다.
4. 정말 필요할 때만 screenshot을 허용합니다.
5. 더 복잡한 사이트를 보기 전에 두 번째 로드에서 cache가 동작하는지 먼저 확인합니다.
