import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import CaravanCard from "./CaravanCard";
import Modal from "./Modal";
import AvailabilityCalendar from "./AvailabilityCalendar";

const MyCaravansView = () => {
  const [caravans, setCaravans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [selectedCaravan, setSelectedCaravan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caravansRes, reservationsRes] = await Promise.all([
          api.get("/caravans/my-caravans"),
          api.get("/reservations/host"),
        ]);
        setCaravans(caravansRes.data);
        setReservations(reservationsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenCalendar = (caravan) => {
    setSelectedCaravan(caravan);
    setCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setCalendarOpen(false);
    setSelectedCaravan(null);
    // Optionally, refetch caravan data here to show updated blocked dates
  };

  if (loading) {
    return <p>Loading your caravans...</p>;
  }

  if (caravans.length === 0) {
    return <p>You have not listed any caravans yet.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Caravans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caravans.map((caravan) => (
          <CaravanCard
            key={caravan._id}
            caravan={caravan}
            onOpenCalendar={() => handleOpenCalendar(caravan)}
          />
        ))}
      </div>

      <Modal isOpen={isCalendarOpen} onClose={handleCloseCalendar}>
        {selectedCaravan && (
          <AvailabilityCalendar
            caravan={selectedCaravan}
            reservations={reservations}
            onClose={handleCloseCalendar}
          />
        )}
      </Modal>
    </div>
  );
};

export default MyCaravansView;
