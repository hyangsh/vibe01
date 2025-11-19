import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [myCaravans, setMyCaravans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCaravans = async () => {
      try {
        // This assumes the user's auth token is sent automatically by axios interceptors
        const res = await axios.get('http://localhost:5000/api/caravans/my-caravans');
        setMyCaravans(res.data);
      } catch (err) {
        // It's okay if this fails, it likely means the user is not logged in
        // or has no caravans. We can silently ignore the error.
        console.log("Could not fetch user's caravans, probably not logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCaravans();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome to CaravanShare</h1>
      
      {loading ? (
        <p className="text-center">Loading your caravans...</p>
      ) : myCaravans.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6">My Registered Caravans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCaravans.map((caravan) => (
              <div key={caravan._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <Link to={`/caravans/${caravan._id}`}>
                  <img src={caravan.photos?.[0] || 'https://source.unsplash.com/random/800x600?caravan'} alt={caravan.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{caravan.name}</h3>
                    <p className="text-gray-600">{caravan.location}</p>
                    <p className="mt-2 text-lg font-semibold text-gray-800">${caravan.dailyRate} / day</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center bg-gray-100 p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">You have no registered caravans.</h2>
          <p className="mb-6">Why not list your caravan and start earning?</p>
          <Link to="/create-caravan" className="btn-cta-orange">
            List Your Caravan
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
