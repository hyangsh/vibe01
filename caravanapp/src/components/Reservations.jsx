import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewForm = ({ reservationId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };
    const body = JSON.stringify({ reservationId, rating, comment });
    try {
      const res = await axios.post('http://localhost:5000/api/reviews', body, config);
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h4>Leave a Review</h4>
      <div>
        <label>Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div>
        <label>Comment</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

const Reservations = () => {
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
        const res = await axios.get('http://localhost:5000/api/reservations', config);
        setReservations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div>
      <h1>My Reservations</h1>
      <div>
        {reservations.map((reservation) => (
          <div key={reservation._id}>
            <h2>{reservation.caravan.name}</h2>
            <p>From: {new Date(reservation.startDate).toLocaleDateString()}</p>
            <p>To: {new Date(reservation.endDate).toLocaleDateString()}</p>
            <p>Total: ${reservation.totalPrice}</p>
            <p>Status: {reservation.status}</p>
            {reservation.status === 'completed' && <ReviewForm reservationId={reservation._id} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;

