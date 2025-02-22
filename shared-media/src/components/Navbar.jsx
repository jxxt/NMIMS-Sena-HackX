import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-gradient-to-br from-white-200 to-purple w-screen flex justify-center py-4 fixed top-0 left-0 z-50">
      <nav className="bg-purple-700 text-white py-4 px-8 rounded-full shadow-xl w-[60%] 
                      flex justify-between items-center transition duration-300 hover:shadow-2xl">
        {/* Clickable Link for "EventVerse" with pointer cursor */}
        <Link to="/" className="text-2xl font-extrabold tracking-wide text-white cursor-pointer">
          Event<span className="text-purple-300">Verse</span>
        </Link>
        
        <div className="flex gap-8">
          <Link to="/landing" className="text-lg font-bold hover:text-purple-300 transition duration-300">
            User
          </Link>
          <Link to="/photos" className="text-lg font-bold hover:text-purple-300 transition duration-300">
            Photos
          </Link>
          <Link to="/documentation" className="text-lg font-bold hover:text-purple-300 transition duration-300">
            Doc
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
