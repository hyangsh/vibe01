import React, { useState } from 'react';
import axios from 'axios';

const CaravanForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    amenities: '',
    location: '',
    dailyRate: '',
  });

  const { name, capacity, amenities, location, dailyRate } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };
    const body = JSON.stringify({
      ...formData,
      amenities: amenities.split(',').map((item) => item.trim()),
    });
    try {
      const res = await axios.post('http://localhost:5000/api/caravans', body, config);
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h1>Create a new Caravan</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Capacity"
            name="capacity"
            value={capacity}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Amenities (comma separated)"
            name="amenities"
            value={amenities}
            onChange={onChange}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Daily Rate"
            name="dailyRate"
            value={dailyRate}
            onChange={onChange}
            required
          />
        </div>
        <input type="submit" value="Create Caravan" />
      </form>
    </div>
  );
};

export default CaravanForm;
