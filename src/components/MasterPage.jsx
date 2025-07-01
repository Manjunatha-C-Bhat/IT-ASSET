import React, { useState } from 'react';
import './MasterPage.css';

function MasterPage({ setPage }) {
  const [formData, setFormData] = useState({
    assigneeName: '',
    position: '',
    email: '',
    licenseType: '',
    phone: '',
    department: '',
    model: '',
    proLicensed: '',
    serialNumber: '',
    comment: '',
    location: '',
    warranty: '',
    purchaseDate: '',
    lifespan: '',
    equipmentSubmitted: '',
    status: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('masterAssets') || '[]');
    existing.push(formData);
    localStorage.setItem('masterAssets', JSON.stringify(existing));
    alert('Master asset data saved!');
    setPage('home');
  };

  return (
    <div className="master-page">
      <h2>Master Asset Form</h2>
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

export default MasterPage;
