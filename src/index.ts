/* src/index.ts – To-Do ++ Application Logic (TypeScript) */
interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string | null;
}

// Load tasks from LocalStorage or default empty array
const STORAGE_KEY = 'todo-plus-v1';
function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    console.warn('Could not save tasks to LocalStorage');
  }
}

// DOM elements
const form = document.getElementById('new-task-form') as HTMLFormElement;
const input = document.getElementById('task-input') as HTMLInputElement;
const list = document.getElementById('task-list') as HTMLUListElement;

// State
let tasks = loadTasks();

// Escape HTML special characters
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render all tasks with sorting and animations
function renderTasks(tasksToRender: Task[]): void {
  // Sort: completed at bottom, then by due date
  const sorted = [...tasksToRender].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    if (a.dueDate && b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  // Clear list
  list.innerHTML = '';

  sorted.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    const dueBadge = task.dueDate
      ? `<span class="due-badge">Due: ${task.dueDate}</span>`
      : '';

    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="toggle-complete" ${task.completed ? 'checked' : ''} aria-label="Mark task ${task.completed ? 'undone' : 'done'}"/>
        <span class="task-text">${escapeHtml(task.text)}</span>
      </div>
      ${dueBadge}
    `;

    const checkbox = li.querySelector('.toggle-complete') as HTMLInputElement;
    checkbox.addEventListener('change', () => {
      task.completed = !task.completed;
      saveTasks(tasks);
      renderTasks(tasks);
    });

    list.appendChild(li);
  });
}

// Add new task
form.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const newTask: Task = {
    id: crypto.randomUUID(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks(tasks);
  input.value = '';
});

// Initial render
renderTasks(tasks);
addTaskCss();

// Keyboard shortcuts
input.addEventListener('keydown', (e: KeyboardEvent) => {
  // Ctrl+Enter to add task
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
  // Enter to edit task (when focused on task text, not on checkbox)
  if (e.key === 'Enter' && !e.ctrlKey) {
    e.preventDefault();
    const li = e.target.closest('.task-item');
    if (li) {
      const textSpan = li.querySelector('.task-text') as HTMLSpanElement;
      const checkbox = li.querySelector('.toggle-complete') as HTMLInputElement;
      if (textSpan && !checkbox.checked) {
        enableEdit(textSpan, tasks.find(t => t.id === li.dataset!.id!)!);
      }
    }
  }
});

// Delete task function
function deleteTask(taskId: string): void {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks(tasks);
  renderTasks(tasks);
}

// Inline edit task
function enableEdit(span: HTMLSpanElement, task: Task): void {
  const originalText = span.textContent || task.text;
  span.contentEditable = 'true';
  span.focus();
  span.style.outline = '2px solid var(--primary)';
  span.style.borderRadius = '4px';

  span.addEventListener('blur', () => {
    span.contentEditable = 'false';
    span.style.outline = '';
    span.style.borderRadius = '';
    const newText = (span.textContent || '').trim();
    if (newText && newText !== originalText) {
      task.text = newText;
      saveTasks(tasks);
      renderTasks(tasks);
    } else {
      span.textContent = originalText;
    }
  }, { once: true });
}

// Add CSS for task styling and animations
function addTaskCss(): void {
  let style = document.getElementById('task-styles') as HTMLStyleElement;
  if (!style) {
    style = document.createElement('style');
    style.id = 'task-styles';
    style.textContent = `
      /* Task Item Styles */
      .task-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .task-list li {
        background: var(--surface);
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: background 0.15s, transform 0.2s;
        font: interpolate-size var(--font-size) var(--font-family);
        opacity: 1;
        transform: translateX(0);
      }
      .task-list li:hover {
        background: #F9FAFB;
      }
      .task-list li.completed {
        text-decoration: line-through;
        color: var(--muted);
      }
      .task-list li .task-content {
        flex: 1;
        margin-right: 12px;
        display: flex;
        align-items: center;
      }
      .task-list li .toggle-complete {
        margin-right: 8px;
        cursor: pointer;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
      }
      .task-list li .task-text {
        flex: 1;
        margin: 0 8px;
        min-width: 0;
        display: inline-block;
      }
      .task-list li .due-badge {
        font-size: 12px;
        color: var(--muted);
        margin-left: 8px;
        flex-shrink: 0;
      }
      /* Add Task Form */
      .form {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }
      .form input {
        flex: 1;
        padding: 8px 12px;
        font-size: 16px;
        border: 1px solid #D1D5DB;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .form input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
      }
      .form button {
        background: var(--primary);
        color: white;
        border: none;
        padding: 0 16px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
        white-space: nowrap;
      }
      .form button:hover {
        background: #2563EB; /* primary 600 */
      }
      /* Accessibility */
      :focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }
}