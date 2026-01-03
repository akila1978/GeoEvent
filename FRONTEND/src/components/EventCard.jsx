import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-purple-100 dark:shadow-none overflow-hidden hover:shadow-2xl hover:shadow-purple-200 dark:hover:shadow-purple-900/20 transition-all duration-300 group h-full flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <img 
            src={event.img} 
            alt={event.title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            New
        </div>
      </div>
      
      {/* Fixed: flex-grow -> grow */}
      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {event.title}
        </h3>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
          <Calendar size={16} className="mr-2 text-purple-500" /> {event.date}
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <MapPin size={16} className="mr-2 text-purple-500" /> {event.loc}
        </div>
        <div className="mt-auto">
            <button className="w-full py-2 rounded-lg border border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-300">
            View Details
            </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;