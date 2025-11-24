import React, { useState, useEffect } from "react";
import axios from "axios";
import ReservationsTable from "./ReservationsTable";

// Dummy data to be used until the API is fully integrated
const dummyReservations = [
  {
    _id: "1",
    guest: { name: "John Doe" },
    caravan: { name: "Cozy Camper" },
    startDate: "2025-12-20",
    endDate: "2025-12-25",
    totalPrice: 500,
    status: "pending",
  },
  {
    _id: "2",
    guest: { name: "Jane Smith" },
    caravan: { name: "Family Fun Finder" },
    startDate: "2026-01-10",
    endDate: "2026-01-15",
    totalPrice: 900,
    status: "pending",
  },
  {
    _id: "3",
    guest: { name: "Peter Jones" },
    caravan: { name: "The Adventurer" },
    startDate: "2025-11-28",
    endDate: "2025-12-02",
    totalPrice: 800,
    status: "confirmed",
  },
  {
    _id: "4",
    guest: { name: "Mary Williams" },
    caravan: { name: "Glamping King" },
    startDate: "2025-11-15",
    endDate: "2025-11-20",
    totalPrice: 1250,
    status: "completed",
  },
  {
    _id: "5",
    guest: { name: "David Brown" },
    caravan: { name: "Budget Traveler" },
    startDate: "2025-12-01",
    endDate: "2025-12-05",
    totalPrice: 320,
    status: "cancelled",
  },
];

const ReservationsView = () => {
  const [reservations, setReservations] = useState(dummyReservations);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false); // Will be set to true when using API

  // TODO: Uncomment this useEffect to fetch real data from the API
  // useEffect(() => {
  //   const fetchReservations = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await axios.get('/api/reservations/host');
  //       setReservations(res.data);
  //     } catch (err) {
  //       console.error('Error fetching reservations:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchReservations();
  // }, []);

  const handleUpdateStatus = (id, newStatus) => {
    setReservations(
      reservations.map((r) => (r._id === id ? { ...r, status: newStatus } : r)),
    );
    // TODO: Add API call to update status on the server
    // axios.put(`/api/reservations/${id}`, { status: newStatus });
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
