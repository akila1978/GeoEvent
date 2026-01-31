// src/pages/EventManagementProfile.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { 
  User, MapPin, Mail, Edit, Calendar, Star, CheckCircle, Plus, X, 
  Image as ImageIcon, Sun, Moon, Camera, Clock 
} from 'lucide-react';

const EventManagementProfile = () => {
  // --- STATE VARIABLES ---
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { user: storedUser } = useUser();

  const user = {
    id: storedUser?.id || 0,
    name: storedUser?.name || "Guest User",
    email: storedUser?.email || "No Email",
    role: storedUser?.role || "User",
    location: storedUser?.location || "Colombo, Sri Lanka",
    profileImage: storedUser?.profileImage || "", 
    coverImage: storedUser?.coverImage || ""
  };

  // --- PREVIEW STATES (මේවා පාවිච්චි වෙනවා දැන්) ---
  const [profilePreview, setProfilePreview] = useState(user.profileImage);
  const [coverPreview, setCoverPreview] = useState(user.coverImage);
  
  // --- REFS (මේවා පාවිච්චි වෙනවා දැන්) ---
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // --- FORM DATA STATE ---
  const [formData, setFormData] = useState({
    title: '', category: 'Music', date: '', time: '', location: '', 
    description: '', price: '', image: null, previewUrl: ''
  });

  // Dark Mode Logic
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Fetch Events
  useEffect(() => {
    if (user.id) {
        axios.get(`/api/my-events/${user.id}`)
        .then(res => setEvents(res.data))
        .catch(err => console.error("Error fetching events:", err));
    }
  }, [user.id]);

  // Image Select Handlers
  const handleProfileImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePreview(URL.createObjectURL(file));
  };

  const handleCoverImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  // Submit Event Handler
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    if (!user.id || user.id === 0) {
      alert("You must be logged in to create an event. Please log in again.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('ticket_price', formData.price);
    formDataToSend.append('organizer_id', user.id);

    if (formData.image) {
        formDataToSend.append('image', formData.image);
    }

    try {
      const response = await axios.post('/api/add-event', formDataToSend);

      if (response.status === 201 || response.data.Status === "Success") {
        alert("Event submitted successfully! Waiting for Admin approval.");
        setShowModal(false); 
        
        const newEvent = {
            ...formData, 
            image: response.data.image,
            id: response.data.id, 
            status: 'pending' 
        };
        setEvents([newEvent, ...events]); 
        
        setFormData({
            title: '', category: 'Music', date: '', time: '', location: '', 
            description: '', price: '', image: null, previewUrl: ''
        });

      } else {
        alert("Failed to save event.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Cannot connect to server.");
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* 1. HEADER SECTION (මම මේක ආපහු දැම්මා, දැන් අර Error එන්නේ නෑ) */}
      <div className={`shadow-sm pb-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white'}`}>
        
        {/* Cover Photo Area */}
        <div className="h-60 w-full relative group bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm font-medium">No Cover Photo</p>
                </div>
            )}
            
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition duration-300"></div>

            {/* Refs Used Here */}
            <input type="file" ref={coverInputRef} onChange={handleCoverImageSelect} className="hidden" accept="image/*" />

            <button onClick={() => setDarkMode(!darkMode)} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition border border-white/30 z-10">
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            <button onClick={() => coverInputRef.current.click()} className="absolute bottom-4 right-4 bg-white/90 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-white transition flex items-center gap-2 z-10">
                <Camera className="w-4 h-4" /> Change Cover
            </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
            
            {/* Profile Photo Area */}
            <div className="relative group">
                {/* Refs Used Here */}
                <input type="file" ref={profileInputRef} onChange={handleProfileImageSelect} className="hidden" accept="image/*" />

                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 shadow-lg overflow-hidden flex items-center justify-center ${darkMode ? 'border-gray-800 bg-gray-700' : 'border-white bg-gray-200'}`}>
                    {profilePreview ? (
                        <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className={`w-20 h-20 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                </div>

                <button onClick={() => profileInputRef.current.click()} className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 border-2 border-white dark:border-gray-800 transition transform hover:scale-110">
                    <Edit className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 mb-2">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h1>
              <div className="flex items-center gap-2">
                 <p className="text-indigo-500 font-medium uppercase tracking-wide text-sm">{user.role}</p>
              </div>
              <div className={`flex items-center mt-2 space-x-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {user.location}</span>
                <span className="flex items-center"><Mail className="w-4 h-4 mr-1"/> {user.email}</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs (Using activeTab) */}
          <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="-mb-px flex space-x-8">
                <button 
                    onClick={() => setActiveTab('events')} 
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition capitalize ${activeTab === 'events' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500'}`}
                >
                    My Events
                </button>
                <button 
                    onClick={() => setActiveTab('settings')} 
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition capitalize ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500'}`}
                >
                    Settings
                </button>
            </nav>
          </div>
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-10">
          
        {/* Events Tab Content */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Managed Events</h2>
                <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition transform hover:scale-105">
                    <Plus className="w-4 h-4" /> Create New Event
                </button>
            </div>

            {/* Event List */}
            <div className="space-y-4">
                {events.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center text-gray-500 border rounded-lg">
                        <Calendar className="w-10 h-10 mb-2 opacity-50" />
                        <p>No events found. Start by creating one!</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className={`p-4 rounded-lg flex items-center justify-between border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                                    {event.image ? (
                                        <img src={`/uploads/${event.image}`} alt={event.title} className="w-full h-full object-cover"/>
                                    ) : <div className="w-full h-full flex items-center justify-center"><Calendar /></div>}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                    <div className="flex items-center gap-2 text-sm opacity-70 mt-1">
                                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-bold">{event.category}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize ${event.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-1">{event.date ? event.date.split('T')[0] : ''} | {event.location}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">{event.ticket_price ? `Rs. ${event.ticket_price}` : 'Free'}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>
        )}

        {/* Settings Tab Placeholder */}
        {activeTab === 'settings' && (
            <div className="p-10 text-center text-gray-500">
                <p>Settings panel coming soon...</p>
            </div>
        )}

      </div>

      {/* 3. MODAL (Event Create Form) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4 backdrop-blur-sm">
            <div className={`rounded-2xl w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <div className="flex justify-between mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold">Create New Event</h2>
                    <button onClick={() => setShowModal(false)} className="hover:text-red-500 transition"><X /></button>
                </div>
                
                <form onSubmit={handleCreateEvent} className="space-y-4">
                    {/* Image Input */}
                    <div className="space-y-2">
                         <label className="block text-sm font-semibold">Event Cover Image</label>
                         <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 transition relative bg-gray-50 dark:bg-gray-900/50">
                            {formData.previewUrl ? (
                                <img src={formData.previewUrl} className="h-48 mx-auto object-cover rounded-lg shadow-md" alt="Preview" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <ImageIcon className="w-8 h-8 mb-2" />
                                    <p className="text-sm">Click to upload image</p>
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                const file = e.target.files[0];
                                if(file) setFormData({...formData, image: file, previewUrl: URL.createObjectURL(file)});
                            }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Event Title</label>
                            <input type="text" required className="border p-2.5 rounded-lg w-full text-black focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold mb-1">Category</label>
                            <select 
                                className="border p-2.5 rounded-lg w-full text-black focus:ring-2 focus:ring-indigo-500 outline-none"
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                value={formData.category}
                            >
                                <option value="Music">Music</option>
                                <option value="Technology">Technology</option>
                                <option value="Arts">Arts</option>
                                <option value="Sports">Sports</option>
                                <option value="Movies">Movies</option>
                                <option value="Education">Education</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Date</label>
                            <input type="date" required className="border p-2.5 rounded-lg w-full text-black" onChange={e => setFormData({...formData, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Time</label>
                            <input type="time" required className="border p-2.5 rounded-lg w-full text-black" onChange={e => setFormData({...formData, time: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Location</label>
                            <input type="text" required className="border p-2.5 rounded-lg w-full text-black" onChange={e => setFormData({...formData, location: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Price (LKR)</label>
                            <input type="number" required className="border p-2.5 rounded-lg w-full text-black" onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Description</label>
                        <textarea className="border p-2.5 rounded-lg w-full text-black h-24 resize-none" onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition">Submit Event</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default EventManagementProfile;