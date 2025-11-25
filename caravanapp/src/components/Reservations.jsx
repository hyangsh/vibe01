import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

const ReviewForm = ({ reservationId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const body = { reservation: reservationId, rating, comment };
            await api.post("/api/reviews", body);
            onReviewSubmitted(); // Notify parent
        } catch (err) {
            setError(err.response?.data?.msg || "Could not submit review.");
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit} className="mt-4 p-4 border-t">
            <h4 className="font-semibold mb-2">Leave a Review</h4>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="mb-2">
                <label className="block text-sm font-medium">Rating</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium">Comment</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
            </div>
            <button type="submit" className="btn-primary">Submit Review</button>
        </form>
    );
};


const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/reservations");
            setReservations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Loading your reservations...</div>;
    }

    return (
        <div className="container mx-auto p-4 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Reservations</h1>
            {reservations.length === 0 ? (
                <p>You have no reservations yet.</p>
            ) : (
                <div className="space-y-6">
                    {reservations.map((reservation) => (
                        <div key={reservation._id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-1/3">
                                <img src={reservation.caravan.photos?.[0] || 'https://via.placeholder.com/400x225'} alt={reservation.caravan.name} className="w-full h-full object-cover"/>
                            </div>
                            <div className="p-6 flex-1">
                                <h2 className="text-2xl font-bold">{reservation.caravan.name}</h2>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Dates:</span> {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Total:</span> ${reservation.totalPrice}
                                </p>
                                <p className="text-gray-600 mb-4">
                                    <span className="font-semibold">Status:</span> 
                                    <span className={`ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                        {
                                            pending: "bg-yellow-100 text-yellow-800",
                                            approved: "bg-green-100 text-green-800",
                                            completed: "bg-blue-100 text-blue-800",
                                            rejected: "bg-red-100 text-red-800",
                                        }[reservation.status] || "bg-gray-100 text-gray-800"
                                    }`}>
                                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                    </span>
                                </p>
                                <Link to={`/caravans/${reservation.caravan._id}`} className="text-indigo-600 hover:underline">
                                    View Caravan
                                </Link>

                                {reservation.status === "completed" && (
                                    <ReviewForm reservationId={reservation._id} onReviewSubmitted={fetchReservations} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reservations;
