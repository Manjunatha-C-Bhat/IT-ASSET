import React, { useState } from 'react';

function AssetForm({ setPage }) {
  const [formData, setFormData] = useState({
    assigneeName: '',
    email: '',
    department: '',
    model: '',
    status: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingAssets = JSON.parse(localStorage.getItem('assets') || '[]');
    existingAssets.push(formData);
    localStorage.setItem('assets', JSON.stringify(existingAssets));
    alert('Asset added successfully!');
    setPage('list');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Asset</h2>
      <input name="assigneeName" placeholder="Assignee Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="department" placeholder="Department" onChange={handleChange} required />
      <input name="model" placeholder="Model" onChange={handleChange} required />
      <input name="status" placeholder="Status" onChange={handleChange} required />
      <button type="submit">Submit</button>
      <button type="button" onClick={() => setPage('home')}>Back</button>
    </form>
  );
}

export default AssetForm;
