import React from "react";

const Card = ({ item }) => {
  const { name, location, dailyRate, photos } = item;

  // Use a placeholder image if no photos are available
  const imageUrl =
    photos && photos.length > 0
      ? `/api/images/${photos[0]}`
      : "https://via.placeholder.com/300x200";

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex flex-col">
        <img className="w-full h-48 object-cover" src={imageUrl} alt={name} />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{name}</h3>
          <p className="text-gray-600 mb-2">{location}</p>
          <p className="text-lg font-bold text-gray-900">${dailyRate} / day</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
