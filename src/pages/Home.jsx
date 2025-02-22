// src/components/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db, ref, get } from "../config/firebase";

const Home = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [eventData, setEventData] = useState({
        eventName: "",
        eventDescription: "",
        eventDate: "",
        eventLocation: "",
        eventHostId: "",
        eventHostApiKey: "",
        eventStatus: "incomplete",
    });

    // Fetch eventHostId and eventHostApiKey using authId
    useEffect(() => {
        const fetchHostData = async () => {
            const authId = localStorage.getItem("authId");
            if (!authId) {
                navigate("/login");
                return;
            }

            const userRef = ref(db, `users/${authId}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();
                setEventData((prev) => ({
                    ...prev,
                    eventHostId: userData.eventHostId,
                    eventHostApiKey: userData.eventHostApiKey,
                }));
            }
        };

        fetchHostData();
    }, [navigate]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(eventData);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl p-8 space-y-8">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-white text-center">
                        Welcome
                    </h2>
                    <p className="text-gray-400 text-center">
                        You are successfully logged in!
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/events"
                        className="block w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-center font-medium transition duration-200 hover:shadow-lg"
                    >
                        View Events
                    </Link>

                    <button
                        onClick={() => setShowModal(true)}
                        className="block w-full px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white text-center font-medium transition duration-200 hover:shadow-lg"
                    >
                        Create New Event
                    </button>
                </div>

                <p className="text-sm text-gray-400 text-center">
                    Explore your event management dashboard.
                </p>
            </div>

            {/* Create Event Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md">
                        <h3 className="text-2xl font-bold text-white mb-4 text-center">
                            Create New Event
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="eventName"
                                placeholder="Event Name"
                                value={eventData.eventName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            />

                            <input
                                type="text"
                                name="eventDescription"
                                placeholder="Event Description"
                                value={eventData.eventDescription}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            />

                            <input
                                type="date"
                                name="eventDate"
                                value={eventData.eventDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            />

                            <input
                                type="text"
                                name="eventLocation"
                                placeholder="Event Location"
                                value={eventData.eventLocation}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            />

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 hover:shadow-lg"
                                >
                                    Create Event
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition duration-200 hover:shadow-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
