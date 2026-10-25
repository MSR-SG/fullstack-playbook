function UserCardWithProps(props) {
  return (
    <div className="user-card">
      <h2>Name: {props.name}</h2>
      <p>Email ID: {props.email}</p>
      <p>Age: {props.age}</p>
    </div>
  );
}

export default UserCardWithProps;
