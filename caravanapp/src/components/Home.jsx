import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Card from "./Card"; // Assuming Card.jsx is in the same directory

const Home = () => {
  const [caravans, setCaravans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaravans = async () => {
      try {
        const res = await api.get("/caravans");
        setCaravans(res.data);
      } catch (err) {
        console.error("Error fetching caravans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaravans();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Welcome to CaravanShare
      </h1>
      <p className="text-lg text-center text-gray-600 mb-12">
        Discover unique caravans for your next adventure.
      </p>

      {loading ? (
        <p className="text-center">Loading caravans...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {caravans.map((caravan) => (
            <Card key={caravan._id} item={caravan} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
