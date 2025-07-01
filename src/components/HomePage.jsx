import React from 'react';
import './HomePage.css'; // We'll add custom styles here

function HomePage({ setPage }) {
  return (
    <div className="homepage">
      <h1>Asset Management Dashboard</h1>
      <div className="button-grid">
        <button onClick={() => setPage('master')}>Master</button>
        <button onClick={() => setPage('equipment')}>Equipments</button>
        <button onClick={() => setPage('inuse')}>In Use</button>
        <button onClick={() => setPage('instock')}>In Stock</button>
        <button onClick={() => setPage('damaged')}>Damaged Products</button>
        <button onClick={() => setPage('ewaste')}>E-Waste</button>
        <button onClick={() => setPage('headset')}>Head Set</button>
        <button onClick={() => setPage('form')}>+ Add Asset</button>
      </div>
    </div>
  );
}

export default HomePage;
