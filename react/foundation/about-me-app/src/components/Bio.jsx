// src/components/Bio.jsx
import Card from "./Card";

function Bio({ children }) {
  return (
    <Card title="About Me">
      <p className="bio-text">{children}</p>
    </Card>
  );
}

export default Bio;