// src/components/SkillsList.jsx
import Card from "./Card";

function SkillsList({ skills }) {
  return (
    <Card title="My Skills">
      <p className="skills-text">{skills.join(", ")}</p>
    </Card>
  );
}

export default SkillsList;
