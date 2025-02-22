import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const firebaseConfig = {
  apiKey: "AIzaSyBr9QcMb2DyLIeKxgTVJC9BFUOWU9ZzmdI",
  authDomain: "event-verse-app.firebaseapp.com",
  databaseURL: "https://event-verse-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "event-verse-app",
  storageBucket: "event-verse-app.firebasestorage.app",
  messagingSenderId: "419801349504",
  appId: "1:419801349504:web:24bdf53ea91e9959bc5565",
  measurementId: "G-EZF6F6C4QE"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const shimmer = {
  animate: {
    background: [
      "linear-gradient(to right, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
      "linear-gradient(to right, #f8f8f8 0%, #f0f0f0 50%, #f8f8f8 100%)"
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const UserLandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setEvents(eventsArray);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: 360 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"
        >
          <motion.div
            variants={shimmer}
            animate="animate"
            className="h-full w-full rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-8 flex flex-col items-center bg-transparent"
    >
      <h1 className="text-5xl font-bold text-purple-800 mb-10 text-center">
        Upcoming Events
      </h1>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl"
      >
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={item}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedEvent(event.id === selectedEvent ? null : event.id)}
              className="group p-6 rounded-xl bg-transparent border-2 border-gray-300 shadow-md hover:shadow-2xl transition-all duration-500 hover:border-purple-500 cursor-pointer max-w-md w-full mx-auto flex flex-col justify-between overflow-hidden"
            >
              <motion.div
                animate={{
                  height: selectedEvent === event.id ? "auto" : "100%",
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.h2 
                  whileHover={{ scale: 1.02 }}
                  className="text-2xl font-extrabold text-purple-900 group-hover:text-purple-600 transition-colors duration-300"
                >
                  {event.eventName}
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-1 bg-purple-500 mt-1 rounded-full"
                  />
                </motion.h2>
                <span className="block mt-2 text-sm font-bold text-gray-700 flex items-center">
                  <motion.svg 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                    className="w-6 h-6 text-purple-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </motion.svg>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {format(new Date(event.eventDate), 'EEEE, MMM d, yyyy h:mm a')}
                  </motion.span>
                </span>
                <motion.p 
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  animate={{
                    height: selectedEvent === event.id ? "auto" : "4.5em",
                  }}
                  className="text-gray-800 mt-3 font-bold group-hover:text-gray-900 transition-colors duration-300 overflow-hidden"
                >
                  {event.eventDescription}
                </motion.p>
              </motion.div>
              <motion.div 
                className="mt-6 text-sm text-gray-700 space-y-3 font-bold"
                animate={{
                  opacity: [0.5, 1],
                  y: [5, 0],
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                }}
              >
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-2 transition-transform duration-300"
                >
                  <motion.svg 
                    whileHover={{ rotate: 15 }}
                    className="w-6 h-6 text-purple-600 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </motion.svg>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {event.eventLocation}
                  </motion.span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-2 transition-transform duration-300"
                >
                  <motion.svg 
                    whileHover={{ rotate: 15 }}
                    className="w-6 h-6 text-purple-600 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/>
                  </motion.svg>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    Status: {event.eventStatus}
                  </motion.span>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default UserLandingPage;