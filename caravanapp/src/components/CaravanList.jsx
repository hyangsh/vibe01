import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Card from "./Card"; // Import the new Card component

const CaravanList = () => {
  const [caravans, setCaravans] = useState([]);

  useEffect(() => {
    const fetchCaravans = async () => {
      try {
        // The proxy in vite.config.js will handle the full URL
        const res = await api.get("/api/caravans");
        setCaravans(res.data);
      } catch (err) {
        console.error("Error fetching caravans:", err);
      }
    };
    fetchCaravans();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Explore Our Caravans
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {caravans.map((caravan) => (
          <Card key={caravan._id} item={caravan} />
        ))}
      </div>
    </div>
  );
};

export default CaravanList;
