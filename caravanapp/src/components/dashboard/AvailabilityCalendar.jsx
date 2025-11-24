import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default styling
import axios from "axios";

const AvailabilityCalendar = ({ caravan, reservations, onClose }) => {
  const [blockedDates, setBlockedDates] = useState(
    caravan.blockedDates.map((d) => new Date(d)),
  );

  const bookedIntervals = useMemo(
    () =>
      reservations
        .filter(
          (r) => r.caravan._id === caravan._id && r.status === "confirmed",
        )
        .map((r) => ({
          start: new Date(r.startDate),
          end: new Date(r.endDate),
          guest: r.guest.name,
        })),
    [reservations, caravan._id],
  );

  const isDateInInterval = (date, interval) => {
    return date >= interval.start && date <= interval.end;
  };

  const getTileData = (date) => {
    const isoDate = date.toISOString().split("T")[0];

    for (const interval of bookedIntervals) {
      if (isDateInInterval(date, interval)) {
        return {
          className: "bg-red-200 text-red-900",
          tooltip: `Booked by ${interval.guest}`,
        };
      }
    }

    if (blockedDates.some((d) => d.toISOString().split("T")[0] === isoDate)) {
      return { className: "bg-gray-300 text-gray-800", tooltip: "Blocked" };
    }

    return { className: "bg-green-200 text-green-900", tooltip: "Available" };
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      return getTileData(date).className;
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const { tooltip } = getTileData(date);
      return <div title={tooltip} className="h-full w-full"></div>;
    }
  };

  const handleDayClick = (date) => {
    const isoDate = date.toISOString().split("T")[0];
    const isBooked = bookedIntervals.some((interval) =>
      isDateInInterval(date, interval),
    );

    if (isBooked) return; // Cannot block a booked date

    const isBlocked = blockedDates.some(
      (d) => d.toISOString().split("T")[0] === isoDate,
    );

    let newBlockedDates;
    if (isBlocked) {
      newBlockedDates = blockedDates.filter(
        (d) => d.toISOString().split("T")[0] !== isoDate,
      );
    } else {
      newBlockedDates = [...blockedDates, date];
    }
    setBlockedDates(newBlockedDates);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`/api/caravans/${caravan._id}/block-dates`, {
        blockedDates: blockedDates.map((d) => d.toISOString()),
      });
      onClose(); // Close modal on success
    } catch (err) {
      console.error("Error saving blocked dates:", err);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        Manage Availability for {caravan.name}
      </h3>
      <Calendar
        onClickDay={handleDayClick}
        tileClassName={tileClassName}
        tileContent={tileContent}
        className="border-none shadow-lg"
      />
      <div className="mt-4 flex justify-end space-x-3">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
          Cancel
        </button>
        <button
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
