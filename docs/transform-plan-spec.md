# Transform plan spec

## English

Providers must return strict JSON that validates against the shared `TransformPlan` schema.

### The plan is not

- arbitrary JavaScript
- raw HTML
- unbounded CSS text

### The plan is

- structured
- validated
- compiled locally
- reversible by design

### Main fields

- `version`
- `pageIntent`
- `summary`
- `confidence`
- `themeTokens`
- `globalCssRules`
- `nodeOperations`
- `overlays`
- `preservedSelectors`
- `blockedSelectors`
- `safetyFlags`
- `cacheHints`
- `rollbackPlanMetadata`

### Compilation rules

- CSS properties are allowlisted
- camelCase properties are normalized to kebab-case
- unsupported declarations are dropped
- compiled mode can be `full` or `conservative-css-only`

## 한국어

Provider는 공용 `TransformPlan` 스키마를 통과하는 strict JSON만 반환해야 합니다.

### plan이 아닌 것

- 임의 JavaScript
- raw HTML
- 제한 없는 CSS 텍스트

### plan이 되는 것

- 구조화된 데이터
- 검증 가능한 데이터
- 로컬에서 컴파일되는 데이터
- 기본적으로 되돌릴 수 있는 데이터

### 주요 필드

- `version`
- `pageIntent`
- `summary`
- `confidence`
- `themeTokens`
- `globalCssRules`
- `nodeOperations`
- `overlays`
- `preservedSelectors`
- `blockedSelectors`
- `safetyFlags`
- `cacheHints`
- `rollbackPlanMetadata`

### 컴파일 규칙

- CSS 속성은 allowlist 기반
- camelCase 속성은 kebab-case로 정규화
- 지원하지 않는 선언은 제거
- compiled mode는 `full` 또는 `conservative-css-only`
