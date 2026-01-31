import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Calendar } from 'lucide-react';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    // 1. Function එක useEffect එක ඇතුලට ගත්තා.
    // දැන් Code එකේ Order එක ගැන ප්‍රශ්නයක් එන්නේ නෑ.
    const fetchEvents = async () => {
      try {
        // Backend එකේ අපි route එක '/api/events' විදිහට වෙනස් කළා මතකනේ?
        const res = await axios.get(`/api/events?category=${category}`);
        // හෝ Proxy පාවිච්චි කරනවා නම්: axios.get(`/api/events?category=${category}`);
        // සටහන: ඔයා backend එකේ route එක '/events' තිබ්බා නම් '/events' දාන්න. '/api/events' නම් ඒක දාන්න.
        // මගේ කලින් code එකේ තිබ්බේ '/events' කියලා, ඉතින් අපි මෙතනත් '/events' ම දාමු.
        
        setEvents(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();
  }, [category]); // category වෙනස් වෙනකොට මේක run වෙනවා

  return (
    <div className="container mx-auto p-4">
      {/* --- HERO SECTION --- */}
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold mb-4">Discover Local Events</h1>
        
        {/* --- CATEGORY FILTER --- */}
        <div className="flex justify-center items-center gap-4">
          <label className="font-semibold text-lg">Filter by Category:</label>
          <select 
            className="border p-2 rounded-lg bg-white shadow-md cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Events</option>
            <option value="Music">Music</option>
            <option value="Tech">Tech</option>
            <option value="Art">Art</option>
            <option value="Sports">Sports</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* --- EVENTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="border rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition duration-300">
              
              {/* Image Display */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={`/uploads/${event.image}`} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=No+Image'}}
                />
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full uppercase font-bold shadow-sm">
                  {event.category}
                </span>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-2 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar size={14}/> {event.date.split('T')[0]}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin size={16} className="mr-1 text-red-500" />
                  {event.location}
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 font-semibold">
                  Book Ticket (Rs. {event.ticket_price})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500 text-lg">No events found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;