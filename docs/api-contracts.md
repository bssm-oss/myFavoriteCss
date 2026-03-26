# API contracts

This document describes the currently implemented server API surface and the shared request and response contracts behind it.

The canonical schema definitions live in `packages/shared/src/api.ts`.

## Auth routes

### `GET /api/auth/google/start`

Purpose:

- starts Morph UI product sign-in via Google OAuth
- used by the extension through `chrome.identity.launchWebAuthFlow`

Query parameters:

- `extensionRedirectUri`
- `state`
- `codeChallenge`

Behavior:

- validates query params
- creates an auth flow record
- redirects to the Google authorization URL

### `GET /api/auth/google/callback`

Purpose:

- server-side OAuth callback endpoint

Behavior:

- validates `code` and `state`
- completes Google callback handling
- redirects back to the extension redirect URI with a one-time exchange code

### `POST /api/auth/session/exchange`

Purpose:

- exchanges a one-time extension code for Morph UI session tokens

Request:

```json
{
  "exchangeCode": "string",
  "codeVerifier": "string"
}
```

Response:

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "user@example.com",
    "name": "User",
    "avatarUrl": "https://example.com/avatar.png"
  },
  "expiresAt": "2026-03-26T00:00:00.000Z"
}
```

### `POST /api/auth/session/refresh`

Purpose:

- refreshes a Morph UI access token using the refresh token

Request:

```json
{
  "refreshToken": "string"
}
```

## Provider routes

### `GET /api/provider/capabilities`

Purpose:

- returns provider capability cards used by the extension UI

Response:

- array of capability objects
- includes provider status and limitation reason

## Profile routes

### `GET /api/profiles`

Purpose:

- returns all profiles belonging to the authenticated user

### `POST /api/profiles`

Purpose:

- upserts a profile for the authenticated user

Request body:

- `PreferenceProfile` schema from `packages/shared/src/preferences.ts`

Notes:

- `structuredPreferences` is strongly typed and validated
- `learnedAdjustments` is persisted as JSON

## Site settings routes

### `GET /api/site-settings`

Purpose:

- returns all site-level settings for the authenticated user

### `POST /api/site-settings`

Purpose:

- upserts the site setting for a given origin

Request body:

- `SiteSetting` schema from `packages/shared/src/preferences.ts`

## Cache routes

### `POST /api/cache/lookup`

Purpose:

- asks the remote per-user cache for the best artifact matching a page and profile

Request:

```json
{
  "origin": "https://example.com",
  "normalizedUrl": "https://example.com/docs/article",
  "pathSignature": "abcd1234",
  "profileId": "profile-id",
  "fingerprint": {}
}
```

Response:

```json
{
  "status": "hit",
  "similarity": 0.93,
  "cacheKey": "fingerprint-hash",
  "plan": {},
  "compiled": {},
  "revalidateAfter": "2026-03-26T00:00:00.000Z"
}
```

Status values:

- `hit`
- `stale-hit`
- `miss`

### `POST /api/cache/save`

Purpose:

- persists an accepted transform artifact to the remote per-user cache

Request body:

- origin and normalized URL
- profile ID
- fingerprint
- confidence and TTL
- logical plan
- compiled transform

Response:

- `204 No Content`

## Transform route

### `POST /api/transform/plan`

Purpose:

- asks the selected provider to generate a strict `TransformPlan`
- validates and compiles the result
- returns provider-independent transform data to the extension

Request body:

- `provider`
- `profile`
- `siteSetting`
- `pageSummary`
- `fingerprint`
- optional `screenshot`
- optional `previousPlan`

Response body:

```json
{
  "provider": "openai",
  "cacheStatus": "planned",
  "plan": {},
  "compiled": {},
  "cachePolicy": {
    "ttlSeconds": 604800,
    "allowRemoteSave": true,
    "revalidateAfterSeconds": 151200
  }
}
```

Rules:

- request body is parsed through Zod
- strict-local privacy mode blocks remote planning
- provider output is normalized back into the shared plan type
- compiled CSS is property-allowlisted

## Feedback route

### `POST /api/feedback`

Purpose:

- stores accept, reject, tweak, undo, or reset events
- may also append learned adjustments to a persisted profile

Request:

```json
{
  "eventType": "accept",
  "cacheKey": "optional-cache-key",
  "pageContext": {
    "origin": "https://example.com",
    "normalizedUrl": "https://example.com/docs/article",
    "profileId": "profile-id"
  },
  "payload": {}
}
```

## Error handling

Fastify routes currently use a single error handler that converts thrown validation or runtime errors into a `400` response body:

```json
{
  "error": "message"
}
```

This is intentionally simple for local development and extension integration.
