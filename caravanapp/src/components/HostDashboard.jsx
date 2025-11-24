import React, { useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import OverviewView from "./dashboard/OverviewView";
import MyCaravansView from "./dashboard/MyCaravansView";
import ReservationsView from "./dashboard/ReservationsView";
import MessagingView from "./dashboard/MessagingView"; // Import the new view

const PlaceholderView = ({ title }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>
        This is a placeholder for the {title} view. Content will be added soon.
      </p>
    </div>
  </div>
);

const HostDashboard = () => {
  const [activeView, setActiveView] = useState("Overview");

  const renderView = () => {
    switch (activeView) {
      case "Overview":
        return <OverviewView />;
      case "My Caravans":
        return <MyCaravansView />;
      case "Reservations":
        return <ReservationsView />;
      case "Messaging":
        return <MessagingView />; // Render the new component
      case "Maintenance Log":
        return <PlaceholderView title="Maintenance Log" />;
      case "Settings":
        return <PlaceholderView title="Settings" />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">{renderView()}</main>
      </div>
    </div>
  );
};

export default HostDashboard;
