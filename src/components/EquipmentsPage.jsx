import React, { useState } from 'react';
import './EquipmentsPage.css';

function EquipmentsPage({ setPage }) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    department: '',
    model: '',
    serialNumber: '',
    comments: '',
    location: '',
    warranty: '',
    lifespan: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('equipments') || '[]');
    existing.push(formData);
    localStorage.setItem('equipments', JSON.stringify(existing));
    alert('Equipment data saved!');
    setPage('home');
  };

  return (
    <div className="equipments-page">
      <h2>Equipment Entry Form</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div className="form-group" key={key}>
            <label>{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
              name={key}
              value={value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="form-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setPage('home')}>Back</button>
        </div>
      </form>
    </div>
  );
}

export default EquipmentsPage;
