import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // This endpoint needs to be created on the backend
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/user/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
    fetchReviews();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>User Type: {user.userType}</p>

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

export default Profile;
