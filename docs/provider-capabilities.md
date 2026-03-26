# Provider capabilities

Morph UI uses a provider abstraction so the extension UI can describe actual supported behavior rather than implying unsupported auth or billing paths.

## Capability fields

The current capability model includes:

- `canUseOfficialOAuth`
- `canUseServerOwnedApiKey`
- `supportsVisionInput`
- `supportsStructuredOutput`
- `supportsConsumerAccountReuse`
- `status`
- `supportedModes`
- `limitationReason`

The extension displays these capabilities rather than inventing consumer-account flows.

## Supported providers

### OpenAI

Current Morph UI posture:

- `canUseOfficialOAuth`: `false`
- `canUseServerOwnedApiKey`: `true`
- `supportsVisionInput`: `true`
- `supportsStructuredOutput`: `true`
- `supportsConsumerAccountReuse`: `false`
- `status`: limited but supported
- `supportedModes`: server-owned API

Meaning in practice:

- Morph UI can call the official OpenAI API from the server.
- Morph UI does not sign the end user into OpenAI from the extension.
- Morph UI does not scrape `chatgpt.com`.
- Morph UI does not reuse ChatGPT Plus.

### Gemini

Current Morph UI posture:

- `canUseOfficialOAuth`: exposed as a provider/platform capability
- `canUseServerOwnedApiKey`: `true`
- `supportsVisionInput`: `true`
- `supportsStructuredOutput`: `true`
- `supportsConsumerAccountReuse`: `false`
- `status`: limited but supported
- `supportedModes`: server-owned API

Meaning in practice:

- Morph UI can call the official Gemini API from the server.
- Morph UI does not reuse Gemini Advanced or browser sessions.
- Morph UI does not build brittle browser-cookie-based auth flows.

## Product auth is separate

Morph UI product authentication is not the same thing as provider authentication.

Current product auth:

- Google OAuth into Morph UI itself
- extension receives a one-time exchange code via `chrome.identity.launchWebAuthFlow`
- backend exchanges that for Morph UI access and refresh tokens

Current provider execution:

- provider secrets stay server-side
- server decides which provider adapter to call
- server normalizes provider responses back into the shared `TransformPlan`

## Why consumer account reuse is intentionally unsupported

The repository deliberately does not claim:

- "Sign in with ChatGPT"
- "Use your existing ChatGPT Plus plan"
- "Use your existing Gemini Advanced plan"

unless there is an official and implemented flow for that exact behavior.

The project avoids:

- cookie scraping
- session reuse tricks
- hidden browser tabs for auth theft
- undocumented provider web session coupling

## UI implications

The side panel should tell the user:

- which provider is selected
- whether structured output is available
- whether screenshots are supported
- whether official OAuth is available in this product path
- whether consumer account reuse is unsupported

This matters because the capability display is part of the trust model.

## Failure behavior

If a provider path is unsupported or misconfigured:

- the system returns a typed provider capability error
- the UI should explain the limitation
- the extension should not crash or pretend the provider is available

## Future extension points

The abstraction is built so official provider-account linking could be added later if a supported flow exists. That would be an additive capability, not a rewrite of the whole planning system.
