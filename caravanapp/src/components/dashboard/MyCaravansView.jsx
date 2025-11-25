import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import CaravanCard from "./CaravanCard";
import Modal from "./Modal";
import AvailabilityCalendar from "./AvailabilityCalendar";
import CaravanForm from "../CaravanForm"; // Assuming this will be created

const MyCaravansView = () => {
  const [caravans, setCaravans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedCaravan, setSelectedCaravan] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCalendar = (caravan) => {
    setSelectedCaravan(caravan);
    setCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setCalendarOpen(false);
    setSelectedCaravan(null);
  };

  const handleOpenForm = (caravan = null) => {
    setSelectedCaravan(caravan);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedCaravan(null);
    fetchData(); // Refetch data after form is closed
  };

  if (loading) {
    return <p>Loading your caravans...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Caravans</h2>
        <button
          onClick={() => handleOpenForm()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Caravan
        </button>
      </div>

      {caravans.length === 0 ? (
        <div className="text-center py-12">
            <p className="text-gray-500">You have not listed any caravans yet.</p>
            <button
                onClick={() => handleOpenForm()}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
                Add Your First Caravan
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caravans.map((caravan) => (
            <CaravanCard
              key={caravan._id}
              caravan={caravan}
              onOpenCalendar={() => handleOpenCalendar(caravan)}
              onEdit={() => handleOpenForm(caravan)}
            />
          ))}
        </div>
      )}


      <Modal isOpen={isCalendarOpen} onClose={handleCloseCalendar}>
        {selectedCaravan && (
          <AvailabilityCalendar
            caravan={selectedCaravan}
            reservations={reservations}
            onClose={handleCloseCalendar}
          />
        )}
      </Modal>

      <Modal isOpen={isFormOpen} onClose={handleCloseForm}>
        <CaravanForm
          caravan={selectedCaravan}
          onSave={handleCloseForm}
        />
      </Modal>
    </div>
  );
};

export default MyCaravansView;

export default MyCaravansView;
