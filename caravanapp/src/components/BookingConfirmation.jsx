import React from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const BookingConfirmation = () => {
  const location = useLocation();
  const { reservation, transaction } = location.state || {};

  if (!reservation || !transaction) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold mb-4">Invalid Confirmation</h1>
        <p>No booking details found. Please go back to the home page.</p>
        <Link
          to="/"
          className="text-indigo-600 hover:underline mt-4 inline-block"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  const { caravan, startDate, endDate, totalPrice } = reservation;

  return (
    <div className="container mx-auto p-4 lg:p-8 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-gray-600">Your adventure awaits.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            Reservation Details
          </h2>
          <div className="flex justify-between">
            <span className="font-semibold">Caravan:</span>
            <span>{caravan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Check-in:</span>
            <span>{new Date(startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Check-out:</span>
            <span>{new Date(endDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            Payment Receipt
          </h2>
          <div className="flex justify-between">
            <span className="font-semibold">Transaction ID:</span>
            <span>{transaction.transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Amount Paid:</span>
            <span className="font-bold">${totalPrice}</span>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/"
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-indigo-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
