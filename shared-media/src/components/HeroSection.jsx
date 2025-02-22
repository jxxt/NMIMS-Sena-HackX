import React from 'react';
import google from "../assets/google.png";
import nmims from "../assets/nmims.png";
import landingimg from "../assets/landingimg.webp";

export const HeroSection = () => {
  return (
    <div>
      {/* Hero Section - Flex Row Layout */}
      <div className="flex flex-row items-center justify-between mx-16 mt-20 px-40">
        {/* Left Section - Text Content */}
        <div className="flex flex-col max-w-2xl space-y-3">
          {/* Main Heading */}
          <div className="text-8xl font-extrabold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Event<span className="text-purple-600">Verse</span>
          </div>

          {/* Subheading */}
          <p className="text-3xl text-gray-700 font-bold my-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <span className="text-purple-600">Bringing Events to Life</span> – Seamless, Smart, and Spectacular!
          </p>

          {/* Description */}
          <div className="text-lg text-gray-600 font-bold space-y-2 my-2">
            <p className="text-gray-500">
              <span className="text-purple-700 font-semibold">EventVerse</span> is your all-in-one platform for effortless event management. Whether you're organizing a corporate gathering, a music festival, or a private celebration, we bring <span className="text-purple-700 font-semibold">innovation</span> and <span className="text-purple-700 font-semibold">simplicity</span> to every step of the journey.
            </p>
            <p className="text-gray-500">
              From <span className="text-purple-700 font-semibold">smart ticketing</span> to <span className="text-purple-700 font-semibold">real-time updates</span>, we enhance the way events are planned and experienced. Join us in crafting <span className="text-purple-700 font-semibold">unforgettable moments</span> that leave a lasting impact!
            </p>
          </div>

          {/* Call-to-Action Button */}
          <div className="mt-3">
            <button className="bg-purple-700 text-white px-8 py-3 rounded-xl text-xl font-semibold transition duration-300 hover:bg-purple-500 shadow-lg">
              Get Started as Host
            </button>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="flex justify-center items-center">
          <img
            src={landingimg}
            alt="Event Illustration"
            className="w-[600px] h-auto rounded-xl shadow-xl"
          />
        </div>
      </div>

      {/* Clients Logo Section */}
      <div className="flex justify-center mt-20">
        <div className="bg-gray-600 bg-opacity-80 p-6 rounded-xl w-[500px] h-40 flex flex-col items-center justify-center shadow-lg">
          {/* Heading */}
          <h2 className="text-white text-center text-lg font-bold mb-3">Our Clients</h2>

          {/* Grid Layout - 1 Row, 2 Columns */}
          <div className="grid grid-cols-2 gap-6">
            {[{ src: google, name: "Google" }, { src: nmims, name: "NMIMS" }].map((client, index) => (
              <div key={index} className="flex flex-col items-center">
                <img src={client.src} alt={client.name} className="w-14 h-auto opacity-100 mx-20" /> 
                <p className="text-gray-300 text-sm mt-1">{client.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
