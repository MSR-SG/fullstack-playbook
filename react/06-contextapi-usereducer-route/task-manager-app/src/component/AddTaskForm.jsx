import { useState } from 'react';
import { useTasks } from '../context/TaskContext.jsx';

function AddTaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
    });

    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <h2>Add a task</h2>
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
          rows={2}
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
      <button type="submit" disabled={!title.trim()}>
        Add Task
      </button>
    </form>
  );
}

export default AddTaskForm;
