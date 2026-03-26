# Permissions and security

## English

Morph UI keeps extension permissions narrow and avoids store-hostile behaviors.

### Declared permissions

- `storage`
- `sidePanel`
- `scripting`
- `tabs`

### Host permissions

Host access is optional and requested per origin for user pages. Morph UI also ships with fixed host permissions for the official provider APIs it must call directly:

- `https://api.openai.com/*`
- `https://generativelanguage.googleapis.com/*`

### Security posture

The extension avoids:

- remote hosted executable code
- `eval`
- `new Function`
- cookie scraping
- hidden provider web-session reuse
- arbitrary provider-generated code execution

### Runtime safety

- CSS is filtered against an allowlist
- structural apply can be downgraded or aborted
- transforms are reversible
- sensitive form regions are guarded

## 한국어

Morph UI는 확장 권한을 좁게 유지하고, 스토어 심사에 불리한 동작을 피합니다.

### 선언된 권한

- `storage`
- `sidePanel`
- `scripting`
- `tabs`

### Host permission

사용자 페이지에 대한 호스트 접근은 optional이며 origin 단위로 요청됩니다. 대신 Morph UI가 직접 호출해야 하는 공식 provider API에 대해서는 다음의 고정 host permission이 포함됩니다.

- `https://api.openai.com/*`
- `https://generativelanguage.googleapis.com/*`

### 보안 자세

확장은 다음을 피합니다.

- 원격 호스팅 실행 코드
- `eval`
- `new Function`
- cookie scraping
- 숨겨진 provider 웹 세션 재사용
- provider가 만든 임의 코드 실행

### 런타임 안전성

- CSS는 allowlist를 거칩니다
- 구조적 apply는 downgrade 또는 abort 될 수 있습니다
- transform은 되돌릴 수 있습니다
- 민감한 form 영역은 보호됩니다
