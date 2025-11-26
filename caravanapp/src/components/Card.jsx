import React from "react";
import { Link } from "react-router-dom";

const Card = ({ item }) => {
  const { _id, name, location, dailyRate, photos } = item;

  // Use a placeholder image if no photos are available
  const imageUrl =
    photos && photos.length > 0
      ? `http://localhost:5000${photos[0]}`
      : "https://via.placeholder.com/300x200";

  return (
    <Link to={`/caravans/${_id}`} className="block">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl h-full">
        <div className="flex flex-col h-full">
          <img className="w-full h-48 object-cover" src={imageUrl} alt={name} />
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{name}</h3>
            <p className="text-gray-600 mb-2">{location}</p>
            <div className="mt-auto">
              <p className="text-lg font-bold text-gray-900">
                ${dailyRate} / day
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;

