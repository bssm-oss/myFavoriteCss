# Data model

## English

Morph UI uses Postgres through Drizzle.

### Main tables

- `users`
  Morph UI product users
- `auth_accounts`
  linked external auth identities
- `auth_flows`
  temporary Google OAuth continuation state
- `sessions`
  hashed Morph UI session tokens
- `profiles`
  user preference profiles
- `site_settings`
  per-origin behavior
- `path_overrides`
  optional path-level overrides
- `page_cache`
  per-user remote transform artifacts
- `transform_runs`
  provider-backed planning run records
- `feedback_events`
  user feedback on transforms
- `provider_capabilities`
  declared provider capability posture

### Important constraints

- `users.email` unique
- `(provider, provider_user_id)` unique on `auth_accounts`
- `(user_id, origin)` unique on `site_settings`
- `(user_id, origin, path_pattern)` unique on `path_overrides`
- `(user_id, origin, normalized_url, profile_id, fingerprint_version, path_signature)` unique on `page_cache`

### Seed data

The seed creates:

- a demo user
- provider capability rows
- seeded profiles including Reader Focus, Dense Catalog, Calm Dashboard, Docs Navigator, and Accessible Contrast

## 한국어

Morph UI는 Drizzle을 통해 Postgres를 사용합니다.

### 주요 테이블

- `users`
  Morph UI 제품 사용자
- `auth_accounts`
  외부 인증 연동 정보
- `auth_flows`
  Google OAuth 진행 상태
- `sessions`
  해시된 Morph UI 세션 토큰
- `profiles`
  사용자 선호 프로필
- `site_settings`
  origin 단위 설정
- `path_overrides`
  선택적 path 단위 오버라이드
- `page_cache`
  사용자별 원격 transform 아티팩트
- `transform_runs`
  provider planning 실행 기록
- `feedback_events`
  변환에 대한 사용자 피드백
- `provider_capabilities`
  provider capability 선언값

### 중요한 제약조건

- `users.email` 유니크
- `auth_accounts`의 `(provider, provider_user_id)` 유니크
- `site_settings`의 `(user_id, origin)` 유니크
- `path_overrides`의 `(user_id, origin, path_pattern)` 유니크
- `page_cache`의 `(user_id, origin, normalized_url, profile_id, fingerprint_version, path_signature)` 유니크

### 시드 데이터

시드는 다음을 생성합니다.

- 데모 사용자
- provider capability 레코드
- Reader Focus, Dense Catalog, Calm Dashboard, Docs Navigator, Accessible Contrast 프로필
