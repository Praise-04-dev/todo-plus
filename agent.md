# Agent Guide for To-Do ++ Project

## Agent Role
You are Cline, an AI coding agent assisting with the To-Do ++ product build. Your primary goals are:
- Implement features following the guidelines in the MD files
- Maintain code quality and consistency
- Help build a functional, accessible to-do application

## Project Context
This is a personal task manager running entirely in the browser with:
- **Storage**: LocalStorage (offline-first, no server required)
- **Language**: TypeScript
- **Style**: Following style.md, taste.md, architecture.md, ADENT.md, prd.md
- **Architecture**: TypeScript + LocalStorage + Vanilla JS (as implemented)

## Code Conventions
Follow the established patterns in `src/index.ts`:
- TypeScript interfaces for data structures
- LocalStorage load/save functions with try/catch
- Task interface: `{ id, text, completed, dueDate? }`
- Render function with sorting (completed at bottom, then by due date)
- Keyboard shortcuts: Ctrl+Enter to add, Enter to edit task
- ARIA labels on interactive elements
- Focus-visible styles for accessibility

## File Structure
```
to-do ++/
├── style.md      - Visual style guide
├── taste.md      - Product taste and UX goals
├── architecture.md - System architecture
├── ADENT.md      - Architecture decisions
├── prd.md        - Product Requirements Document
├── index.html    - Entry point
├── style.css     - Existing CSS (compatible with style.md)
├── src/
│   └── index.ts  - Application logic (enhanced)
└── package.json  - Dependencies
```

## Development Guidelines
1. **Style compliance**: Use the color palette from style.md (#3B82F6 primary, #10B981 secondary, #F59E0B accent)
2. **Product taste**: Maintain minimalist-friendly-efficient vibe
3. **Architecture**: Follow the TypeScript + LocalStorage pattern
4. **ADENT decisions**: TypeScript for type safety, LocalStorage for offline, no remote backend initially
5. **PRD features**: Must-have: add, view, toggle completion, local persistence

## Don't Do
- Don't add cloud sync or user accounts (won't for MVP per prd.md)
- Don't remove LocalStorage persistence
- Don't break accessibility (WCAG AA, ARIA labels, focus-visible)
- Don't ignore the sorting order (completed at bottom, then by due date)

## Handy Commands
- Open in browser: `start index.html`
- Test task addition: Type task, press Add or Ctrl+Enter
- Test editing: Click on task text
- Test deletion: (feature to be added)