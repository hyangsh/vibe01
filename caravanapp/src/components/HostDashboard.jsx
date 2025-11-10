import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HostDashboard = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      try {
        // This endpoint needs to be created on the backend
        const res = await axios.get('http://localhost:5000/api/reservations/host', config);
        setReservations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };
    const body = JSON.stringify({ status });
    try {
      const res = await axios.put(`http://localhost:5000/api/reservations/${id}`, body, config);
      setReservations(
        reservations.map((reservation) =>
          reservation._id === id ? { ...reservation, status: res.data.status } : reservation
        )
      );
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h1>Host Dashboard</h1>
      <div>
        {reservations.map((reservation) => (
          <div key={reservation._id}>
            <h2>{reservation.caravan.name}</h2>
            <p>Guest: {reservation.guest.name}</p>
            <p>From: {new Date(reservation.startDate).toLocaleDateString()}</p>
            <p>To: {new Date(reservation.endDate).toLocaleDateString()}</p>
            <p>Status: {reservation.status}</p>
            {reservation.status === 'pending' && (
              <div>
                <button onClick={() => handleUpdateStatus(reservation._id, 'approved')}>
                  Approve
                </button>
                <button onClick={() => handleUpdateStatus(reservation._id, 'rejected')}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostDashboard;
