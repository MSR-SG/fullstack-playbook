import { useTasks } from '../context/TaskContext.jsx';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

function FilterBar() {
  const { filter, setFilter } = useTasks();

  return (
    <div className="filter-bar">
      <h2>Filter tasks</h2>
      <div className="filter-bar__options">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={option.value === filter ? 'active' : ''}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
