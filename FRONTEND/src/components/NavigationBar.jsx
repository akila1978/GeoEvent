import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, User, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

const NavigationBar = () => {
  const { theme, toggleTheme } = useTheme();
  // 1. වෙනස්කම: මෙතනට 'user' එකත් ගත්තා role එක චෙක් කරන්න
  const { isLoggedIn, logout, user } = useUser(); 
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Map', path: '/map' },
    { name: 'About', path: '/about' }
  ];

  const isActive = (path) => location.pathname === path;

  // 2. වෙනස්කම: Profile Path එක තීරණය කරන තැන
  // user.role එක 'event_management' නම් manager dashboard එකට, නැත්නම් normal profile එකට
  const profilePath = user?.role === 'event_management' ? '/manager-dashboard' : '/profile';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-6 py-4 relative flex justify-between items-center">
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2 group z-20">
          <div className="bg-purple-600 p-2 rounded-lg text-white">
            <MapPin size={24} />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white tracking-wide">
            Geo<span className="text-purple-600">Event</span>
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-300 ${
                isActive(link.path)
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side: Auth Buttons & Theme Toggle */}
        <div className="flex items-center space-x-4 z-20">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {isLoggedIn ? (
            /* Logged In View */
            <div className="flex items-center space-x-3">
              
              {/* 3. වෙනස්කම: මෙතන link එක dynamic කළා */}
              <Link 
                to={profilePath} 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 font-medium text-sm"
              >
                <User size={18} />
                <span className="hidden sm:block">
                    {/* නම පෙන්නන්න ඕන නම් මෙතන {user?.name} දාන්නත් පුළුවන් */}
                    Profile
                </span>
              </Link>

              <button 
                onClick={logout} 
                className="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            /* Logged Out View */
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-all shadow-sm"
              >
                Log In
              </Link>
              
              <Link 
                to="/signup" 
                className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 dark:text-gray-300">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;