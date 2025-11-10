import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CaravanList = () => {
  const [caravans, setCaravans] = useState([]);

  useEffect(() => {
    const fetchCaravans = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/caravans');
        setCaravans(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCaravans();
  }, []);

  return (
    <div>
      <h1>Caravans</h1>
      <div>
        {caravans.map((caravan) => (
          <div key={caravan._id}>
            <h2>
              <Link to={`/caravans/${caravan._id}`}>{caravan.name}</Link>
            </h2>
            <p>{caravan.location}</p>
            <p>${caravan.dailyRate} per day</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaravanList;
