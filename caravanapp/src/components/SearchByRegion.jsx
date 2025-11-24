import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { dummyCaravans } from "./dashboard/data";
import Map from "./Map";

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

const CaravanListItem = ({ caravan, onMouseEnter, onMouseLeave }) => (
  <div
    className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <img
      src={caravan.image}
      alt={caravan.name}
      className="w-24 h-16 object-cover rounded-md"
    />
    <div>
      <h4 className="font-bold text-gray-800">{caravan.name}</h4>
      <p className="text-sm text-gray-600">${caravan.price} / night</p>
    </div>
  </div>
);

const SearchByRegion = () => {
  const [selectedRegion, setSelectedRegion] = useState(regionGroups[0]);
  const [hoveredCaravanId, setHoveredCaravanId] = useState(null);

  const filteredCaravans = useMemo(
    () => dummyCaravans.filter((c) => c.regionCategory === selectedRegion),
    [selectedRegion],
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Search by Region</h1>

      {/* Region Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {regionGroups.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedRegion === region
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-indigo-100 border"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Left Side: Filtered List */}
        <div className="lg:col-span-1 h-[600px] overflow-y-auto pr-4">
          <h2 className="text-xl font-bold mb-4">
            Caravans in {selectedRegion}
          </h2>
          <div className="space-y-4">
            {filteredCaravans.length > 0 ? (
              filteredCaravans.map((caravan) => (
                <Link to={`/caravans/${caravan.id}`} key={caravan.id}>
                  <CaravanListItem
                    caravan={caravan}
                    onMouseEnter={() => setHoveredCaravanId(caravan.id)}
                    onMouseLeave={() => setHoveredCaravanId(null)}
                  />
                </Link>
              ))
            ) : (
              <p className="text-gray-500">
                No caravans available in this region.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="md:col-span-1 lg:col-span-2 h-[600px] rounded-lg overflow-hidden">
          <Map
            caravans={filteredCaravans}
            hoveredCaravanId={hoveredCaravanId}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchByRegion;
