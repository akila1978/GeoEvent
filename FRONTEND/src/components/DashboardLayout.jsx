// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Users, Calendar, CheckCircle, XCircle, 
  AlertCircle, LogOut, MapPin, Clock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, events: 0, pending: 0 });
  const [pendingEvents, setPendingEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Data Fetching
  useEffect(() => {
    fetchStats();
    fetchPendingEvents();
  }, []);

  const fetchStats = () => {
    axios.get('http://localhost:5000/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  };

  const fetchPendingEvents = () => {
    axios.get('http://localhost:5000/api/admin/pending-events')
      .then(res => setPendingEvents(res.data))
      .catch(err => console.error(err));
  };

  // Event Approval Handler
  const handleEventAction = (id, status) => {
    if(!window.confirm(`Are you sure you want to ${status} this event?`)) return;

    axios.put(`http://localhost:5000/api/admin/update-event-status/${id}`, { status })
      .then(res => {
        if(res.data.Status === "Success") {
          alert(`Event ${status} successfully!`);
          fetchPendingEvents(); // ලිස්ට් එක refresh කරනවා
          fetchStats();
        } else {
          alert("Error updating event");
        }
      })
      .catch(err => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user session
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-purple-400">GeoAdmin</h1>
          <p className="text-xs text-slate-400 mt-1">Control Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'events' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Calendar size={20} />
            <span>Manage Events</span>
            {stats.pending > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.pending}</span>}
          </button>

          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition">
            <Users size={20} />
            <span>Users</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition w-full px-4">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* --- STATS CARDS --- */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.users}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users size={24} /></div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.events}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Calendar size={24} /></div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase">Pending Approvals</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full text-orange-600"><AlertCircle size={24} /></div>
              </div>
            </div>
            
            {/* Recent Activity Section could go here */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center py-20">
               <p className="text-gray-400">Select "Manage Events" to approve pending requests.</p>
            </div>
          </div>
        )}

        {/* --- PENDING EVENTS TABLE --- */}
        {(activeTab === 'events' || activeTab === 'dashboard') && (
           <div className="mt-8">
             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="text-orange-500" /> Pending Approvals
             </h3>
             
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               {pendingEvents.length === 0 ? (
                 <div className="p-10 text-center text-gray-500">No pending events to review. Good job! 🎉</div>
               ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                     <thead className="bg-gray-50 border-b border-gray-200">
                       <tr>
                         <th className="p-4 text-sm font-semibold text-gray-600">Event Name</th>
                         <th className="p-4 text-sm font-semibold text-gray-600">Date & Time</th>
                         <th className="p-4 text-sm font-semibold text-gray-600">Location</th>
                         <th className="p-4 text-sm font-semibold text-gray-600">Organizer ID</th>
                         <th className="p-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                       {pendingEvents.map((event) => (
                         <tr key={event.id} className="hover:bg-gray-50 transition">
                           <td className="p-4">
                             <p className="font-bold text-gray-900">{event.title}</p>
                             <p className="text-xs text-gray-500 truncate max-w-[200px]">{event.description}</p>
                           </td>
                           <td className="p-4 text-sm text-gray-600">
                             <div className="flex items-center gap-1"><Calendar size={14}/> {event.date ? event.date.split('T')[0] : ''}</div>
                             <div className="flex items-center gap-1 mt-1"><Clock size={14}/> {event.time}</div>
                           </td>
                           <td className="p-4 text-sm text-gray-600 flex items-center gap-1">
                             <MapPin size={14} /> {event.location}
                           </td>
                           <td className="p-4 text-sm text-gray-500">#{event.organizer_id}</td>
                           <td className="p-4">
                             <div className="flex justify-center gap-3">
                               <button 
                                 onClick={() => handleEventAction(event.id, 'approved')}
                                 className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium"
                               >
                                 <CheckCircle size={16} /> Approve
                               </button>
                               <button 
                                 onClick={() => handleEventAction(event.id, 'rejected')}
                                 className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                               >
                                 <XCircle size={16} /> Reject
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )}
             </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;