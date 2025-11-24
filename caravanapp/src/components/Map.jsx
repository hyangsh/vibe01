import React, { useEffect, useRef, useState } from "react";

const Map = ({ caravans, hoveredCaravanId }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [isMapReady, setMapReady] = useState(false);

  // Poll for the Kakao Maps SDK to be loaded
  useEffect(() => {
    const checkKakao = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setMapReady(true);
        });
      } else {
        setTimeout(checkKakao, 100); // Check again in 100ms
      }
    };
    checkKakao();
  }, []);

  // 1. Initialize map once the SDK is ready
  useEffect(() => {
    if (!isMapReady || !mapContainer.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(36.5, 127.5),
      level: 13,
    };
    map.current = new window.kakao.maps.Map(mapContainer.current, options);
  }, [isMapReady]);

  // 2. Update markers and bounds when caravan list changes
  useEffect(() => {
    if (!isMapReady || !map.current || !window.kakao) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.setMap(null));
    markers.current = [];

    if (caravans.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();

    const newMarkers = caravans.map((caravan) => {
      const position = new window.kakao.maps.LatLng(caravan.lat, caravan.lng);
      const marker = new window.kakao.maps.Marker({
        position: position,
      });

      marker.setMap(map.current);
      bounds.extend(position);

      marker.caravanId = caravan.id;
      return marker;
    });

    markers.current = newMarkers;
    map.current.setBounds(bounds);
  }, [caravans, isMapReady]);

  // 3. Highlight marker on hover
  useEffect(() => {
    if (!isMapReady || !map.current || !window.kakao) return;

    markers.current.forEach((marker) => {
      const isHovered = marker.caravanId === hoveredCaravanId;
      marker.setZIndex(isHovered ? 10 : 0);
    });
  }, [hoveredCaravanId, isMapReady]);

  if (!isMapReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full" style={{ height: "600px" }} />
  );
};

export default Map;
