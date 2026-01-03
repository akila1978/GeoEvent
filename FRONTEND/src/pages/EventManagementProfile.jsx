import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, MapPin, Mail, Edit, Calendar, DollarSign, 
  Star, MoreVertical, Clock, CheckCircle, Plus, X, AlertCircle, 
  Upload, Image as ImageIcon, Sun, Moon 
} from 'lucide-react';

const EventManagementProfile = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  // අලුත් Event එක සඳහා Data
  const [formData, setFormData] = useState({
    title: '', date: '', time: '', location: '', 
    description: '', price: '', image: null, previewUrl: ''
  });

  // දැනට Log වී ඇති User
  const user = JSON.parse(localStorage.getItem('currentUser')) || {
    id: 1, 
    name: "Kamal Perera",
    role: "Event Organizer",
    location: "Colombo, Sri Lanka",
    email: "kamal@evgo.com",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    coverImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  };

  // Dark Mode Toggle Logic
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Backend එකෙන් Events ලබා ගැනීම
  useEffect(() => {
    axios.get(`http://localhost:5000/api/my-events/${user.id}`)
      .then(res => setEvents(res.data))
      .catch(err => console.error("Error fetching events:", err));
  }, [user.id]);

  // Image Select කරන විට
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  // Event Submit කිරීම (Updated with Error Handling)
  const handleCreateEvent = (e) => {
    e.preventDefault();
    
    // Debugging: Console එකේ බලන්න දත්ත එනවද කියලා
    console.log("Submitting Event Data:", formData);

    const eventPayload = {
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
      ticket_price: formData.price,
      organizer_id: user.id,
      // image: formData.image (Backend implementation needed for file upload)
    };

    axios.post('http://localhost:3001/api/add-event', eventPayload)
    .then(res => {
      console.log("Success Response:", res.data);
      alert("Event submitted successfully! Waiting for Admin approval.");
      setShowModal(false);
      window.location.reload();
    })
    .catch(err => {
      console.error("Submission Error:", err);
      
      // Error Handling: ප්‍රශ්නය මොකක්ද කියලා User ට කියන්න
      if (err.code === "ERR_NETWORK") {
        alert("Cannot connect to server! Please check if your Backend (Node.js) is running on Port 3001.");
      } else if (err.response) {
        // Server එකෙන් Error එකක් ආවා නම් (උදා: Database Error)
        alert(`Server Error: ${err.response.data.message || "Failed to save event."}`);
      } else {
        alert("An unexpected error occurred. Check the console for details.");
      }
    });
  };

  const stats = {
    totalEvents: events.length,
    approvedEvents: events.filter(e => e.status === 'approved').length,
    pendingEvents: events.filter(e => e.status === 'pending').length,
    rating: 4.8 
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* 1. HEADER SECTION */}
      <div className={`shadow-sm pb-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white'}`}>
        <div className="h-60 w-full relative group">
          <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-40 transition"></div>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition border border-white/30"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>

          <button className="absolute bottom-4 right-4 bg-white/90 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-white transition flex items-center gap-2">
            <Upload className="w-4 h-4" /> Change Cover
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
            <div className="relative">
              <img src={user.profileImage} alt="Profile" className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 shadow-lg object-cover ${darkMode ? 'border-gray-800' : 'border-white'}`} />
              <button className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 border-2 border-white dark:border-gray-800">
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 mb-2">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h1>
              <p className="text-indigo-500 font-medium">{user.role}</p>
              <div className={`flex items-center mt-2 space-x-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {user.location}</span>
                <span className="flex items-center"><Mail className="w-4 h-4 mr-1"/> {user.email}</span>
              </div>
            </div>
          </div>

          {/* 2. STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'blue' },
              { label: 'Live Events', value: stats.approvedEvents, icon: CheckCircle, color: 'green' },
              { label: 'Pending', value: stats.pendingEvents, icon: Clock, color: 'yellow' },
              { label: 'Rating', value: `${stats.rating}/5.0`, icon: Star, color: 'purple' },
            ].map((stat, index) => (
              <div key={index} className={`p-4 rounded-xl border shadow-sm flex items-center gap-4 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 dark:bg-${stat.color}-900/30 dark:text-${stat.color}-400`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 3. TABS NAVIGATION */}
          <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="-mb-px flex space-x-8">
              {['events', 'settings'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition capitalize
                    ${activeTab === tab 
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                    }`}
                >
                  {tab === 'events' ? 'My Events' : 'Settings'}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* 4. CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Managed Events</h2>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition transform hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Create New Event
              </button>
            </div>

            <div className={`rounded-xl shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {events.length === 0 ? (
                  <li className="p-10 text-center flex flex-col items-center text-gray-500">
                    <Calendar className="w-10 h-10 mb-2 opacity-50" />
                    <p>No events found. Start by creating one!</p>
                  </li>
                ) : (
                  events.map((event) => (
                    <li key={event.id} className={`p-6 transition ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                             {/* Event Image Placeholder logic */}
                             <Calendar className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}/>
                          </div>
                          
                          <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                            <div className={`flex flex-wrap items-center text-sm mt-1 gap-x-4 gap-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {event.date ? event.date.split('T')[0] : 'N/A'}</span>
                              <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {event.time || 'N/A'}</span>
                              <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {event.location}</span>
                              <span className="flex items-center font-semibold text-indigo-500"><DollarSign className="w-3 h-3 mr-1"/> {event.ticket_price || 'Free'}</span>
                              
                              <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border
                                ${event.status === 'approved' 
                                  ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                                  : event.status === 'pending' 
                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' 
                                    : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
                                {event.status === 'approved' ? <CheckCircle className="w-3 h-3 mr-1"/> : <Clock className="w-3 h-3 mr-1"/>}
                                {event.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end md:space-x-8">
                           {event.status === 'pending' && (
                             <div className="hidden md:flex items-center text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-md border border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-500 dark:border-yellow-800">
                               <AlertCircle className="w-3 h-3 mr-1" />
                               Waiting for approval
                             </div>
                           )}
                           <button className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} p-2`}>
                             <MoreVertical className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className={`p-10 rounded-xl shadow-sm border text-center ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Account Settings will be implemented here.</p>
           </div>
        )}
      </div>

      {/* --- ADD EVENT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4 transition-opacity">
          <div className={`rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <button 
              onClick={() => setShowModal(false)}
              className={`absolute top-4 right-4 p-1 rounded-full transition ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold">Create New Event</h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fill in the details below. Your event will be reviewed by an admin.</p>
            </div>
            
            <form onSubmit={handleCreateEvent} className="space-y-5">
              
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold">Event Cover Image</label>
                <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden group
                  ${darkMode ? 'border-gray-600 hover:border-indigo-500 bg-gray-700/50' : 'border-gray-300 hover:border-indigo-500 bg-gray-50'}`}>
                  
                  {formData.previewUrl ? (
                    <img src={formData.previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-3 rounded-full inline-block mb-2">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium">Click to upload cover image</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Event Title</label>
                  <input 
                    type="text" required
                    className={`w-full border rounded-lg p-2.5 outline-none transition focus:ring-2 focus:ring-indigo-500 
                      ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-indigo-500' : 'bg-white border-gray-300 focus:border-indigo-500'}`}
                    placeholder="e.g. Grand Music Festival"
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Location</label>
                  <div className="relative">
                    <MapPin className={`absolute left-3 top-3 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input 
                      type="text" required
                      className={`w-full border rounded-lg p-2.5 pl-10 outline-none transition focus:ring-2 focus:ring-indigo-500 
                        ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400' : 'bg-white border-gray-300'}`}
                      placeholder="City, Venue"
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Date</label>
                  <input 
                    type="date" required
                    className={`w-full border rounded-lg p-2.5 outline-none transition focus:ring-2 focus:ring-indigo-500 
                      ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Time</label>
                  <input 
                    type="time" required
                    className={`w-full border rounded-lg p-2.5 outline-none transition focus:ring-2 focus:ring-indigo-500 
                      ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Ticket Price (LKR)</label>
                  <div className="relative">
                    <span className={`absolute left-3 top-2.5 font-bold text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rs.</span>
                    <input 
                      type="number" required
                      className={`w-full border rounded-lg p-2.5 pl-10 outline-none transition focus:ring-2 focus:ring-indigo-500 
                        ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400' : 'bg-white border-gray-300'}`}
                      placeholder="1500"
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea 
                  className={`w-full border rounded-lg p-2.5 outline-none transition h-24 resize-none focus:ring-2 focus:ring-indigo-500 
                    ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  placeholder="Describe what the event is about..."
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                 <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition 
                    ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 active:scale-[0.98] transition shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Submit Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventManagementProfile;