# Morph UI docs

This folder contains the engineering documentation for Morph UI. The goal is that a new engineer can understand the architecture, run the system locally, inspect the contract boundaries, and know exactly what is intentionally unsupported.

## Reading order

If you are new to the codebase, read in this order:

1. [architecture.md](./architecture.md)
2. [extension-runtime.md](./extension-runtime.md)
3. [transform-plan-spec.md](./transform-plan-spec.md)
4. [cache-and-fingerprint.md](./cache-and-fingerprint.md)
5. [privacy-and-data-flow.md](./privacy-and-data-flow.md)
6. [provider-capabilities.md](./provider-capabilities.md)
7. [api-contracts.md](./api-contracts.md)
8. [data-model.md](./data-model.md)
9. [local-development.md](./local-development.md)
10. [testing-fixtures.md](./testing-fixtures.md)

## Document index

### System design

- [architecture.md](./architecture.md)
  Monorepo structure, component responsibilities, and the end-to-end product flow.
- [extension-runtime.md](./extension-runtime.md)
  MV3 runtime surfaces, messaging, permissions, and transform lifecycle in the extension.
- [transform-plan-spec.md](./transform-plan-spec.md)
  Shared schema contract for AI planning, safe compilation rules, and operation constraints.

### Data and cache

- [cache-and-fingerprint.md](./cache-and-fingerprint.md)
  Local/remote cache layers, similarity scoring, invalidation, and conservative reapply rules.
- [data-model.md](./data-model.md)
  Postgres tables, indexes, seeded records, and how persisted state maps to product behavior.

### Security and privacy

- [privacy-and-data-flow.md](./privacy-and-data-flow.md)
  What stays local, what reaches the server, what can reach providers, and when remote planning is blocked.
- [provider-capabilities.md](./provider-capabilities.md)
  Capability matrix, honest unsupported paths, and product-auth versus provider-auth separation.

### Integrations and local workflow

- [api-contracts.md](./api-contracts.md)
  Implemented server endpoints and the shared request/response types behind them.
- [local-development.md](./local-development.md)
  Setup, env vars, unpacked extension workflow, and daily development commands.
- [testing-fixtures.md](./testing-fixtures.md)
  Fixture pages, test coverage strategy, and how to run unit, integration, and E2E checks.
- [../tests/README.md](../tests/README.md)
  Root-level human-run smoke assets and dated execution notes.

## Documentation conventions

- Contract shapes are sourced from `packages/shared`.
- Runtime statements are written to match the current code, not an aspirational roadmap.
- Unsupported behavior is documented explicitly rather than hidden behind vague wording.
