// src/components/Header.jsx
function Header({ name, title }) {
  return (
    <header className="page-header">
      <h1>{name}</h1>
      <p className="page-header-title">{title}</p>
    </header>
  );
}

export default Header;
