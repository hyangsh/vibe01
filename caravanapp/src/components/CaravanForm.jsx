import React, { useState, useEffect } from "react";
import api from "../utils/api";

const CaravanForm = ({ caravan, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    amenities: "",
    location: "",
    dailyRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (caravan) {
      setFormData({
        name: caravan.name,
        capacity: caravan.capacity,
        amenities: caravan.amenities.join(", "),
        location: caravan.location,
        dailyRate: caravan.dailyRate,
      });
    }
  }, [caravan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSave = {
      ...formData,
      amenities: formData.amenities.split(",").map((s) => s.trim()),
    };

    try {
      if (caravan) {
        await api.put(`/caravans/${caravan._id}`, dataToSave);
      } else {
        await api.post("/caravans", dataToSave);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{caravan ? "Edit Caravan" : "Add New Caravan"}</h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
      </div>

      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
        <input type="number" name="capacity" id="capacity" value={formData.capacity} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
      </div>

      <div>
        <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700">Daily Rate ($)</label>
        <input type="number" name="dailyRate" id="dailyRate" value={formData.dailyRate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
      </div>

      <div>
        <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
        <input type="text" name="amenities" id="amenities" value={formData.amenities} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onSave} disabled={loading} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default CaravanForm;