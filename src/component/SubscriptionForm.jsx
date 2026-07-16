import React, { useState } from "react";

export default function SubscriptionForm({ onSubmit }) {

  const [form, setForm] = useState({
    tenantId: "",
    productId: "",
    planCode: "",
    numberOfLicenses: 1,
    startDate: "",
    endDate: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="subscription-form">

      <h3>Create Subscription</h3>

      <input
        name="tenantId"
        placeholder="Tenant ID"
        onChange={handleChange}
        required
      />

      <input
        name="productId"
        placeholder="Product ID"
        onChange={handleChange}
        required
      />

      <input
        name="planCode"
        placeholder="Plan Code"
        onChange={handleChange}
      />

      <input
        name="numberOfLicenses"
        type="number"
        placeholder="Licenses"
        onChange={handleChange}
      />

      <input
        name="startDate"
        type="date"
        onChange={handleChange}
      />

      <input
        name="endDate"
        type="date"
        onChange={handleChange}
      />

      <button type="submit">
        Create
      </button>

    </form>
  );
}