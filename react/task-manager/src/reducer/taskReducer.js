import { initialTasks } from '../../data/Tasks.js';

export const initialState = {
  tasks: initialTasks,
  filter: 'all',
};

function getNextId(tasks) {
  return tasks.length === 0 ? 1 : Math.max(...tasks.map((task) => task.id)) + 1;
}

export function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask = { id: getNextId(state.tasks), ...action.payload };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task,
        ),
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
}
