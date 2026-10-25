// src/components/Card.jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-content">{children}</div>
    </div>
  );
}

export default Card;
