import React, { useEffect, useState } from 'react';

function AssetList({ setPage }) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('assets') || '[]');
    setAssets(data);
  }, []);

  return (
    <div>
      <h2>All Assets</h2>
      {assets.length === 0 ? (
        <p>No assets added yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Assignee</th>
              <th>Email</th>
              <th>Department</th>
              <th>Model</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={index}>
                <td>{asset.assigneeName}</td>
                <td>{asset.email}</td>
                <td>{asset.department}</td>
                <td>{asset.model}</td>
                <td>{asset.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => setPage('home')}>Back</button>
    </div>
  );
}

export default AssetList;
