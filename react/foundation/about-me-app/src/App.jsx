// src/App.jsx
import Header from "./components/Header";
import Bio from "./components/Bio";
import SkillsList from "./components/SkillsList";
import ContactCard from "./components/ContactCard";

function App() {
  const mySkills = [
    "JavaScript",
    "React",
    "Java",
    "Spring",
    "AWS",
    "Git",
    "GitHub Actions",
    "Docker",
    "Railway",
  ];

  return (
    <div className="app">
      <Header
        name="Mohammed Shafique"
        title="Full Stack Senior Software Engineer | React Enthusiast"
      />

      <div className="about-content">
        <Bio>
          I'm a passionate software developer learning React! I love building
          web applications and learning new technologies. This is my first React
          project, and I'm excited to build more!
        </Bio>

        <SkillsList skills={mySkills} />

        <ContactCard
          email="your.email@example.com"
          github="https://github.com/yourusername"
          linkedin="https://linkedin.com/in/yourusername"
        />
      </div>
    </div>
  );
}

export default App;
