import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BookingWidget from "./BookingWidget"; // Import the new widget

const CaravanDetails = () => {
  const [caravan, setCaravan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchCaravan = async () => {
      try {
        const res = await axios.get(`/api/caravans/${id}`);
        setCaravan(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchReviews = async () => {
      try {
        // Assuming this endpoint exists for fetching reviews for a caravan
        const res = await axios.get(`/api/reviews/caravan/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Could not fetch reviews for this caravan.", err);
      }
    };
    fetchCaravan();
    fetchReviews();
  }, [id]);

  if (!caravan) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{caravan.name}</h1>
        <p className="text-lg text-gray-600">{caravan.location}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Reviews */}
        <div className="lg:col-span-2">
          <img
            src={caravan.photos?.[0] || "https://via.placeholder.com/800x500"}
            alt={caravan.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg mb-8"
          />
          <div className="mb-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">
              About this caravan
            </h2>
            <p className="text-gray-700 mb-4">
              Capacity: {caravan.capacity} people
            </p>
            <div>
              <h3 className="font-semibold mb-2">Amenities:</h3>
              <ul className="list-disc list-inside grid grid-cols-2 gap-2">
                {caravan.amenities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

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
                  </p>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews for this caravan yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <BookingWidget caravan={caravan} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaravanDetails;
