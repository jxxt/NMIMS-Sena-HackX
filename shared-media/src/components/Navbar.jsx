import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const translations = [
  "कोडवर्स", // Hindi
  "কোডভার্স", // Bengali
  "કોડવર્સ", // Gujarati
  "CodeVerse" // English
];

const Navbar = () => {
  const [currentLang, setCurrentLang] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Language rotation effect
    const interval = setInterval(() => {
      setCurrentLang((prevLang) => (prevLang + 1) % translations.length);
    }, 3000);

    // Scroll handling
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or at the top
      // Hide navbar when scrolling down and not at the top
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-gradient-to-br from-white-200 to-purple w-screen flex justify-center py-4 fixed top-0 left-0 z-50 bg-opacity-90 backdrop-blur-sm shadow-xl"
        >
          <motion.nav 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-purple-700 text-white py-4 px-8 rounded-full 
                      shadow-[0_8px_30px_rgb(0,0,0,0.24)] 
                      hover:shadow-[0_12px_40px_rgba(147,51,234,0.4)]
                      w-[60%] flex justify-between items-center 
                      transition-all duration-300"
          >
            <div>
              <motion.div 
                key={currentLang} 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link to="/" className="text-2xl font-extrabold tracking-wide text-white">
                  <span className="text-purple-300">{translations[currentLang]}</span>
                </Link>
              </motion.div>
            </div>
            
            <div className="flex gap-8">
              {[
                { to: "/landing", text: "User" },
                { to: "/photos", text: "Photos" },
                { to: "/documentation", text: "Doc" },
                { to: "/admin", text: "Admin" }
              ].map((link, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    to={link.to} 
                    className="text-lg font-bold relative group text-white hover:text-purple-300 transition-colors duration-300"
                  >
                    {link.text}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-300 group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navbar;