import React, { useState, useEffect } from 'react';
import FarmList from './FarmList';
import FarmForm from './FarmForm';
import SensorForm from './SensorForm';
import SensorReadingsChart from './SensorReadingsChart';
import AlertSystem from './AlertSystem';
import { farmAPI, sensorAPI, readingAPI, handleApiError } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [selectedFarmData, setSelectedFarmData] = useState(null);
  const [readings, setReadings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [showSensorForm, setShowSensorForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartRefreshKey, setChartRefreshKey] = useState(0);

  // Fetch all farms
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await farmAPI.getAllFarms();
        const farmsData = Array.isArray(response.data) ? response.data : [];
        setFarms(farmsData);
      } catch (err) {
        console.error('Error fetching farms:', err);
        setFarms([]);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  // Fetch farm details and readings when selected
  useEffect(() => {
    if (!selectedFarmId) return;

    const fetchFarmDetails = async () => {
      try {
        setError(null);
        const farmResponse = await farmAPI.getFarmById(selectedFarmId);
        setSelectedFarmData(farmResponse.data);

        const readingsResponse = await readingAPI.getReadings(selectedFarmId, 7);
        const readingsData = Array.isArray(readingsResponse.data) ? readingsResponse.data : [];
        setReadings(readingsData);
      } catch (err) {
        console.error('Error fetching farm details:', err);
        setReadings([]);
        setError(handleApiError(err));
      }
    };

    fetchFarmDetails();
  }, [selectedFarmId]);

  const handleCreateFarm = async (farmData) => {
    try {
      setError(null);
      const response = await farmAPI.createFarm(farmData);
      setFarms((prev) => [...prev, response.data]);
      setShowForm(false);
      alert('Farm created successfully!');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleUpdateFarm = async (farmData) => {
    try {
      setError(null);
      const response = await farmAPI.updateFarm(editingFarm.id, farmData);
      setFarms((prev) => prev.map((f) => (f.id === editingFarm.id ? response.data : f)));
      setEditingFarm(null);
      setShowForm(false);
      alert('Farm updated successfully!');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleDeleteFarm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farm?')) return;

    try {
      setError(null);
      await farmAPI.deleteFarm(id);
      setFarms((prev) => prev.filter((f) => f.id !== id));
      if (selectedFarmId === id) {
        setSelectedFarmId(null);
        setSelectedFarmData(null);
        setReadings([]);
      }
      alert('Farm deleted successfully!');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleSelectFarm = (id) => {
    setSelectedFarmId(id);
    setShowForm(false);
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFarm(null);
  };

  const handleAddSensor = async (sensorData) => {
    try {
      setError(null);
      const response = await sensorAPI.createSensor(sensorData);
      setSelectedFarmData((prev) => ({
        ...prev,
        sensors: [...(prev.sensors || []), response.data],
      }));
      setShowSensorForm(false);
      alert('Sensor added successfully!');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleDeleteSensor = async (sensorId) => {
    if (!window.confirm('Are you sure you want to delete this sensor?')) return;

    try {
      setError(null);
      await sensorAPI.deleteSensor(sensorId);
      setSelectedFarmData((prev) => ({
        ...prev,
        sensors: prev.sensors.filter((s) => s.id !== sensorId),
      }));
      alert('Sensor deleted successfully!');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleGenerateReadings = async (sensorId) => {
    try {
      setError(null);
      setLoading(true);
      await sensorAPI.generateReadings(sensorId, 10);
      alert('Sample readings generated! Refreshing chart...');
      
      // Force a refresh by creating a new sensor array
      const farmResponse = await farmAPI.getFarmById(selectedFarmId);
      setSelectedFarmData({
        ...farmResponse.data,
        sensors: [...(farmResponse.data.sensors || [])],
      });
      // Increment refresh key to force chart re-render
      setChartRefreshKey(prev => prev + 1);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🌾 Smart Farming IoT Dashboard</h1>
        <p>Monitor and manage your farm sensors in real-time</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-container">
        <aside className="sidebar">
          <button className="btn-create-farm" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Close' : '+ New Farm'}
          </button>

          {showForm && (
            <FarmForm
              farm={editingFarm}
              onSubmit={editingFarm ? handleUpdateFarm : handleCreateFarm}
              onCancel={handleCloseForm}
              isLoading={loading}
            />
          )}

          <FarmList
            farms={farms}
            onSelectFarm={handleSelectFarm}
            onEditFarm={handleEditFarm}
            onDeleteFarm={handleDeleteFarm}
            isLoading={loading}
          />
        </aside>

        <main className="main-content">
          {selectedFarmId && selectedFarmData ? (
            <>
              <div className="farm-details-header">
                <h2>{selectedFarmData.name}</h2>
                <p>📌 {selectedFarmData.location}</p>
              </div>

              <SensorReadingsChart key={chartRefreshKey} sensors={selectedFarmData.sensors || []} days={7} />

              <div className="farm-info">
                <h3>Farm Information</h3>
                <p><strong>ID:</strong> {selectedFarmData.id}</p>
                <p><strong>Active Sensors:</strong> {selectedFarmData.sensors?.length || 0}</p>
                
                <div className="sensors-section">
                  <div className="sensors-header">
                    <h4>Sensors</h4>
                    <button 
                      className="btn-add-sensor" 
                      onClick={() => setShowSensorForm(!showSensorForm)}
                    >
                      {showSensorForm ? '✕ Close' : '+ Add Sensor'}
                    </button>
                  </div>

                  {showSensorForm && (
                    <SensorForm
                      farmId={selectedFarmId}
                      onSubmit={handleAddSensor}
                      onCancel={() => setShowSensorForm(false)}
                      isLoading={loading}
                    />
                  )}

                  {selectedFarmData.sensors && selectedFarmData.sensors.length > 0 ? (
                    <div className="sensors-list">
                      {selectedFarmData.sensors.map((sensor) => (
                        <div key={sensor.id} className="sensor-item">
                          <div className="sensor-info">
                            <span className="sensor-type">{sensor.type}</span>
                            <span className="sensor-location">{sensor.location}</span>
                          </div>
                          <div className="sensor-actions">
                            <button 
                              className="btn-generate-readings"
                              onClick={() => handleGenerateReadings(sensor.id)}
                              title="Generate sample readings"
                              disabled={loading}
                            >
                              📊
                            </button>
                            <button 
                              className="btn-delete-sensor"
                              onClick={() => handleDeleteSensor(sensor.id)}
                              title="Delete sensor"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-sensors">No sensors yet. Add one to get started!</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h2>Welcome to Smart Farming IoT</h2>
              <p>Select a farm from the list to view its details and sensor readings.</p>
              <p>Or create a new farm to get started!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
