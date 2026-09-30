# Architecture

## High-Level Architecture
- **Frontend**: React (or vanilla JS) with component-based UI.
- **Backend** (optional): Node.js with Express, or Firebase for serverless.
- **Storage**: LocalStorage for offline-first, optional sync with cloud.

## Tech Stack
- **Language**: TypeScript (recommended for type safety)
- **UI Library**: React 18 + Hooks
- **State Management**: React Context or Redux Toolkit (if complex)
- **Styling**: CSS Modules or Tailwind CSS (per style guide)
- **Build Tool**: Vite for fast dev server and production build
- **Package Manager**: npm

## Data Flow
1. User interacts with UI components.
2. State updates in React component.
3. State changes trigger re-render.
4. LocalStorage reads/writes persisted data on mount/unmount.
5. (Optional) API calls to backend for sync.

## File Structure (suggested)
```
src/
  components/   # UI components (TaskList, TaskItem, AddTaskForm)
  hooks/        # Custom hooks (useTaskStorage)
  stores/       # Global state (if using Redux)
  utils/        # Helper functions (date formatting, localStorage wrapper)
  App.tsx       # Root component
  index.tsx     # Entry point
public/
  index.html
package.json
```

## Key Decisions
- Use TypeScript for maintainability.
- LocalStorage for simplicity; can swap to Firebase later.
- React for declarative UI.