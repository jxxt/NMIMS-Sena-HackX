import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const currentTime = new Date().getTime();
  
  const completedEvents = events.filter(event => {
    const eventTime = new Date(event.eventDate).getTime();
    return eventTime < currentTime;
  });

  const upcomingEvents = events.filter(event => {
    const eventTime = new Date(event.eventDate).getTime();
    return eventTime >= currentTime;
  });

  const eventStats = [
    { name: 'Completed Events', value: completedEvents.length },
    { name: 'Upcoming Events', value: upcomingEvents.length }
  ];

  const rsvpData = [
    { name: 'RSVPed', value: 150 },
    { name: 'Attended', value: 120 },
    { name: 'Did Not Attend', value: 30 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="p-6 bg-white shadow rounded-xl"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4">Event Statistics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventStats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          className="p-6 bg-white shadow rounded-xl"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4">RSVP vs Attendance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={rsvpData} cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" dataKey="value" label>
                {rsvpData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Events Listing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div 
          className="p-6 bg-white shadow rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4 text-green-600">Upcoming Events ({upcomingEvents.length})</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500">No upcoming events</p>
            ) : (
              upcomingEvents.map(event => (
                <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <h3 className="font-semibold text-lg">{event.eventName}</h3>
                  <p className="text-gray-600">
                    {format(new Date(event.eventDate), 'EEEE, MMM d, yyyy h:mm a')}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{event.eventDescription}</p>
                  <div className="mt-2 text-sm">
                    <p className="text-purple-600">Location: {event.eventLocation}</p>
                    <p className="text-purple-600">Status: {event.eventStatus}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div 
          className="p-6 bg-white shadow rounded-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4 text-blue-600">Completed Events ({completedEvents.length})</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {completedEvents.length === 0 ? (
              <p className="text-gray-500">No completed events</p>
            ) : (
              completedEvents.map(event => (
                <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <h3 className="font-semibold text-lg">{event.eventName}</h3>
                  <p className="text-gray-600">
                    {format(new Date(event.eventDate), 'EEEE, MMM d, yyyy h:mm a')}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{event.eventDescription}</p>
                  <div className="mt-2 text-sm">
                    <p className="text-purple-600">Location: {event.eventLocation}</p>
                    <p className="text-purple-600">Status: {event.eventStatus}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center mt-8">
        <button 
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition"
          onClick={() => navigate('/landing')}
        >
          Go to User Landing Page
        </button>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;