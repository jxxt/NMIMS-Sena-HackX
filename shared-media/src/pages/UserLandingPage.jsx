import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { format } from 'date-fns';

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

export const UserLandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-transparent">
      <h1 className="text-5xl font-bold text-purple-800 mb-10 text-center hover:scale-105 transition-transform duration-300">
        Upcoming Events
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {events.map((event) => (
          <div
            key={event.id}
            className="group p-6 rounded-xl bg-transparent border-2 border-gray-300 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 hover:border-purple-500 cursor-pointer max-w-md w-full mx-auto flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-purple-900 group-hover:text-purple-600 transition-colors duration-300">
                {event.eventName}
              </h2>
              <span className="block mt-2 text-sm font-bold text-gray-700 flex items-center">
                <svg className="w-6 h-6 text-purple-600 group-hover:animate-spin transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {format(new Date(event.eventDate), 'EEEE, MMM d, yyyy h:mm a')}
              </span>
              <p className="text-gray-800 mt-3 font-bold group-hover:text-gray-900 transition-colors duration-300 line-clamp-3">
                {event.eventDescription}
              </p>
            </div>
            <div className="mt-6 text-sm text-gray-700 space-y-3 font-bold">
              <div className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-600 group-hover:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                <span>{event.eventLocation}</span>
              </div>
              
              <div className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-600 group-hover:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/>
                </svg>
                <span>Status: {event.eventStatus}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserLandingPage;
