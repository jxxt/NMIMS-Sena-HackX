import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserLandingPage from "./pages/UserLandingPage";
import Card from "./pages/Card";
import Documentation from "./pages/Documentation"; // Import Documentation page
import bgImage from "./assets/bg.png"; // Import background image
import { HeroSection } from "./components/HeroSection";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const location = useLocation();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Gradient overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-200 opacity-60"></div>

      {/* Ensure Navbar stays above the gradient */}
      <div className="relative z-10">
        <Navbar />

        {/* Wrapper for main content with padding */}
        <div className="pt-20 px-10 md:px-20 lg:px-32">
          <Routes>
            <Route path="/landing" element={<UserLandingPage />} />
            <Route path="/photos" element={<Card />} />
            <Route path="/documentation" element={<Documentation />} /> {/* Added route for Documentation */}
          </Routes>

          {/* Show HeroSection only on the homepage */}
          {location.pathname === "/" && <HeroSection />}
        </div>
      </div>
    </div>
  );
};

export default App;
