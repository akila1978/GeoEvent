import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [stats, setStats] = useState({ users: 0, events: 0, pending: 0 });

  // --- HELPER FUNCTIONS (API Calls) ---
  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPendingEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/pending-events');
      setPendingEvents(res.data);
    } catch (err) { console.error(err); }
  };

  // --- USE EFFECT (Page Load) ---
  useEffect(() => {
    // මෙන්න මේ විදිහට අලුත් function එකක් ඇතුලේ call කළාම Error එක එන්නේ නෑ
    const loadInitialData = async () => {
      await fetchStats();
      await fetchPendingEvents();
    };
    loadInitialData();
  }, []);

  // --- APPROVE FUNCTION ---
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/update-event-status/${id}`, { status: 'approved' });
      alert("Event Approved!");
      fetchPendingEvents(); // Refresh List
      fetchStats(); // Update Stats
    } catch (err) { console.error(err); }
  };

  // --- REJECT FUNCTION ---
  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/update-event-status/${id}`, { status: 'rejected' });
      alert("Event Rejected!");
      fetchPendingEvents();
      fetchStats();
    } catch (err) { console.error(err); }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to DELETE this event permanently?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/delete-event/${id}`);
      alert("Event Deleted Permanently!");
      fetchPendingEvents();
      fetchStats();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl">Total Users</h2>
          <p className="text-4xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl">Total Events</h2>
          <p className="text-4xl font-bold">{stats.events}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl">Pending Approvals</h2>
          <p className="text-4xl font-bold">{stats.pending}</p>
        </div>
      </div>

      {/* Pending Events Table */}
      <h2 className="text-2xl font-bold mb-4">Pending Events</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Event Name</th>
              <th className="py-3 px-4 text-left">Organizer ID</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingEvents.length > 0 ? (
              pendingEvents.map((event) => (
                <tr key={event.id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">{event.title}</td>
                  <td className="py-3 px-4">{event.organizer_id}</td>
                  <td className="py-3 px-4">{event.category}</td>
                  <td className="py-3 px-4 flex justify-center gap-2">
                    
                    <button 
                      onClick={() => handleApprove(event.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>

                    <button 
                      onClick={() => handleReject(event.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Reject
                    </button>

                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No pending events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;