# Task Manager

This is a React app for viewing, adding, editing, deleting, and filtering tasks. State is managed with `useReducer` and shared app-wide via `useContext`, with two routes for a task list and a task detail view.

## Features

- **Task list** (`/tasks`) — shows every task with its title, status badge, and priority badge, plus a "Showing X of Y tasks" count.
- **Task detail** (`/tasks/:id`) — shows a single task's full description and all fields; shows a "Task not found" message for an invalid id.
- **Filter by status** — a filter bar (All / To Do / In Progress / Done) narrows the list; the active filter is highlighted.
- **Add a task** — a controlled form (title, description, status, priority); the Title field is required (marked with a red `*`), the submit button is disabled until it's filled in, and the form clears itself after a successful add.
- **Edit a task** — an inline edit form on the detail page, pre-filled from the current task, with Save/Cancel.
- **Delete a task** — a Delete button on each list row, guarded by a `window.confirm()` prompt.
- **Persistence** — tasks survive a page reload via `localStorage` (see below).

## Task data shape

```js
{
  id: 1,
  title: 'Set up project repository',
  description: 'Initialise a Git repo, add a .gitignore, and push the first commit.',
  status: 'done',    // 'todo' | 'in-progress' | 'done'
  priority: 'high',  // 'low' | 'medium' | 'high'
}
```

## State management

All task state lives in one place: [`src/reducer/taskReducer.js`](src/reducer/taskReducer.js) + [`src/context/TaskContext.jsx`](src/context/TaskContext.jsx).

### Reducer (`taskReducer.js`)

`initialState` is `{ tasks: initialTasks, filter: 'all' }` (seed data from [`data/Tasks.js`](data/Tasks.js)). It handles four actions:

| Action type | Payload | Effect |
|---|---|---|
| `ADD_TASK` | task object (no `id`) | Appends a new task, with the id generated from the current max id in `tasks` |
| `DELETE_TASK` | task `id` (bare value) | Removes the matching task from `tasks` |
| `UPDATE_TASK` | task object (with `id`) | Merges the changes into the matching task |
| `SET_FILTER` | `'all'` \| `'todo'` \| `'in-progress'` \| `'done'` | Updates `filter` |

### Context (`TaskContext.jsx`)

`TaskProvider` wraps `useReducer(taskReducer, initialState, init)` and exposes, via the `useTasks()` hook:

- `tasks` — the full task list
- `filteredTasks` — **derived during render** from `tasks` + `filter` (not stored in reducer state, so it's always in sync and never duplicated)
- `filter` — the current status filter
- `addTask(task)`, `deleteTask(id)`, `updateTask(task)`, `setFilter(filter)` — thin dispatch wrappers so components never touch action-type strings directly

`TaskContext` itself is not exported — components must go through `useTasks()`, which throws if used outside a `TaskProvider`.

### Persistence (`localStorage`)

Tasks survive a page reload without a backend:

- **Lazy `useReducer` initializer** — `useReducer`'s third argument, `init()`, runs once on mount. It reads the `taskManager.tasks` key from `localStorage`; if present and valid, it seeds `state.tasks` from it; otherwise (missing, or corrupt JSON) it falls back to the seed data in `initialState`.
- **`useEffect`** — writes `state.tasks` back to `localStorage` (JSON-stringified) every time it changes, so every add/delete/update is saved immediately.

Only `tasks` persists — `filter` always resets to `'all'` on a fresh load. Data is scoped to the browser origin (`localhost:<port>`) and is unaffected by restarting the dev server; it only clears via the browser's own storage-clearing UI/DevTools or an explicit `localStorage.removeItem('taskManager.tasks')`.


### Showing X of Y tasks
[`TaskList.jsx`](src/component/TaskList.jsx) renders `Showing {filteredTasks.length} of {tasks.length} tasks` above the rows. It comes from `TaskContext`'s `filteredTasks` (derived at render from `tasks` + `filter`) and the full `tasks` array, so it stays in sync automatically as the filter or task list changes — no extra state to keep in sync by hand. It's shown even when the filtered result is empty, this is *why* the list looks empty (0 of Y, vs. Y of Y with no matches).

### Add Task button disabled for required fields
— Title is the only mandatory field (status and priority are `<select>`s that always have a value, so they can't be "empty"), marked with a red `*` next to its label. In [`AddTaskForm.jsx`](src/component/AddTaskForm.jsx), the submit button has `disabled={!title.trim()}`, so it's greyed out and inert until real (non-whitespace) text is entered. The same `title.trim()` guard is also checked in `handleSubmit`, so pasted whitespace or a race between disabling and clicking can't slip an empty task through.

### Persisting of tasks in `localStorage` to survive page reload
 This is done using using both mechanisms together in [`TaskContext.jsx`](src/context/TaskContext.jsx): a lazy `init()` function passed as `useReducer`'s third argument reads the `taskManager.tasks` key once on mount (falling back to the seed data if the key is missing or the JSON is corrupt), and a `useEffect` keyed on `state.tasks` writes the current list back to that key on every change. Only `tasks` persists — `filter` intentionally resets to `'all'` on each fresh load. See the [Persistence](#persistence-localstorage) section above for the full breakdown.

### `UPDATE_TASK` action and an inline edit form
In `taskReducer.js` a `UPDATE_TASK` case is used (with payload: a task object carrying `id` and the changed fields, merged into the matching task), exposed from `TaskContext` as `updateTask(task)`. [`TaskDetailPage.jsx`](src/component/TaskDetailPage.jsx) adds an "Edit" button that switches the read-only view into a form (same fields/validation as `AddTaskForm`: required title, disabled Save button while empty) pre-filled from the current task; Save calls `updateTask` and returns to the read view, Cancel discards the changes.

## Routing

Set up in [`src/App.jsx`](src/App.jsx) with `react-router-dom` (`BrowserRouter` + `Routes`, declarative mode — no loaders/actions needed):

| Path | Component | Notes |
|---|---|---|
| `/` | — | Redirects to `/tasks` |
| `/tasks` | `TaskListPage` | List + filter bar + add-task form |
| `/tasks/:id` | `TaskDetailPage` | Full task detail (and inline edit) |
| `*` (anything else) | — | Redirects to `/tasks` |

`Header` is rendered once, above `<Routes>`, so it persists across every page.

## Components

| Component | Responsibility |
|---|---|
| `Header` | Shows the app name and a nav link, on every page |
| `TaskListPage` | Composes `FilterBar`, `AddTaskForm`, and `TaskList` for the `/tasks` route |
| `FilterBar` | Four status buttons; reads `filter`/calls `setFilter` from context; highlights the active one |
| `AddTaskForm` | Controlled form (title/description/status/priority); calls `addTask`; clears on success |
| `TaskList` | Renders `filteredTasks` as rows (title linking to `/tasks/:id`, status badge, priority badge, Delete button); shows a task count and empty-state messages |
| `TaskDetailPage` | Reads `id` via `useParams`, finds the task via `useTasks()`, displays all fields or "Task not found"; includes an inline edit form using `updateTask` |

## Screenshots

All major features are captured in detail in accompanying file   [`task-manager-screenshots.html`](task-manager-screenshots.html). This file is at same folder level as README file.

## Tech stack

- [React 19](https://react.dev/) with the React Compiler enabled (auto-memoization — no manual `useCallback`/`useMemo` needed)
- [Vite 8](https://vite.dev/) for dev server and build
- [react-router-dom 7](https://reactrouter.com/) for routing
- Plain CSS (`src/App.css`, `src/index.css`) with CSS custom properties for light/dark theming via `prefers-color-scheme`

## Project structure

```
data/
  Tasks.js               # seed task data
src/
  component/
    Header.jsx
    FilterBar.jsx
    AddTaskForm.jsx
    TaskList.jsx
    TaskListPage.jsx
    TaskDetailPage.jsx
  context/
    TaskContext.jsx       # TaskProvider + useTasks hook
  reducer/
    taskReducer.js         # initialState + taskReducer
  App.jsx                 # provider + router + routes
  main.jsx                # Vite entry point
```

## Installing and Running

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview the production build locally
```

