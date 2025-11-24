import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import axios from "axios";

const BookingWidget = ({ caravan }) => {
  const [date, setDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState("");

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
        disabled={!date}
        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-300"
      >
        Reserve & Pay
      </button>
    </div>
  );
};

export default BookingWidget;
