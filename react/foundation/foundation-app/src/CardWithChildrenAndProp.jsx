// src/components/Card.jsx
function CardWithChildrenAndProp({ title, children }) {
  return (
    <div className="user-card">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}

export default CardWithChildrenAndProp;
