import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { processPayment } from "../utils/mockPayment";

const BookingWidget = ({ caravan }) => {
  const [date, setDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const CLEANING_FEE = 50;
  const SERVICE_FEE = 30;

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await axios.get(`/api/reservations/caravan/${caravan._id}`);
        const dates = res.data.flatMap((reservation) => {
          if (reservation.status !== "confirmed") return [];
          const start = new Date(reservation.startDate);
          const end = new Date(reservation.endDate);
          const dateArr = [];
          for (
            let dt = new Date(start);
            dt <= end;
            dt.setDate(dt.getDate() + 1)
          ) {
            dateArr.push(new Date(dt));
          }
          return dateArr;
        });
        setBookedDates(dates);
      } catch (err) {
        console.error("Error fetching booked dates:", err);
      }
    };

    if (caravan._id) {
      fetchBookedDates();
    }
  }, [caravan._id]);

  const { nights, price, total } = useMemo(() => {
    if (!date || !Array.isArray(date) || date.length !== 2) {
      return { nights: 0, price: 0, total: 0 };
    }
    const [checkIn, checkOut] = date;
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const price = nights * caravan.dailyRate;
    const total = price + CLEANING_FEE + SERVICE_FEE;
    return { nights, price, total };
  }, [date, caravan.dailyRate]);

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      return bookedDates.some(
        (bookedDate) =>
          date.getFullYear() === bookedDate.getFullYear() &&
          date.getMonth() === bookedDate.getMonth() &&
          date.getDate() === bookedDate.getDate(),
      );
    }
  };

  const handleDateChange = (newDate) => {
    setError("");
    if (Array.isArray(newDate) && newDate.length === 2) {
      const [start, end] = newDate;
      for (const booked of bookedDates) {
        if (booked > start && booked < end) {
          setError(
            "Your selection includes booked dates. Please choose a different range.",
          );
          setDate(null);
          return;
        }
      }
    }
    setDate(newDate);
  };

  const handleReserveAndPay = async () => {
    if (!date) return;
    setLoading(true);
    setError("");

    try {
      // 1. Process payment
      const transaction = await processPayment({ totalAmount: total });

      // 2. Create reservation on payment success
      const reservationBody = {
        caravan: caravan._id,
        startDate: date[0].toISOString(),
        endDate: date[1].toISOString(),
        transactionId: transaction.transactionId, // Add transactionId
      };

      const token = localStorage.getItem("token");
      const config = {
        headers: { "Content-Type": "application/json", "x-auth-token": token },
      };

      const res = await axios.post(
        "/api/reservations",
        reservationBody,
        config,
      );

      // 3. Redirect to confirmation page
      navigate("/booking-confirmation", {
        state: { reservation: res.data, transaction },
      });
    } catch (err) {
      console.error("Booking failed:", err);
      const errorMessage =
        err.response?.data?.msg ||
        err.message ||
        "An unexpected error occurred.";
      setError(`Booking failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-4">
        ${caravan.dailyRate}{" "}
        <span className="text-base font-normal">/ night</span>
      </h3>

      <Calendar
        onChange={handleDateChange}
        value={date}
        selectRange={true}
        minDate={new Date()}
        tileDisabled={tileDisabled}
        className="border-none"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="mt-6">
        {nights > 0 ? (
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Price Breakdown</h4>
            <div className="flex justify-between">
              <span>
                ${caravan.dailyRate} x {nights} nights
              </span>
              <span>${price}</span>
            </div>
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>${CLEANING_FEE}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>${SERVICE_FEE}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Select dates to see price.
          </p>
        )}
      </div>

      <button
        onClick={handleReserveAndPay}
        disabled={!date || loading}
        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-300 flex justify-center items-center"
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Reserve & Pay"
        )}
      </button>
    </div>
  );
};

export default BookingWidget;
