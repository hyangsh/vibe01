import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`${baseClasses} ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ReservationsTable = ({ reservations, onAccept, onReject }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Guest Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Caravan
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Dates
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {reservation.guest.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {reservation.caravan.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(reservation.startDate).toLocaleDateString()} -{" "}
                {new Date(reservation.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${reservation.totalPrice}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={reservation.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                {reservation.status === "pending" && (
                  <>
                    <button
                      onClick={() => onAccept(reservation._id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onReject(reservation._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
                {reservation.status === "approved" && (
                  <>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationsTable;
