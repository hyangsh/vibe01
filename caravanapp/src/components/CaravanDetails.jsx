import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CaravanDetails = () => {
  const [caravan, setCaravan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/reviews/caravan/${id}`,
        );
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCaravan();
    fetchReviews();
  }, [id]);

  const onReserve = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    const body = JSON.stringify({ caravan: id, startDate, endDate });
    try {
      const res = await axios.post(
        "http://localhost:5000/api/reservations",
        body,
        config,
      );
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  if (!caravan) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{caravan.name}</h1>
      <p>Capacity: {caravan.capacity}</p>
      <p>Amenities: {caravan.amenities.join(", ")}</p>
      <p>Location: {caravan.location}</p>
      <p>Rate: ${caravan.dailyRate} per day</p>

      <form onSubmit={onReserve}>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reserve</button>
      </form>

      <div>
        <h2>Reviews</h2>
        {reviews.map((review) => (
          <div key={review._id}>
            <p>
              <strong>{review.reviewer.name}</strong> - {review.rating}/5
            </p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaravanDetails;
