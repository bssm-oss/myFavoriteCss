# Documentation agent instructions

## English

These instructions apply to `docs/`.

### Mission

Documentation in this repository is part of the product operating surface. It should be accurate enough that another engineer can set up, verify, and debug Morph UI without guessing.

### Hard rules

- keep docs aligned with implemented behavior
- keep docs bilingual with `## English` and `## 한국어`
- prefer concrete statements over marketing language
- do not describe removed backend behavior as if it still exists
- do not claim unsupported provider capabilities
- keep privacy wording accurate and specific

### Required doc shape

Every substantial doc should answer most of these:

- what this area is
- why it exists
- what the critical constraints are
- what a reader should do next
- where related docs live

### Maintenance expectations

- update `docs/README.md` when adding or removing major docs
- cross-link setup, privacy, provider, troubleshooting, and verification docs when a change affects more than one
- when user workflow changes, update both high-level and step-by-step guides
- when labels in the UI change, update docs to match the exact user-facing text

### Style

- use short sections with meaningful headings
- keep lists flat and operational
- include commands and paths when useful
- distinguish current behavior from future ideas
- say what is local, what is sent to providers, and what is not supported

### Verification

- for doc-only changes, verify links, file names, and consistency
- if docs describe a changed workflow, read the implementation before writing
- if docs mention tests or commands, make sure the command names still exist

## 한국어

이 지침은 `docs/`에 적용됩니다.

### 미션

이 저장소의 문서는 제품 운영 surface의 일부입니다. 다른 엔지니어가 추측 없이 Morph UI를 설정, 검증, 디버그할 수 있을 정도로 정확해야 합니다.

### 강한 규칙

- 문서는 실제 구현 동작과 맞아야 합니다
- 문서는 `## English`, `## 한국어`를 유지합니다
- 마케팅 문구보다 구체적인 설명을 사용합니다
- 제거된 백엔드 동작을 아직 존재하는 것처럼 쓰지 않습니다
- 미지원 provider capability를 지원하는 것처럼 쓰지 않습니다
- privacy 문구는 정확하고 구체적으로 유지합니다

### 문서가 가져야 하는 기본 형태

중요한 문서는 가능하면 다음 질문 대부분에 답해야 합니다.

- 이 영역이 무엇인지
- 왜 존재하는지
- 핵심 제약이 무엇인지
- 다음에 무엇을 해야 하는지
- 관련 문서가 어디 있는지

### 유지보수 기대사항

- 주요 문서를 추가/삭제하면 `docs/README.md`를 갱신합니다
- setup, privacy, provider, troubleshooting, verification 문서가 함께 영향 받으면 상호 링크를 갱신합니다
- 사용자 워크플로우가 바뀌면 상위 가이드와 단계별 가이드를 함께 갱신합니다
- UI 라벨이 바뀌면 문서도 실제 사용자 문구와 정확히 맞춥니다

### 스타일

- 짧고 의미 있는 제목의 섹션을 사용합니다
- 리스트는 평평하고 운영 중심으로 씁니다
- 필요하면 명령어와 경로를 넣습니다
- 현재 동작과 미래 아이디어를 구분합니다
- 무엇이 로컬인지, 무엇이 provider로 가는지, 무엇이 미지원인지 분명히 씁니다

### 검증

- 문서 전용 변경은 링크, 파일명, 일관성을 확인합니다
- 문서가 변경된 워크플로우를 설명하면 먼저 구현을 다시 읽습니다
- 문서에 테스트나 명령어를 적었다면 그 명령 이름이 아직 존재하는지 확인합니다
