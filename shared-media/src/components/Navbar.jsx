import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <div className="bg-gradient-to-br from-white-200 to-purple w-screen flex justify-center py-4 fixed top-0 left-0 z-50 bg-opacity-90 backdrop-blur-sm shadow-xl">
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-purple-700 text-white py-4 px-8 rounded-full 
                  shadow-[0_8px_30px_rgb(0,0,0,0.24)] 
                  hover:shadow-[0_12px_40px_rgba(147,51,234,0.4)]
                  w-[60%] flex justify-between items-center 
                  transition-all duration-300"
      >
        {/* Logo Link without animation */}
        <div>
          <Link to="/" className="text-2xl font-extrabold tracking-wide text-white">
            Event<span className="text-purple-300">Verse</span>
          </Link>
        </div>
        
        <div className="flex gap-8">
          {/* Navigation Links with hover effects */}
          {[
            { to: "/landing", text: "User" },
            { to: "/photos", text: "Photos" },
            { to: "/documentation", text: "Doc" },
            { to: "/admin", text: "Admin" }
          ].map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <Link 
                to={link.to} 
                className="text-lg font-bold relative group"
              >
                <motion.span 
                  className="text-white group-hover:text-purple-300 transition-colors duration-300"
                  whileHover={{
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                >
                  {link.text}
                </motion.span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-300 group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;