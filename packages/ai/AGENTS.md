# AI package agent instructions

## English

These instructions apply to `packages/ai`.

- keep provider integration honest and direct
- keep request preparation and response validation schema-driven
- validate provider config before storing it in the extension
- treat model names and API behavior as time-sensitive
- prefer official provider endpoints and documented request shapes
- do not let provider-specific payload drift leak into app code when the package can normalize it

## 한국어

이 지침은 `packages/ai`에 적용됩니다.

- provider integration은 정직하고 direct하게 유지합니다
- 요청 준비와 응답 검증은 schema 기반으로 유지합니다
- extension에 저장하기 전에 provider config를 검증합니다
- model 이름과 API 동작은 time-sensitive한 것으로 취급합니다
- 공식 provider endpoint와 문서화된 요청 형태를 우선합니다
- package가 정규화할 수 있는 provider별 payload drift를 앱 코드로 새지 않게 합니다
