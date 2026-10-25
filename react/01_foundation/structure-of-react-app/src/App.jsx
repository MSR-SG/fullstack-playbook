import { useState } from "react";
import "./App.css";

// src/App.jsx
function App() {
  const firstName = "Mohammed Shafique";
  const favoriteLanguage = "JavaScript, React, Java, Spring";
  const yearsExperience = 26;
  const isLearningReact = true;

  return (
    <div>
      <h1>About Me</h1>
      <p>My name is {firstName}</p>
      <p>My favorite programming language is {favoriteLanguage}</p>
      <p>I have {yearsExperience} years of experience</p>
      {isLearningReact && <p>🎉 Currently learning React!</p>}
    </div>
  );
}

export default App;
