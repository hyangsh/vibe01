import React, { useEffect, useRef } from "react";

const Map = ({ caravans, hoveredCaravanId }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  // 1. Initialize map
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const options = {
        center: new window.kakao.maps.LatLng(36.5, 127.5), // Default center of South Korea
        level: 13,
      };
      map.current = new window.kakao.maps.Map(mapContainer.current, options);
    }
  }, []);

  // 2. Update markers and bounds when caravan list changes
  useEffect(() => {
    if (!map.current || !window.kakao) return;

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

      // Store caravan id in marker for later reference
      marker.caravanId = caravan.id;
      return marker;
    });

    markers.current = newMarkers;
    map.current.setBounds(bounds);
  }, [caravans]);

  // 3. Highlight marker on hover
  useEffect(() => {
    if (!map.current || !window.kakao) return;

    markers.current.forEach((marker) => {
      const isHovered = marker.caravanId === hoveredCaravanId;

      // Example of highlighting: change marker image or size
      // Here, we'll just change the z-index to bring it to the front
      marker.setZIndex(isHovered ? 10 : 0);

      // For a more visible effect, you might use different marker images:
      // const imageSrc = isHovered ? 'hovered_marker.png' : 'normal_marker.png';
      // const imageSize = new window.kakao.maps.Size(36, 36);
      // const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);
      // marker.setImage(markerImage);
    });
  }, [hoveredCaravanId]);

  return (
    <div ref={mapContainer} className="w-full" style={{ height: "600px" }} />
  );
};

export default Map;
