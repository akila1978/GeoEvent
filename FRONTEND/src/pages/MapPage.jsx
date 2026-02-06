import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- LEAFLET ICON FIX (මේ කොටස නැත්නම් Map එකේ Pin එක පේන්නේ නෑ) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// ---------------------------------------------------------------------

// Mock Data (Events තියෙන තැන්)
const eventsData = [
  { id: 1, title: "Music Live Show 1", location: "Colombo Fort", lat: 6.9344, lng: 79.8428, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30" },
  { id: 2, title: "Art Exhibition", location: "Bambalapitiya", lat: 6.8969, lng: 79.8587, image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26" },
  { id: 3, title: "Food Festival", location: "Nugegoda", lat: 6.8649, lng: 79.8997, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1" },
  { id: 4, title: "Tech Meetup", location: "Malabe", lat: 6.9061, lng: 79.9696, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87" },
  { id: 5, title: "Night Market", location: "Dehiwala", lat: 6.8511, lng: 79.8659, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" }
];

// Map එක User ඉන්න තැනට Focus කරන පොඩි Component එකක්
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

const MapPage = () => {
  // Default Location: Colombo (User Location ලැබුනේ නැත්නම් මේක ගන්නවා)
  const [userLocation, setUserLocation] = useState({ lat: 6.9271, lng: 79.8612 });
  const [hasLocation, setHasLocation] = useState(false);

  // 1. Get User Location (Browser එකෙන් User ඉන්න තැන ගන්නවා)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setHasLocation(true);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // 2. Calculate Distance (දුර ගණනය කිරීම - KM වලින්)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth Radius in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); 
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
      
      {/* --- LEFT SIDE: Event List --- */}
      <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 overflow-y-auto p-4 border-r border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 px-2">Nearby Events</h2>
        
        {eventsData.map((event) => {
          const distance = calculateDistance(userLocation.lat, userLocation.lng, event.lat, event.lng);
          return (
            <div key={event.id} className="flex gap-4 p-3 mb-3 rounded-xl hover:bg-purple-50 dark:hover:bg-gray-700 cursor-pointer transition border border-transparent hover:border-purple-200">
              <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
                <img src={`${event.image}?auto=format&fit=crop&q=80&w=200`} alt={event.title} className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <MapPin size={14} className="mr-1" /> {event.location}
                </p>
                <div className="flex items-center mt-2">
                   <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">
                      <Navigation size={12} className="mr-1 fill-current" />
                      {distance} km away
                   </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- RIGHT SIDE: Map --- */}
      <div className="w-full h-full md:w-2/3 relative z-0">
        <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Map එක User ගේ තැනට Update කරනවා */}
          <ChangeView center={[userLocation.lat, userLocation.lng]} />

          {/* User Marker (Blue Pin) */}
          {hasLocation && (
             <Marker position={[userLocation.lat, userLocation.lng]}>
               <Popup>You are here! 📍</Popup>
             </Marker>
          )}

          {/* Event Markers (Red Pins) */}
          {eventsData.map((event) => (
            <Marker key={event.id} position={[event.lat, event.lng]}>
              <Popup>
                <div className="text-center">
                    <b className="text-sm">{event.title}</b><br/>
                    <span className="text-xs text-gray-500">{event.location}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;