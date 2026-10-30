import { createContext, useContext, useEffect, useReducer } from 'react';
import { taskReducer, initialState } from '../reducer/taskReducer.js';

const TaskContext = createContext(null);
const STORAGE_KEY = 'taskManager.tasks';

function init() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...initialState, tasks: JSON.parse(stored) };
    }
  } catch {
    // corrupt or unavailable storage — fall back to seed data
  }
  return initialState;
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState, init);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  }, [state.tasks]);

  const addTask = (task) => dispatch({ type: 'ADD_TASK', payload: task });
  const deleteTask = (id) => dispatch({ type: 'DELETE_TASK', payload: id });
  const updateTask = (task) => dispatch({ type: 'UPDATE_TASK', payload: task });
  const setFilter = (filter) => dispatch({ type: 'SET_FILTER', payload: filter });

  const filteredTasks =
    state.filter === 'all'
      ? state.tasks
      : state.tasks.filter((task) => task.status === state.filter);

  const value = {
    tasks: state.tasks,
    filteredTasks,
    filter: state.filter,
    addTask,
    deleteTask,
    updateTask,
    setFilter,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook lives alongside its provider
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
