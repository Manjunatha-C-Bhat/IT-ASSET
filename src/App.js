import React, { useState } from 'react';
import HomePage from './components/HomePage';
import AssetForm from './components/AssetForm';
import AssetList from './components/AssetList';
import MasterPage from './components/MasterPage';
import EquipmentsPage from './components/EquipmentsPage';

function App() {
  const [page, setPage] = useState('home');

 return (
  <div className="App">
    {page === 'home' && <HomePage setPage={setPage} />}
    {page === 'form' && <AssetForm setPage={setPage} />}
    {page === 'list' && <AssetList setPage={setPage} />}
    {page === 'master' && <MasterPage setPage={setPage} />}
    {page === 'equipment' && <EquipmentsPage setPage={setPage} />}

  </div>
);

}

export default App;
