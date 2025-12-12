import React, { useState } from 'react';
import './FarmForm.css';

const FarmForm = ({ farm, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: farm?.name || '',
    location: farm?.location || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Farm name is required';
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
      onSubmit(formData);
    }
  };

  return (
    <form className="farm-form" onSubmit={handleSubmit}>
      <h3>{farm ? 'Edit Farm' : 'Create New Farm'}</h3>
      
      <div className="form-group">
        <label htmlFor="name">Farm Name *</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., North Field Farm"
          disabled={isLoading}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          id="location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Nairobi, Kenya"
          disabled={isLoading}
        />
        {errors.location && <span className="error">{errors.location}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Saving...' : 'Save Farm'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default FarmForm;
