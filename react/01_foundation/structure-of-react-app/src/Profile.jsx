function Profile({
  name, // string
  age, // number
  isActive, // boolean
  hobbies, // array
  address, // object
  onClick, // function
}) {
  return (
    <div className="user-card">
      <h1>{name}</h1>
      <p>Age: {age}</p>
      <p>Status: {isActive ? "Active" : "Inactive"}</p>
      <p>
        Location: {address.city}, {address.country}
      </p>
      <p>Hobbies: {hobbies.join(", ")}</p>
      <button onClick={onClick}>View Profile</button>
    </div>
  );
}

export default Profile;
