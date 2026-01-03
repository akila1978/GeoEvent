import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext'; 

import MainLayout from './components/MainLayout';
import HomePage from './components/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MapPage from './pages/MapPage'; 
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import EventExplore from './components/EventExplore';
import DashboardLayout from './components/DashboardLayout';
import EventManagementProfile from './pages/EventManagementProfile';

function App() {
  return (
    <ThemeProvider>
      <UserProvider> 
        <Router>
          <Routes>
            
            {/* --- SECTION 1: PUBLIC USER ROUTES --- */}
            <Route path="/" element={<MainLayout />}> 
              <Route index element={<HomePage />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="map" element={<MapPage />} />
              <Route path="about" element={<AboutPage />} />
              
              {/* සාමාන්‍ය User ගේ Profile එක */}
              <Route path="profile" element={<ProfilePage />} />
              
              {/* 👇 ERROR FIX: මෙන්න මෙතන තමයි වෙනස කළේ */}
              {/* ඔයාට manager-dashboard යන්න ඕන නිසා, path එක හරියටම දුන්නා */}
              <Route path="manager-dashboard" element={<EventManagementProfile />} />
              
              <Route path="events" element={<EventExplore />} />
            </Route>

            {/* --- SECTION 2: ADMIN/ORGANIZER ROUTES --- */}
            <Route path="/admin" element={<DashboardLayout />} />

          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;