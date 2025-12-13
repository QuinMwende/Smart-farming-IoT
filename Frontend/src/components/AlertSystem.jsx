import React, { useState, useEffect } from 'react';
import './AlertSystem.css';

const AlertSystem = ({ readings = [] }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const thresholds = {
      temperature: { min: 10, max: 35 },
      soil_moisture: { min: 0.2, max: 0.8 },
      humidity: { min: 30, max: 80 },
    };

    const newAlerts = readings
      .filter((reading) => {
        const sensor = reading.sensor?.type;
        const threshold = thresholds[sensor];
        if (!threshold) return false;
        return reading.readingValue < threshold.min || reading.readingValue > threshold.max;
      })
      .map((reading) => ({
        id: reading.id,
        sensorType: reading.sensor?.type || 'Unknown',
        value: reading.readingValue,
        timestamp: new Date(reading.timestamp).toLocaleString(),
        severity: reading.readingValue > 100 || reading.readingValue < 0 ? 'critical' : 'warning',
      }));

    setAlerts(newAlerts);
  }, [readings]);

  if (alerts.length === 0) {
    return (
      <div className="alert-system healthy">
        <h3>✓ All Systems Normal</h3>
        <p>No alerts. All sensor readings are within acceptable range.</p>
      </div>
    );
  }

  return (
    <div className="alert-system">
      <h3>⚠ Alerts ({alerts.length})</h3>
      <div className="alerts-container">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert alert-${alert.severity}`}>
            <div className="alert-header">
              <span className="alert-type">{alert.sensorType.replace('_', ' ').toUpperCase()}</span>
              <span className="alert-time">{alert.timestamp}</span>
            </div>
            <div className="alert-body">
              <span className="alert-value">Value: {alert.value.toFixed(2)}</span>
              <span className="alert-severity">{alert.severity.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertSystem;
