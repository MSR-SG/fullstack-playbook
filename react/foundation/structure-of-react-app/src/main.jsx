import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Welcome from "./Welcome.jsx";
import UserCardWithProps from "./UserCardWithProps.jsx";
import UserCardDestructured from "./UserCardDestructured.jsx";
import Profile from "./Profile.jsx";
import CardWithChildren from "./CardWithChildren.jsx";
import CardWithChildrenAndProp from "./CardWithChildrenAndProp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Welcome />
    <br />
    <App />
    <br />
    <UserCardWithProps name="Eli" email="eli@example.com" age={26} />
    <br />
    <UserCardWithProps name="Mel" email="mel@example.com" age={30} />
    <br />
    <UserCardDestructured name="Sana" email="sana@example.com" age={26} />
    <br />
    <UserCardDestructured name="Ben" email="ben@example.com" age={30} />
    <br />

    <Profile
      name="Rox"
      age={25}
      isActive={true}
      hobbies={["reading", "coding", "thinking"]}
      address={{ city: "Malta City", country: "Malta" }}
      onClick={() => alert("Profile clicked!")}
    />

    <CardWithChildren>
      <p>Title: Geography</p>
      <p>Instructor: Mr. Smith</p>
      <p>Duration: 3 months</p>
      <p>Level: Beginner</p>
    </CardWithChildren>
    <br />
    <CardWithChildrenAndProp title="Geography">
      <p>Instructor: Mr. Smith</p>
      <p>Duration: 3 months</p>
      <p>Level: Beginner</p>
    </CardWithChildrenAndProp>
  </StrictMode>,
);
