import AddTaskForm from './AddTaskForm.jsx';
import FilterBar from './FilterBar.jsx';
import TaskList from './TaskList.jsx';

function TaskListPage() {
  return (
    <div className="task-list-page">
      <FilterBar />
      <AddTaskForm />
      <TaskList />
    </div>
  );
}

export default TaskListPage;
