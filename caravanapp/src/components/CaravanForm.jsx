import React, { useState, useEffect } from "react";
import api from "../utils/api";

const regionGroups = [
  "서울/경기/인천",
  "강릉/속초/양양",
  "충주/단양/제천",
  "포항/경주/대구",
  "대전/세종/충남",
  "광주/전북/전남",
  "부산/울산/경남",
  "제주",
];

const CaravanForm = ({ caravan, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    amenities: "",
    location: "",
    dailyRate: "",
    region: regionGroups[0],
  });
  const [photos, setPhotos] = useState([]);
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
        region: caravan.region,
      });
    }
  }, [caravan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setPhotos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("capacity", formData.capacity);
    data.append("location", formData.location);
    data.append("dailyRate", formData.dailyRate);
    data.append("region", formData.region);
    data.append("amenities", formData.amenities);

    for (let i = 0; i < photos.length; i++) {
      data.append("photos", photos[i]);
    }

    try {
      if (caravan) {
        // Update logic would need to handle photos separately
        // For now, focusing on creation
        await api.put(`/api/caravans/${caravan._id}`, formData);
      } else {
        await api.post("/api/caravans", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
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
        <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
        <select name="region" id="region" value={formData.region} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          {regionGroups.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
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

      <div>
        <label htmlFor="photos" className="block text-sm font-medium text-gray-700">Photos</label>
        <input type="file" name="photos" id="photos" onChange={handlePhotoChange} multiple accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
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