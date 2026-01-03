// src/pages/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, MapPin, Calendar } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. LocalStorage එකෙන් User විස්තර ගන්න
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Login වෙලා නැත්නම් Login page එකට යවන්න
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Data මකන්න
    navigate("/login"); // Login එකට යවන්න
  };

  if (!user) return <div className="text-center mt-20 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            
            <div className="relative flex flex-col md:flex-row items-center mt-8">
                {/* Avatar */}
                <div className="w-24 h-24 bg-white p-1 rounded-full shadow-lg">
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <User size={40} />
                    </div>
                </div>
                
                {/* User Info */}
                <div className="md:ml-6 text-center md:text-left mt-4 md:mt-0 flex-grow">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name || "GeoEvent User"}</h1>
                    <div className="flex items-center justify-center md:justify-start text-gray-500 dark:text-gray-400 mt-1">
                        <Mail size={16} className="mr-2" />
                        <span>{user.email}</span>
                    </div>
                </div>

                {/* Logout Button */}
                <button 
                    onClick={handleLogout}
                    className="mt-6 md:mt-0 px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full font-medium hover:bg-red-100 transition-colors flex items-center"
                >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                </button>
            </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-6">
            {/* My Events Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                    <Calendar size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">My Upcoming Events</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">You haven't joined any events yet. Check the map to find some!</p>
            </div>

            {/* Saved Locations Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                    <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Saved Locations</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Your favorite spots will appear here.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;