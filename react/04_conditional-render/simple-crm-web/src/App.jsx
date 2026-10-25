import { useState } from "react";
import { mockCustomers, generateCustomerId } from "./mockData";
import CustomerCard from "./components/CustomerCard";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  // States managed here as Parent.
  const [customers, setCustomers] = useState(mockCustomers);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Change methods.
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();

    const newCustomer = {
      id: generateCustomerId(),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: "",
      status: "active",
      tags: [],
    };

    setCustomers([...customers, newCustomer]);
    setForm({ firstName: "", lastName: "", email: "" });
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
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

        <button type="submit" className="submit-button">
          Add Customer
        </button>
      </form>

      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

      <div className="customer-list">
        <h2>Customers ({filteredCustomers.length})</h2>
        <div className="customers">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onDelete={handleDeleteCustomer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
