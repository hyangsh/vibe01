import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import CaravanList from "./components/CaravanList";
import CaravanDetails from "./components/CaravanDetails";
import CaravanForm from "./components/CaravanForm";
import Reservations from "./components/Reservations";
import HostDashboard from "./components/HostDashboard";
import Profile from "./components/Profile";
import BookingConfirmation from "./components/BookingConfirmation";
import SearchByRegion from "./components/SearchByRegion";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/caravans" element={<CaravanList />} />
          <Route path="/caravans/:id" element={<CaravanDetails />} />
          <Route path="/create-caravan" element={<CaravanForm />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/host-dashboard" element={<HostDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route
            path="/booking-confirmation"
            element={<BookingConfirmation />}
          />
          <Route path="/search" element={<SearchByRegion />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
