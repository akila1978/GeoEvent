import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Calendar, ArrowRight, Star, 
  Music, Ticket, Users, Filter, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAd(true);
    }, 3000); 
    return () => clearTimeout(timer);
  }, []);

  const closeAd = () => {
    setShowAd(false);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    navigate('/events'); // Movies click කළාමත් මෙතනින් Events පිටුවට යයි
  };

  // Dummy Data
  const events = [
    { 
      id: 1, 
      title: "Colombo Music Festival", 
      date: "Dec 24, 2025", 
      location: "Port City, Colombo", 
      price: "LKR 5,000",
      image: "https://images.unsplash.com/photo-1459749411177-2a2960953ec7?auto=format&fit=crop&q=80&w=1000",
      category: "Music"
    },
    { 
      id: 2, 
      title: "Tech Innovation Summit", 
      date: "Jan 10, 2026", 
      location: "BMICH, Colombo", 
      price: "Free",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000",
      category: "Technology"
    },
    { 
      id: 3, 
      title: "Traditional Art Fair", 
      date: "Dec 28, 2025", 
      location: "Galle Fort", 
      price: "LKR 1,500",
      image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=1000",
      category: "Arts"
    }
  ];

  const artists = [
    { name: "Santhush", role: "Vocalist", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Yohani", role: "Performer", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Bathiya", role: "Vocalist", img: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Umara", role: "Singer", img: "https://randomuser.me/api/portraits/women/68.jpg" },
  ];

  // 👇 මෙන්න මෙතන "Workshops" අයින් කරලා "Movies" දැම්මා
  const categories = ['All', 'Music', 'Technology', 'Arts', 'Sports', 'Movies'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans relative">
      
      {/* --- PROMO POPUP AD --- */}
      {showAd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-bounce-in transform scale-100 transition-transform">
             
             <button 
               onClick={closeAd}
               className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-red-500 hover:text-white transition-colors duration-200 z-10"
             >
               <X size={20} />
             </button>
             
             <div className="h-48 relative">
                 <img 
                   src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" 
                   alt="Promo" 
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded w-fit mb-2">LIMITED OFFER</span>
                    <h3 className="text-3xl font-bold text-white leading-tight">Get 20% OFF</h3>
                    <p className="text-gray-200 text-sm">On your first event booking!</p>
                 </div>
             </div>
             
             <div className="p-6 text-center">
                 <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                   Don't miss out on the biggest events of the year. Sign up now and use code <span className="font-mono font-bold text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">GEO2025</span>
                 </p>
                 <button 
                   onClick={() => { closeAd(); navigate('/events'); }} 
                   className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                 >
                   Book Now
                 </button>
             </div>
           </div>
        </div>
      )}
      
      {/* 1. HERO SECTION WITH ADVANCED SEARCH */}
      <div className="relative h-[600px] flex flex-col items-center justify-center text-center px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-purple-900/70 backdrop-blur-[2px] dark:bg-black/70"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-fade-in-up">
            Discover. Book. <span className="text-purple-400">Experience.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Find the biggest concerts, workshops, and exhibitions happening anywhere in Sri Lanka.
          </p>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 w-full">
              <Search className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Event, Artist or Venue..." 
                className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-white placeholder-gray-400"
              />
            </div>
            <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 w-full">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Colombo, Kandy..." 
                className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-white placeholder-gray-400"
              />
            </div>
            <button 
              onClick={() => navigate('/events')}
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-purple-500/30"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTER (UPDATED) */}
      <section className="container mx-auto px-6 py-10">
        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 border ${
                activeCategory === cat 
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED EVENTS */}
      <section className="container mx-auto px-6 pb-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Trending Events</h2>
          <button 
            onClick={() => navigate('/events')} 
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group">
              <div className="relative h-56">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold text-purple-600">
                  {event.price}
                </div>
                <div className="absolute bottom-4 left-4 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {event.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{event.title}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <Calendar size={16} className="mr-2 text-purple-500" /> {event.date}
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <MapPin size={16} className="mr-2 text-purple-500" /> {event.location}
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/events')}
                  className="w-full py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-300 flex justify-center items-center gap-2"
                >
                  <Ticket size={18} /> Book Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE MAP SECTION */}
      <section className="bg-purple-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <span className="text-purple-600 font-bold tracking-wider uppercase text-sm">Event Map</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mt-2 mb-6">
              Find Events Near You
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Don't just scroll—explore! Use our interactive map to see what's happening around your current location or anywhere in the island.
            </p>
            <button 
               onClick={() => navigate('/map')}
               className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <MapPin size={20} /> Open Map View
            </button>
          </div>
          
          <div className="lg:w-1/2 w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-3xl overflow-hidden shadow-inner relative group">
            <img 
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=1000" 
              alt="Map Preview" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => navigate('/map')}
                  className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-6 py-3 rounded-full font-bold shadow-2xl transform scale-100 group-hover:scale-110 transition-transform"
                >
                  Explore Area
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP ARTISTS SECTION */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10 text-center">Top Artists This Month</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {artists.map((artist, index) => (
            <div key={index} className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800">
                  <img src={artist.img} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h4 className="mt-4 font-bold text-gray-800 dark:text-white group-hover:text-purple-600 transition-colors">{artist.name}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">{artist.role}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;