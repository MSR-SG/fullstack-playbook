import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <Link to="/tasks" className="header__title">
        <h1>Task Manager</h1>
      </Link>
      <nav>
        <Link to="/tasks">All Tasks</Link>
      </nav>
    </header>
  );
}

export default Header;
