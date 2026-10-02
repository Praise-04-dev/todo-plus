/* src/index.ts – Taskly (To-Do ++) Application Logic (TypeScript) */
type Priority = 'high' | 'medium' | 'low';
type Filter = 'all' | 'today' | 'upcoming' | 'completed' | 'important';
type SortKey = 'due' | 'priority' | 'name';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string | null; // YYYY-MM-DD
  priority?: Priority;
  important?: boolean;
}

const STORAGE_KEY = 'todo-plus-v1';

function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function saveTasks(items: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    console.warn('Could not save tasks to LocalStorage');
  }
}

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const form = $<HTMLFormElement>('new-task-form');
const input = $<HTMLInputElement>('task-input');
const dateInput = $<HTMLInputElement>('date-input');
const priorityInput = $<HTMLSelectElement>('priority-input');
const sortInput = $<HTMLSelectElement>('sort-input');
const searchInput = $<HTMLInputElement>('search-input');
const list = $<HTMLUListElement>('task-list');
const emptyState = $<HTMLParagraphElement>('empty-state');
const listTitle = $<HTMLElement>('list-title');

let tasks = loadTasks();
let filter: Filter = 'all';
let query = '';

const FILTER_TITLES: Record<Filter, string> = {
  all: 'My Tasks', today: 'Today', upcoming: 'Upcoming', completed: 'Completed', important: 'Important',
};
const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function isoDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function todayIso(): string { return isoDate(new Date()); }
function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return isoDate(d);
}
function formatDue(iso: string): string {
  if (iso === todayIso()) return 'Today';
  if (iso === tomorrowIso()) return 'Tomorrow';
  const [, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function matchesFilter(t: Task): boolean {
  const today = todayIso();
  switch (filter) {
    case 'today': return t.dueDate === today;
    case 'upcoming': return !t.completed && !!t.dueDate && t.dueDate > today;
    case 'completed': return t.completed;
    case 'important': return !!t.important;
    default: return true;
  }
}

// Completed at bottom, then by the chosen sort (default: due date)
function compareTasks(a: Task, b: Task): number {
  if (a.completed !== b.completed) return a.completed ? 1 : -1;
  const key = sortInput.value as SortKey;
  if (key === 'priority') {
    const diff = PRIORITY_RANK[a.priority ?? 'medium'] - PRIORITY_RANK[b.priority ?? 'medium'];
    if (diff) return diff;
  } else if (key === 'name') {
    return a.text.localeCompare(b.text);
  }
  if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
  if (a.dueDate) return -1;
  if (b.dueDate) return 1;
  return 0;
}

function updateSummary(): void {
  const today = todayIso();
  const done = tasks.filter(t => t.completed).length;
  const counts: Record<Filter, number> = {
    all: tasks.length,
    today: tasks.filter(t => t.dueDate === today).length,
    upcoming: tasks.filter(t => !t.completed && !!t.dueDate && t.dueDate > today).length,
    completed: done,
    important: tasks.filter(t => t.important).length,
  };
  (Object.keys(counts) as Filter[]).forEach(k => { $(`count-${k}`).textContent = String(counts[k]); });
  $('stat-total').textContent = String(tasks.length);
  $('stat-done').textContent = String(done);
  $('stat-pending').textContent = String(tasks.length - done);

  const h = new Date().getHours();
  const part = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
  $('greeting-title').textContent = `Good ${part}, Praise!`;
}

function closeMenus(): void {
  document.querySelectorAll('.menu').forEach(m => m.remove());
}

function update(): void {
  saveTasks(tasks);
  renderTasks(tasks);
}


function renderTasks(all: Task[]): void {
  updateSummary();
  listTitle.textContent = FILTER_TITLES[filter];
  const q = query.trim().toLowerCase();
  const visible = all
    .filter(matchesFilter)
    .filter(t => !q || t.text.toLowerCase().includes(q))
    .sort(compareTasks);

  list.innerHTML = '';
  emptyState.hidden = visible.length > 0;

  visible.forEach(task => {
    const priority = task.priority ?? 'medium';
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    const overdue = !!task.dueDate && !task.completed && task.dueDate < todayIso();
    const due = task.dueDate
      ? `<span class="due-badge${overdue ? ' overdue' : ''}">📅 ${formatDue(task.dueDate)}</span>`
      : '<span class="due-badge"></span>';

    li.innerHTML = `
      <input type="checkbox" class="toggle-complete" ${task.completed ? 'checked' : ''} aria-label="Mark task ${task.completed ? 'undone' : 'done'}"/>
      <span class="task-text" tabindex="0">${escapeHtml(task.text)}</span>
      <span class="badge badge-${priority}">${priority[0].toUpperCase() + priority.slice(1)}</span>
      ${due}
      <button type="button" class="icon-btn star ${task.important ? 'on' : ''}" aria-label="${task.important ? 'Unmark' : 'Mark'} as important" aria-pressed="${!!task.important}">${task.important ? '★' : '☆'}</button>
      <button type="button" class="icon-btn more" aria-label="More actions" aria-haspopup="true">⋮</button>
    `;

    const textSpan = li.querySelector('.task-text') as HTMLSpanElement;

    (li.querySelector('.toggle-complete') as HTMLInputElement).addEventListener('change', () => {
      task.completed = !task.completed;
      update();
    });
    (li.querySelector('.star') as HTMLButtonElement).addEventListener('click', () => {
      task.important = !task.important;
      update();
    });
    (li.querySelector('.more') as HTMLButtonElement).addEventListener('click', (e) => {
      e.stopPropagation();
      const existing = li.querySelector('.menu');
      closeMenus();
      if (existing) return;
      const menu = document.createElement('div');
      menu.className = 'menu';
      menu.innerHTML = `
        <button type="button" data-action="edit">Edit</button>
        <button type="button" data-action="delete" class="danger">Delete</button>`;
      menu.addEventListener('click', (ev) => {
        const action = (ev.target as HTMLElement).dataset.action;
        if (action === 'edit') { closeMenus(); startEditing(textSpan, task); }
        if (action === 'delete') {
          tasks = tasks.filter(t => t.id !== task.id);
          update();
        }
      });
      li.appendChild(menu);
      (menu.querySelector('button') as HTMLButtonElement).focus();
    });
    textSpan.addEventListener('click', () => startEditing(textSpan, task));
    textSpan.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !textSpan.isContentEditable) { e.preventDefault(); startEditing(textSpan, task); }
    });

    list.appendChild(li);
  });
}

function startEditing(span: HTMLSpanElement, task: Task): void {
  if (span.isContentEditable) return;
  const originalText = task.text;
  span.contentEditable = 'true';
  span.focus();
  span.style.outline = '2px solid var(--primary)';
  span.style.borderRadius = '4px';

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
    if (e.key === 'Escape') { span.textContent = originalText; span.blur(); }
  };
  span.addEventListener('keydown', onKey);
  span.addEventListener('blur', () => {
    span.removeEventListener('keydown', onKey);
    span.contentEditable = 'false';
    span.style.outline = '';
    span.style.borderRadius = '';
    const newText = (span.textContent || '').trim();
    if (newText && newText !== originalText) {
      task.text = newText;
      update();
    } else {
      span.textContent = originalText;
    }
  }, { once: true });
}

// Add new task
form.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
    dueDate: dateInput.value || null,
    priority: priorityInput.value as Priority,
    important: false,
  });
  update();
  input.value = '';
  dateInput.value = '';
  priorityInput.value = 'medium';
  input.focus();
});

// Keyboard shortcut: Ctrl+Enter to add task
input.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    form.requestSubmit();
  }
});

// Filters
document.querySelectorAll<HTMLButtonElement>('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter as Filter;
    document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === btn));
    renderTasks(tasks);
  });
});

sortInput.addEventListener('change', () => renderTasks(tasks));
searchInput.addEventListener('input', () => { query = searchInput.value; renderTasks(tasks); });
document.addEventListener('click', closeMenus);
document.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenus(); });

// Initial render
renderTasks(tasks);

/* View management */
const viewNavs = document.querySelectorAll<HTMLButtonElement>('.view-nav');
const viewTasks = $('#view-tasks');
const viewCalendar = $('#view-calendar');
const viewSettings = $('#view-settings');
const bellBtn = $('#bell-btn');

const profileBtn = $('.profile');
const setName = $('#set-name');
const setTheme = $('#set-theme');
const clearCompletedBtn = $('#clear-completed');
const clearAllBtn = $('#clear-all');

function showView(view: 'tasks' | 'calendar' | 'settings'): void {
  viewNavs.forEach(b => b.classList.toggle('active', b.dataset.view === view));
  [viewTasks, viewCalendar, viewSettings].forEach(s => s.hidden = true);
  if (view === 'tasks') viewTasks.hidden = false;
  if (view === 'calendar') viewCalendar.hidden = false;
  if (view === 'settings') viewSettings.hidden = false;
}

viewNavs.forEach(btn => btn.addEventListener('click', () => {
  showView(btn.dataset.view as 'tasks' | 'calendar' | 'settings');
}));

// Initially show tasks view
showView('tasks');

// Bell button
bellBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const dot = bellBtn.querySelector('.dot') as HTMLSpanElement;
  const expanded = bellBtn.getAttribute('aria-expanded') === 'true';
  bellBtn.setAttribute('aria-expanded', String(!expanded));
  dot.hidden = !expanded;
  // Simple notification panel
  const panel = document.createElement('div');
  panel.className = 'menu';
  panel.innerHTML = '<button type="button" aria-label="Clear notifications">Clear</button>';
  bellBtn.appendChild(panel);
  panel.querySelector('button')?.focus();
});

// Close menus when clicking outside
document.addEventListener('click', (e) => {
  if (!bellBtn.contains(e.target as Node)) {
    const existing = bellBtn.querySelector('.menu');
    if (existing) existing.remove();
  }
});

// Profile button - focusable
profileBtn.addEventListener('click', () => {
  setName.value = 'Praise';
  setTheme.value = 'system';
  showView('settings');
});

// Settings form interactions
clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  update();
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('Delete all tasks?')) {
    tasks = [];
    update();
  }
});

setTheme.addEventListener('change', (e) => {
  const theme = (e.target as HTMLSelectElement).value;
  if (theme === 'dark') {
    document.documentElement.style.cssText = '--bg:#0F1226;--surface:#181C38;--text:#E8EAFE;--muted:#9CA3AF;--border:#272C54;--primary-soft:#262B5C;';
  } else if (theme === 'light') {
    document.documentElement.style.cssText = '--bg:#F6F7FD;--surface:#FFFFFF;--text:#111B4A;--muted:#6B7280;--border:#E6E8F2;--primary-soft:#E8EAFE;';
  } else {
    // system - remove inline styles
    document.documentElement.removeAttribute('style');
  }
});

// Initialize
update();
