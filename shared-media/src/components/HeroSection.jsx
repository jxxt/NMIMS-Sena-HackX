import React from 'react';
import { motion } from 'framer-motion';
import google from "../assets/google.png";
import nmims from "../assets/nmims.png";
import landingimg from "../assets/landingimg.webp";

export const HeroSection = () => {
  // Animation variants for staggered text animation
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Variants for the description paragraphs
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Client section variants
  const clientVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 1
      }
    }
  };

  // Logo hover animation
  const logoHoverVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div>
      {/* Hero Section - Flex Row Layout */}
      <div className="flex flex-row items-center justify-between mx-16 mt-20 px-40">
        {/* Left Section - Text Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col max-w-2xl space-y-3"
        >
          {/* Main Heading with letter animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-8xl font-extrabold text-gray-800"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Event
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-purple-600"
            >
              Verse
            </motion.span>
          </motion.div>

          {/* Subheading */}
          <motion.p
            variants={textVariants}
            className="text-3xl text-gray-700 font-bold my-5"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-purple-600"
            >
              Bringing Events to Life
            </motion.span>
            {" "}– Seamless, Smart, and Spectacular!
          </motion.p>

          {/* Description */}
          <motion.div
            variants={containerVariants}
            className="text-lg text-gray-600 font-bold space-y-2 my-2"
          >
            <motion.p
              variants={textVariants}
              className="text-gray-500"
            >
              <span className="text-purple-700 font-semibold">EventVerse</span> is your all-in-one platform for effortless event management. Whether you're organizing a corporate gathering, a music festival, or a private celebration, we bring <span className="text-purple-700 font-semibold">innovation</span> and <span className="text-purple-700 font-semibold">simplicity</span> to every step of the journey.
            </motion.p>
            <motion.p
              variants={textVariants}
              className="text-gray-500"
            >
              From <span className="text-purple-700 font-semibold">smart ticketing</span> to <span className="text-purple-700 font-semibold">real-time updates</span>, we enhance the way events are planned and experienced. Join us in crafting <span className="text-purple-700 font-semibold">unforgettable moments</span> that leave a lasting impact!
            </motion.p>
          </motion.div>

          {/* Call-to-Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-700 text-white px-8 py-3 rounded-xl text-xl font-semibold transition duration-300 hover:bg-purple-500 shadow-lg"
            >
              Get Started as Host
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Section - Image */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center items-center"
        >
          <motion.img
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            src={landingimg}
            alt="Event Illustration"
            className="w-[600px] h-auto rounded-xl shadow-xl"
          />
        </motion.div>
      </div>

      {/* Clients Logo Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={clientVariants}
        className="flex justify-center mt-20"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-600 bg-opacity-80 p-6 rounded-xl w-[500px] h-40 flex flex-col items-center justify-center shadow-lg"
        >
          {/* Heading */}
          <motion.h2
            variants={textVariants}
            className="text-white text-center text-lg font-bold mb-3"
          >
            Our Clients
          </motion.h2>

          {/* Grid Layout - 1 Row, 2 Columns */}
          <div className="grid grid-cols-2 gap-6">
            {[{ src: google, name: "Google" }, { src: nmims, name: "NMIMS" }].map((client, index) => (
              <motion.div
                key={index}
                variants={logoHoverVariants}
                whileHover="hover"
                className="flex flex-col items-center"
              >
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  src={client.src}
                  alt={client.name}
                  className="w-14 h-auto opacity-100 mx-20"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + 0.2 * index }}
                  className="text-gray-300 text-sm mt-1"
                >
                  {client.name}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};