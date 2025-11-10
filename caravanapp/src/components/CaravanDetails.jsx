import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CaravanDetails = () => {
  const [caravan, setCaravan] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCaravan = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/caravans/${id}`);
        setCaravan(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCaravan();
  }, [id]);

  if (!caravan) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{caravan.name}</h1>
      <p>Capacity: {caravan.capacity}</p>
      <p>Amenities: {caravan.amenities.join(', ')}</p>
      <p>Location: {caravan.location}</p>
      <p>Rate: ${caravan.dailyRate} per day</p>
    </div>
  );
};

export default CaravanDetails;
