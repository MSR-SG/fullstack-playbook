import { useState, useEffect } from "react";
import CustomerCard from "./components/CustomerCard";
import SearchBar from "./components/SearchBar";
import CustomerDetail from "./components/CustomerDetail";
import "./App.css";

// Json server url
export const API_BASE = "http://localhost:3001";

function App() {
  // States managed here as Parent.
  const [customers, setCustomers] = useState([]); // will load from JSON server, not from mockData
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tags: [],
    status: "active",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load customers from JSON server on component mount.
  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/customers`);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Change methods.
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newCustomer = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: "",
      status: form.status,
      tags: form.tags,
      company: "",
      notes: "",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    try {
      const response = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error(`Failed to add customer: ${response.status}`);
      }

      const created = await response.json();
      setCustomers([...customers, created]);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        tags: [],
        status: "active",
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer: ${response.status}`);
      }

      setCustomers(customers.filter((c) => c.id !== customerId));

      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="simple-crm">
      <h1>Simple CRM</h1>

      <form onSubmit={handleAddCustomer} className="add-customer-form">
        <h3>Add New Customer</h3>

        <div className="form-field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="e.g. Sarah"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="e.g. Chen"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. sarah.chen@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? "Adding..." : "Add Customer"}
        </button>
      </form>

      <div className="crm-layout">
        <div className="customer-panel">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

          <div className="customer-list">
            <h2>Customers ({filteredCustomers.length})</h2>

            {loading ? (
              <p className="status-message">Loading customers...</p>
            ) : error ? (
              <p className="status-message error">
                Could not load customers: {error}
              </p>
            ) : filteredCustomers.length === 0 ? (
              <p className="empty-state">
                {searchTerm
                  ? "No customers match your search."
                  : "No customers yet. Add one above!"}
              </p>
            ) : (
              <div className="customers">
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onDelete={handleDeleteCustomer}
                    onSelect={setSelectedCustomer}
                    isSelected={selectedCustomer?.id === customer.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <CustomerDetail customer={selectedCustomer} />
      </div>
    </div>
  );
}

export default App;
