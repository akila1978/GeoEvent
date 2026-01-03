import React from 'react';
import { MapPin } from 'lucide-react';

const MapPage = () => {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 overflow-y-auto p-4 border-r border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 px-2">Nearby Events</h2>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex gap-4 p-3 mb-3 rounded-xl hover:bg-purple-50 dark:hover:bg-gray-700 cursor-pointer transition">
            <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
               <img 
                 src={`https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=200`} 
                 alt="event" 
                 className="w-full h-full object-cover"
               />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">Music Live Show {item}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <MapPin size={14} className="mr-1" /> Colombo 0{item}
              </p>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded mt-2 inline-block">
                Upcoming
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Map Area */}
      <div className="w-full h-full md:w-2/3 bg-gray-200 relative">
        <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585966456!2d79.80832009278964!3d6.921838618588363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
            className="filter grayscale-[20%] contrast-[1.1] dark:grayscale-[50%] dark:invert-[90%] w-full h-full"
            loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default MapPage;