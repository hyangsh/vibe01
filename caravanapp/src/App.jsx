import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CaravanList from './components/CaravanList';
import CaravanDetails from './components/CaravanDetails';
import CaravanForm from './components/CaravanForm';
import './App.css';

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
        </Routes>
      </main>
    </Router>
  );
}

export default App;