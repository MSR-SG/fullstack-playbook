function UserCardDestructured({ name, email, age }) {
  return (
    <div className="user-card">
      <h2>Name: {name}</h2>
      <p>Email ID: {email}</p>
      <p>Age: {age}</p>
    </div>
  );
}

export default UserCardDestructured;
