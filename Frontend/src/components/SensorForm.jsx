import React, { useState } from 'react';
import './SensorForm.css';

const SensorForm = ({ farmId, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    type: 'temperature',
    location: '',
  });

  const [errors, setErrors] = useState({});

  const sensorTypes = ['temperature', 'humidity', 'pressure', 'soil_moisture', 'wind_speed'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type.trim()) newErrors.type = 'Sensor type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, farmId: farmId });
    }
  };

  return (
    <form className="sensor-form" onSubmit={handleSubmit}>
      <h4>Add Sensor</h4>
      
      <div className="form-group">
        <label htmlFor="type">Sensor Type *</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          disabled={isLoading}
        >
          {sensorTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.type && <span className="error">{errors.type}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          id="location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., greenhouse-1, field-A"
          disabled={isLoading}
        />
        {errors.location && <span className="error">{errors.location}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Adding...' : 'Add Sensor'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SensorForm;
