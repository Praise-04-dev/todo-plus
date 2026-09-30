# Product Requirements Document (PRD) — To-Do App

## 1. Vision
A simple, fast, and beautiful task manager that runs entirely in the browser, with optional cloud sync in the future.

## 2. Target Audience
- Individuals seeking a lightweight personal task tracker.
- Users who value privacy (no data sent to server by default).

## 3. Features (MVP)
- **Add Task**: Input field + button to create a new task with title and optional due date.
- **View Tasks**: List of tasks with title, due date, and completion toggle.
- **Edit Task**: Inline or modal edit of task details.
- **Delete Task**: Remove individual tasks.
- **Filter/Sort**: View all, active, completed tasks; sort by due date.
- **Local Persistence**: Tasks saved in LocalStorage across sessions.

## 4. User Stories
1. As a user, I can add a new task so that I can remember what I need to do.
2. As a user, I can mark a task as completed so that I can track progress.
3. As a user, I can edit a task’s title or due date so that I can update my plans.
4. As a user, I can delete a task so that I can remove outdated items.
5. As a user, I can filter tasks to show only active or completed items.
6. As a user, I can see tasks persisted across browser restarts.

## 5. Priorities (MoSCoW)
- **Must**: Add, view, toggle completion, local persistence.
- **Should**: Edit task, delete task, filter/sort.
- **Could**: Drag-and-drop reorder, dark mode, keyboard shortcuts.
- **Won't** (for MVP): Cloud sync, user accounts, collaboration.

## 6. Non-Functional Requirements
- **Performance**: Initial load < 2s, task addition < 200ms.
- **Accessibility**: WCAG AA contrast, keyboard navigable.
- **Responsiveness**: Works on mobile and desktop.
- **Reliability**: No data loss on normal browser close.

## 7. Milestones
- **M1** (Week 1): Project setup, styling, basic add/view tasks.
- **M2** (Week 2): Edit, delete, filter functionality.
- **M3** (Week 3): Polish, dark mode, accessibility audits.
- **M4** (Week 4): Export/import data, optional backend prototype.

## 8. Success Metrics
- Number of active users (if deployed).
- Task completion rate.
- User satisfaction survey.