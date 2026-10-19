import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';

function TaskDetailPage() {
  const { id } = useParams();
  const { tasks, updateTask } = useTasks();
  const task = tasks.find((t) => t.id === Number(id));

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');

  if (!task) {
    return (
      <div className="task-detail">
        <p>Task not found.</p>
        <Link to="/tasks">Back to tasks</Link>
      </div>
    );
  }

  const handleEditClick = () => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setIsEditing(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    updateTask({
      id: task.id,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="task-detail">
        <Link to="/tasks" className="back-link">
          ← Back to tasks
        </Link>
        <form className="add-task-form" onSubmit={handleSubmit}>
          <h2>Edit task</h2>
          <label>
            <span>
              Title <span className="required-marker">*</span>
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>
          <div className="add-task-form__row">
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label>
              Priority
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <div className="task-detail__edit-actions">
            <button type="submit" disabled={!title.trim()}>
              Save
            </button>
            <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="task-detail">
      <Link to="/tasks" className="back-link">
        ← Back to tasks
      </Link>
      <h2>{task.title}</h2>
      <div className="task-detail__badges">
        <span className={`badge badge--status-${task.status}`}>{task.status}</span>
        <span className={`badge badge--priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>
      <p className="task-detail__description">{task.description}</p>
      <button type="button" className="edit-button" onClick={handleEditClick}>
        Edit
      </button>
    </div>
  );
}

export default TaskDetailPage;
