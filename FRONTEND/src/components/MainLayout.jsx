// src/components/MainLayout.jsx (උදාහරණයක්)

import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar'; // ✅ NavigationBar එක තියෙන්න ඕනේ මෙතන

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 1. Navigation Bar එක මෙතන දැම්මම ඇති */}
            <NavigationBar /> 
            
            {/* 2. Page Content එක මෙතනින් පෙන්වයි (Home, About, Map) */}
            <main className="flex-grow"> 
                <Outlet /> 
            </main>

            {/* Footer එකක් තියෙනවා නම් මෙතනට දාන්න */}
            {/* <Footer /> */}
        </div>
    );
};

export default MainLayout;