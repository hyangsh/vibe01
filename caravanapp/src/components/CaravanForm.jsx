import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaravanForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    amenities: "",
    location: "",
    dailyRate: "",
    photos: "", // Added photos field
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, capacity, amenities, location, dailyRate, photos } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const caravanData = {
      ...formData,
      capacity: parseInt(formData.capacity, 10),
      dailyRate: parseFloat(formData.dailyRate),
      amenities: amenities.split(",").map((item) => item.trim()),
      photos: photos.split(",").map((item) => item.trim()), // Assuming photos are comma-separated URLs
    };

    try {
      // Axios default headers should already include the x-auth-token from login
      await axios.post("http://localhost:5000/api/caravans", caravanData);
      navigate("/"); // Redirect to home to see the new caravan
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Could not create caravan. Please try again.",
      );
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          List Your Caravan
        </h1>
        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-center text-sm text-red-800 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Caravan Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g., The Wanderer"
                name="name"
                value={name}
                onChange={onChange}
                required
                className="mt-1 w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700"
              >
                Capacity
              </label>
              <input
                id="capacity"
                type="number"
                placeholder="e.g., 4"
                name="capacity"
                value={capacity}
                onChange={onChange}
                required
                className="mt-1 w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g., Yosemite, CA"
              name="location"
              value={location}
              onChange={onChange}
              required
              className="mt-1 w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="dailyRate"
              className="block text-sm font-medium text-gray-700"
            >
              Daily Rate ($)
            </label>
            <input
              id="dailyRate"
              type="number"
              placeholder="e.g., 150"
              name="dailyRate"
              value={dailyRate}
              onChange={onChange}
              required
              className="mt-1 w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="amenities"
              className="block text-sm font-medium text-gray-700"
            >
              Amenities
            </label>
            <input
              id="amenities"
              type="text"
              placeholder="Kitchen, AC, WiFi (comma-separated)"
              name="amenities"
              value={amenities}
              onChange={onChange}
              className="mt-1 w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="photos"
              className="block text-sm font-medium text-gray-700"
            >
              Photo URLs
            </label>
            <input
              id="photos"
              type="text"
              placeholder="https://.../img1.jpg, https://.../img2.jpg"
              name="photos"
              value={photos}
              onChange={onChange}
              className="mt-1 w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cta-black disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Create Caravan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaravanForm;
