// src/pages/AboutPage.jsx

import React from 'react';
import { Target, Users, Zap, Map, Shield, Clock } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* 1. Hero Section (Header) */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-purple-600">GeoEvent</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We are connecting people with experiences. GeoEvent is your real-time companion for discovering what's happening around you, visualized on an interactive map.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        
        {/* 2. Our Mission */}
        <div className="mb-20 text-center">
          <span className="text-purple-600 font-semibold tracking-wider uppercase text-sm">Our Mission</span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-8">Why We Built This?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <MissionCard 
              icon={<Target className="w-8 h-8 text-purple-600" />}
              title="Simplicity"
              desc="We wanted to replace cluttered event lists with a simple, map-based interface that anyone can use."
            />
            <MissionCard 
              icon={<Map className="w-8 h-8 text-purple-600" />}
              title="Location First"
              desc="Events are all about 'where'. Our platform prioritizes location so you never miss an event nearby."
            />
             <MissionCard 
              icon={<Users className="w-8 h-8 text-purple-600" />}
              title="Community"
              desc="Helping local organizers reach their audience and building a community around shared interests."
            />
          </div>
        </div>

        {/* 3. User Benefits (Why Choose Us?) */}
        <div className="bg-purple-50 dark:bg-gray-800 rounded-3xl p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            What You Get
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BenefitItem text="Real-time Event Tracking" />
            <BenefitItem text="Interactive Map Navigation" />
            <BenefitItem text="Verified Organizers" />
            <BenefitItem text="Personalized Recommendations" />
            <BenefitItem text="Mobile Friendly Design" />
            <BenefitItem text="Secure Data Handling" />
          </div>
        </div>

        {/* 4. Future Plans (Roadmap) */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Future Roadmap
          </h2>
          <div className="space-y-6">
            <RoadmapCard 
              icon={<Zap />} 
              title="Instant Ticket Booking" 
              desc="We are integrating a payment gateway to allow you to buy tickets directly within the app."
            />
            <RoadmapCard 
              icon={<Users />} 
              title="Social Features" 
              desc="See which of your friends are attending events and share your plans easily."
            />
            <RoadmapCard 
              icon={<Clock />} 
              title="Event Reminders" 
              desc="Get push notifications when your favorite events are about to start."
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub Components for cleaner code ---

const MissionCard = ({ icon, title, desc }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
    <div className="bg-purple-100 dark:bg-gray-700 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const BenefitItem = ({ text }) => (
  <div className="flex items-center space-x-3 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
    <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
    <span className="text-gray-800 dark:text-gray-200 font-medium">{text}</span>
  </div>
);

const RoadmapCard = ({ icon, title, desc }) => (
  <div className="flex items-start space-x-4 p-4 border-l-4 border-purple-500 bg-white dark:bg-gray-800 shadow-sm rounded-r-lg">
    <div className="text-purple-600 mt-1">{icon}</div>
    <div>
      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{desc}</p>
    </div>
  </div>
);

export default AboutPage;