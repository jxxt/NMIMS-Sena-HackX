import { useEffect, useState } from "react";
import { db, ref, get } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const UserEvents = () => {
    const navigate = useNavigate();
    const [userEvents, setUserEvents] = useState([]);

    useEffect(() => {
        const fetchUserEvents = async () => {
            const authId = localStorage.getItem("authId");
            if (!authId) {
                navigate("/login");
                return;
            }

            // Get user data to find eventHostId
            const userRef = ref(db, `users/${authId}`);
            const userSnapshot = await get(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                const userEventHostId = userData.eventHostId;

                // Get all events and filter for this user's events
                const eventsRef = ref(db, "events");
                const eventsSnapshot = await get(eventsRef);

                if (eventsSnapshot.exists()) {
                    const eventsData = eventsSnapshot.val();
                    const filteredEvents = Object.entries(eventsData)
                        .filter(([, event]) => event.eventHostId === userEventHostId)
                        .map(([id, event]) => ({ id, ...event }));
                    setUserEvents(filteredEvents);
                }
            }
        };

        fetchUserEvents();
    }, [navigate]);

    const handleViewEvent = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-4xl bg-gray-900 rounded-xl shadow-2xl p-8 space-y-8">
                <h2 className="text-4xl font-bold text-white text-center">
                    Your Events
                </h2>
                {userEvents.length > 0 ? (
                    userEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-gray-800 rounded-lg p-4 space-y-2 shadow-lg"
                        >
                            <h3 className="text-2xl font-bold text-white">
                                {event.eventName}
                            </h3>
                            <p className="text-gray-400">
                                {event.eventDescription}
                            </p>
                            <p className="text-gray-400">
                                Location: {event.eventLocation}
                            </p>
                            <p className="text-gray-400">
                                Date: {event.eventDate}
                            </p>
                            <p className="text-gray-400">
                                Status: {event.eventStatus}
                            </p>
                            <button
                                onClick={() => handleViewEvent(event.id)}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
                            >
                                View Event JSON
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center">
                        No events found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserEvents;
