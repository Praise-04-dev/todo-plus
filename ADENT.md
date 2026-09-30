# Architecture Decisions

## Decision: Use TypeScript + React
- **Context**: Building a to-do app requires reliable state management and future scalability.
- **Decision**: Adopt TypeScript for type safety and React for component-driven UI.
- **Consequences**:
  - Positive: Early error detection, better developer experience, easier refactoring.
  - Negative: Slightly larger bundle size, learning curve for beginners.

## Decision: LocalStorage over Remote Backend
- **Context**: Target is a simple personal task manager; offline capability desired.
- **Decision**: Persist tasks in browser's LocalStorage; no external server required initially.
- **Consequences**:
  - Positive: Zero deployment, instant startup, privacy (data stays on device).
  - Negative: No sync across devices, data loss if browser data cleared.

## Decision: Vite as Build Tool
- **Context**: Need fast development feedback and modern tooling.
- **Decision**: Use Vite for dev server and production build.
- **Consequences**:
  - Positive: Near-instant server start, fast HMR, lean production bundles.
  - Negative: Configuring plugins may require additional setup.