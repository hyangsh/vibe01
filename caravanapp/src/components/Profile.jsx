import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useParams, Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const isMyProfile = !id;

    const fetchUser = async () => {
      try {
        const userRes = await (isMyProfile ? api.get("/api/users/me") : api.get(`/api/users/${id}`));
        setUser(userRes.data);
        return userRes.data._id;
      } catch (err) {
        console.error(err);
        setError("User not found.");
        return null;
      }
    };

    const fetchReviews = async (userId) => {
      try {
        const reviewsRes = await api.get(`/api/reviews/user/${userId}`);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Could not fetch reviews for the user.");
      }
    };
    
    const fetchReservations = async () => {
        try {
            const res = await api.get("/api/reservations");
            setReservations(res.data);
        } catch(err) {
            console.error("Could not fetch reservations for the user.")
        }
    }

    const loadProfileData = async () => {
        const userId = await fetchUser();
        if (userId) {
            await fetchReviews(userId);
            if (isMyProfile) {
                await fetchReservations();
            }
        }
    }

    loadProfileData();
  }, [id]);

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  if (!user) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">{user.name}'s Profile</h1>
        <p className="text-lg mb-2">Email: {user.email}</p>
        <p className="text-lg mb-6">
          User Type: <span className="font-semibold capitalize">{user.userType}</span>
        </p>
      </div>

      {!id && ( // Only show "My Reservations" on the current user's own profile
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">My Reservations</h2>
            {reservations.length > 0 ? (
                <div className="space-y-4">
                    {reservations.slice(0, 3).map((reservation) => ( // Show first 3
                        <div key={reservation._id} className="border-b py-2">
                           <Link to="/reservations">
                            <p className="font-semibold">{reservation.caravan.name}</p>
                            <p className="text-sm text-gray-600">
                                {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                            </p>
                           </Link>
                        </div>
                    ))}
                    {reservations.length > 3 && (
                        <Link to="/reservations" className="text-indigo-600 hover:underline mt-4 inline-block">
                            View all reservations...
                        </Link>
                    )}
                </div>
            ) : (
                <p>No reservations to show.</p>
            )}
          </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Reviews About {user.name}</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b py-4">
              <p className="flex items-center">
                <strong className="mr-2">{review.reviewer.name}</strong>
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
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
