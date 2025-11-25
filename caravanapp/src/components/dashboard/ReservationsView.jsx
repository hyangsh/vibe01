import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import ReservationsTable from "./ReservationsTable";

const ReservationsView = () => {
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/reservations/host');
        setReservations(res.data);
      } catch (err) {
        setError("Failed to fetch reservations.");
        console.error('Error fetching reservations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/api/reservations/${id}`, { status: newStatus });
      setReservations(
        reservations.map((r) => (r._id === id ? res.data : r)),
      );
    } catch (err) {
        setError("Failed to update reservation status.");
        console.error('Error updating status:', err);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    if (activeTab === "pending") return r.status === "pending";
    if (activeTab === "active") return r.status === "confirmed";
    if (activeTab === "history")
      return ["completed", "cancelled"].includes(r.status);
    return true;
  });

  const tabs = [
    { name: "Pending", key: "pending" },
    { name: "Active", key: "active" },
    { name: "History", key: "history" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Booking Management</h2>
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`${
                activeTab === tab.key
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading reservations...</p>
      ) : (
        <ReservationsTable
          reservations={filteredReservations}
          onAccept={(id) => handleUpdateStatus(id, "confirmed")}
          onReject={(id) => handleUpdateStatus(id, "cancelled")}
        />
      )}
    </div>
  );
};

export default ReservationsView;
