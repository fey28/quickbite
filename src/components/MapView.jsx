// src/components/GoogleMapView.jsx
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useNavigate } from 'react-router-dom';

const loader = new Loader({
  apiKey: 'AIzaSyCJrhVvnd-cPSwQGTVH9bRXXu8U826enKc', // 🔒 Înlocuiește cu cheia ta reală
  libraries: ['places'],
});

function GoogleMapView({ restaurants = [] }) {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    loader.load().then((google) => {
      if (!mapRef.current) return;

      if (!mapInstance.current) {
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: { lat: 44.43, lng: 26.10 },
          zoom: 13,
           disableDefaultUI: true,
           zoomControl:     true,
        });
      }

      // Șterge markere vechi
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      restaurants.forEach((r) => {
        const marker = new google.maps.Marker({
          map: mapInstance.current,
          position: { lat: r.position[0], lng: r.position[1] },
          title: r.name,
        });

        const info = new google.maps.InfoWindow({
          content: `<div><strong>${r.name}</strong><br>${
            r.id !== 'search-result' ? `<a href='/menu/${r.id}'>Vezi meniul</a>` : '(Rezultat căutare)'
          }</div>`
        });

        marker.addListener('click', () => info.open(mapInstance.current, marker));
        markersRef.current.push(marker);
      });

      // Zoom pe rezultat
      const search = restaurants.find((r) => r.id === 'search-result');
      if (search) {
        mapInstance.current.panTo({ lat: search.position[0], lng: search.position[1] });
        mapInstance.current.setZoom(15);
      }
    });
  }, [restaurants]);

  return <div ref={mapRef} className="h-128 w-full rounded-xl shadow mb-6" />;
}

export default GoogleMapView;
