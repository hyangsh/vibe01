import React from "react";
import { PencilIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";

const CaravanCard = ({ caravan, onOpenCalendar }) => {
  const { name, photos, status } = caravan;

  const getStatusBadgeColor = () => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "rented":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const imageUrl =
    photos && photos.length > 0
      ? `/api/images/${photos[0]}`
      : "https://via.placeholder.com/400x225";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">License Type: Placeholder</p>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor()}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3">
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PencilIcon className="h-5 w-5 text-gray-500 mr-2" />
            Edit
          </button>
          <button
            onClick={onOpenCalendar}
            className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CalendarDaysIcon className="h-5 w-5 text-white mr-2" />
            Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaravanCard;
