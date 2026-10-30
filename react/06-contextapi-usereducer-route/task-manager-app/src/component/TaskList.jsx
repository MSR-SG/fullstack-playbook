import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';

function TaskList() {
  const { tasks, filteredTasks, deleteTask } = useTasks();

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      deleteTask(id);
    }
  };

  return (
    <div className="task-list-wrapper">
      <p className="task-count">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>

      {filteredTasks.length === 0 ? (
        <p className="empty-state">
          {tasks.length === 0
            ? 'No tasks yet. Add one above.'
            : 'No tasks match this filter.'}
        </p>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <div className="task-row" key={task.id}>
              <Link to={`/tasks/${task.id}`} className="task-row__title">
                {task.title}
              </Link>
              <span className={`badge badge--status-${task.status}`}>{task.status}</span>
              <span className={`badge badge--priority-${task.priority}`}>
                {task.priority}
              </span>
              <button
                type="button"
                className="delete-button"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
