import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    let userId = id;

    if (!userId) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          userId = decoded.user.id;
        } catch (e) {
          console.error("Invalid token:", e);
          setError("Could not authenticate user.");
          return;
        }
      }
    }

    if (!userId) {
      setError("No user to display.");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("User not found.");
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/reviews/user/${userId}`);
        setReviews(res.data);
      } catch (err) {
        // It's okay if fetching reviews fails, we can still show the profile
        console.error("Could not fetch reviews for the user.");
      }
    };

    fetchUser();
    fetchReviews();
  }, [id]);

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{user.name}'s Profile</h1>
      <p className="text-lg mb-2">Email: {user.email}</p>
      <p className="text-lg mb-6">
        User Type: <span className="font-semibold">{user.userType}</span>
      </p>

      <div>
        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b py-4">
              <p className="flex items-center">
                <strong className="mr-2">{review.reviewer.name}</strong>
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {review.rating}/5
                </span>
              </p>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews for this user yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
