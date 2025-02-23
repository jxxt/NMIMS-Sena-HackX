import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import google from "../assets/google.png";
import nmims from "../assets/nmims.png";

const CodeBlock = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const codeLines = [
    'const createEvent = async (eventData) => {',
    '  const response = await fetch(',
    "    'https://api.eventverse.com/events',",
    '    {',
    "      method: 'POST',",
    '      headers: {',
    "        'Content-Type': 'application/json',",
    '        Authorization: `Bearer ${API_KEY}`',
    '      },',
    '      body: JSON.stringify(eventData)',
    '    }',
    '  );',
    '  return response.json();',
    '};'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => 
        prev === codeLines.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  return (
    <motion.div 
      className="relative bg-gray-900 rounded-xl p-8 w-[700px] h-[500px] overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      whileHover="hover"
      variants={{
        hover: {
          scale: 1.02,
          transition: { duration: 0.3 }
        }
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0) 50%)",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          pointerEvents: "none",
          x: mousePosition.x - 75,
          y: mousePosition.y - 75,
        }}
        animate={{
          opacity: [0.6, 0.4, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-4 h-4 rounded-full bg-red-500"></div>
        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
        <div className="w-4 h-4 rounded-full bg-green-500"></div>
      </div>
      
      <div className="h-[400px] overflow-y-auto custom-scrollbar">
        <pre className="font-mono text-base relative z-10">
          {codeLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: index <= currentLineIndex ? 1 : 0.3,
                x: 0,
                color: index === currentLineIndex ? '#A855F7' : '#E5E7EB'
              }}
              transition={{ duration: 0.5 }}
              className="min-h-[1.75rem]"
            >
              {line}
            </motion.div>
          ))}
        </pre>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </motion.div>
  );
};

export const HeroSection = () => {
  const [text, setText] = useState("");
  const fullText = "Verse";
  
  useEffect(() => {
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          currentIndex = 0;
        }, 1000);
      }
    }, 300);

    return () => clearInterval(typingInterval);
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

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

  const logoHoverVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  const cursorVariants = {
    blink: {
      opacity: [1, 0],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between mx-16 mt-20 px-32">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col max-w-2xl space-y-3 mr-12"
        >
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
              {text}
              <motion.span
                variants={cursorVariants}
                animate="blink"
                className="inline-block w-1 h-16 ml-1 bg-purple-600"
              />
            </motion.span>
          </motion.div>

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

          <motion.div
            variants={containerVariants}
            className="text-lg text-gray-600 font-bold space-y-2 my-2"
          >
            <motion.p variants={textVariants} className="text-gray-500">
              <span className="text-purple-700 font-semibold">EventVerse</span> is your all-in-one platform for effortless event management. Whether you're organizing a corporate gathering, a music festival, or a private celebration, we bring <span className="text-purple-700 font-semibold">innovation</span> and <span className="text-purple-700 font-semibold">simplicity</span> to every step of the journey.
            </motion.p>
            <motion.p variants={textVariants} className="text-gray-500">
              From <span className="text-purple-700 font-semibold">smart ticketing</span> to <span className="text-purple-700 font-semibold">real-time updates</span>, we enhance the way events are planned and experienced. Join us in crafting <span className="text-purple-700 font-semibold">unforgettable moments</span> that leave a lasting impact!
            </motion.p>
          </motion.div>

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

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center items-center"
        >
          <CodeBlock />
        </motion.div>
      </div>

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
          <motion.h2
            variants={textVariants}
            className="text-white text-center text-lg font-bold mb-3"
          >
            Our Clients
          </motion.h2>

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

export default HeroSection;