import React from 'react';
import './FarmList.css';

const FarmList = ({ farms, onSelectFarm, onEditFarm, onDeleteFarm, isLoading }) => {
  if (isLoading) {
    return <div className="farm-list loading">Loading farms...</div>;
  }

  const farmsList = Array.isArray(farms) ? farms : [];
  
  if (!farmsList || farmsList.length === 0) {
    return <div className="farm-list empty">No farms found. Create one to get started!</div>;
  }

  return (
    <div className="farm-list">
      <h2>Farms</h2>
      <div className="farms-grid">
        {farmsList.map((farm) => (
          <div key={farm.id} className="farm-card">
            <div className="farm-card-header">
              <h3>{farm.name}</h3>
              <span className="farm-id">ID: {farm.id}</span>
            </div>
            <div className="farm-card-body">
              <p><strong>Location:</strong> {farm.location}</p>
              <p><strong>Sensors:</strong> {farm.sensors?.length || 0}</p>
            </div>
            <div className="farm-card-actions">
              <button
                className="btn-view"
                onClick={() => onSelectFarm(farm.id)}
              >
                View Details
              </button>
              <button
                className="btn-edit"
                onClick={() => onEditFarm(farm)}
              >
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => onDeleteFarm(farm.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmList;
