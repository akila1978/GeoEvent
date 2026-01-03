import React, { useState, useEffect } from 'react'; // useEffect එකතු කරා
import axios from 'axios'; // axios install කරගන්න: npm install axios
import { 
  LayoutDashboard, 
  PlusCircle, 
  Calendar, 
  Settings, 
  LogOut, 
  User,
  Upload,
  Save,
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // --- REAL DATA: Pending Events ---
  const [pendingEvents, setPendingEvents] = useState([]);

  // Mock data වෙනුවට Backend එකෙන් Data ගන්න useEffect එක
  useEffect(() => {
    fetchPendingEvents();
  }, [activeTab]); // Tab එක මාරු වෙනකොට Data refresh වෙන්න

  const fetchPendingEvents = async () => {
    try {
        // Port එක 5000 හෝ 3001 දැයි චෙක් කරන්න
        const res = await axios.get('http://localhost:5000/api/admin/pending-events');
        setPendingEvents(res.data);
    } catch (err) {
        console.error("Error fetching pending events:", err);
    }
  };

  // --- ACTION: Handle Approve (Real Backend Call) ---
  const handleApprove = async (id) => {
    const confirm = window.confirm("Are you sure you want to APPROVE this event?");
    if (confirm) {
        try {
            const res = await axios.put(`http://localhost:5000/api/admin/update-event-status/${id}`, {
                status: 'approved'
            });
            
            if(res.data.Status === "Success") {
                alert("Event Approved & Added to Site! ✅");
                // List එකෙන් අයින් කරන්න නැවත fetch කරනවා හෝ filter කරනවා
                setPendingEvents(pendingEvents.filter(event => event.id !== id));
            } else {
                alert("Error updating status");
            }
        } catch (error) {
            console.error(error);
            alert("Connection Error");
        }
    }
  };

  // --- ACTION: Handle Reject (Real Backend Call) ---
  const handleReject = async (id) => {
    const confirm = window.confirm("Are you sure you want to REJECT this event?");
    if (confirm) {
        try {
            const res = await axios.put(`http://localhost:5000/api/admin/update-event-status/${id}`, {
                status: 'rejected'
            });
            
            if(res.data.Status === "Success") {
                alert("Event Rejected! ❌");
                setPendingEvents(pendingEvents.filter(event => event.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    }
  };

  // ... (ඔයාගේ ඉතුරු කෝඩ් එක එහෙමම තියන්න: Sidebar, Forms, etc.)

  // Sidebar Menu Items (Same as before)
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'pending-approvals', label: 'Pending Approvals', icon: AlertCircle }, 
    { id: 'create-event', label: 'Create New Event', icon: PlusCircle },
    // ... other items
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar - Same as before */}
      <aside className="w-64 bg-white shadow-md flex flex-col fixed h-full z-10">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-purple-600">Evgo Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Organizer Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === item.id 
                  ? 'bg-purple-100 text-purple-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h2>
          {/* ... User profile part ... */}
        </header>

        <div className="p-8">
          
          {/* ... Overview Section ... */}

          {/* --- VIEW: Pending Approvals (UPDATED) --- */}
          {activeTab === 'pending-approvals' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-700">Event Approval Requests</h3>
                <p className="text-sm text-gray-500">Approve valid events to display them on the main website.</p>
              </div>

              <div className="grid gap-4">
                {pendingEvents.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">No pending approvals.</p>
                ) : (
                    pendingEvents.map((event) => (
                    <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-800">{event.title}</h4>
                            {/* Organizer නම ගන්න නම් Join query එකක් Backend එකේ ලියන්න ඕනේ, දැනට ID එක පෙන්නමු */}
                            <p className="text-sm text-gray-500 mt-1">Organizer ID: <span className="font-medium text-gray-700">{event.organizer_id}</span></p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                {/* Date format එක පරිස්සමෙන්, SQL date string එකක් එන්නේ */}
                                <span className="flex items-center gap-1"><Calendar size={14}/> {event.event_date ? event.event_date.split('T')[0] : ''}</span>
                                <span className="flex items-center gap-1">📍 {event.location}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{event.description}</p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => handleReject(event.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                                <XCircle size={18} /> Reject
                            </button>
                            <button 
                                onClick={() => handleApprove(event.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium shadow-sm shadow-green-200"
                            >
                                <CheckCircle size={18} /> Approve
                            </button>
                        </div>
                    </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* ... අනිත් Tabs ටික එහෙමම තියන්න ... */}

        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;