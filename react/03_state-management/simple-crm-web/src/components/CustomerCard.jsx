// src/components/CustomerCard.jsx
import styles from "./CustomerCard.module.css";

function CustomerCard({ customer, onDelete }) {
  return (
    <div className={styles.card}>
      <p className={styles.name}>
        {customer.firstName} {customer.lastName}
      </p>
      <p className={styles.email}>{customer.email}</p>
      <p>{customer.phone}</p>
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(customer.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default CustomerCard;