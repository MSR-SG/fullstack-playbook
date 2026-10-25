// src/components/ContactCard.jsx
import Card from "./Card";

function ContactCard({ email, github, linkedin }) {
  return (
    <Card title="Contact Me">
      <div className="contact-list">
        <p>
          📧 Email: <a href={`mailto:${email}`}>{email}</a>
        </p>
        <p>
          🐙 GitHub:{" "}
          <a href={github} target="_blank" rel="noopener noreferrer">
            {github}
          </a>
        </p>
        <p>
          💼 LinkedIn:{" "}
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            {linkedin}
          </a>
        </p>
      </div>
    </Card>
  );
}

export default ContactCard;
