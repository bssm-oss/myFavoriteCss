# Permissions and security

## English

Morph UI keeps extension permissions narrow and avoids store-hostile behaviors.

### Declared permissions

- `storage`
- `sidePanel`
- `scripting`
- `tabs`
- `identity`

### Host permissions

Host access is optional and requested per origin. The product does not ship with broad always-on host permissions.

### Security posture

The extension and backend avoid:

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
- `identity`

### Host permission

호스트 접근은 optional이며 origin 단위로 요청됩니다. 제품은 광범위한 상시 host permission을 기본으로 두지 않습니다.

### 보안 자세

확장과 백엔드는 다음을 피합니다.

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
