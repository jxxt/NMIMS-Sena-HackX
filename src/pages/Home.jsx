import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { db, ref, get } from "../config/firebase";

const Home = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [eventData, setEventData] = useState({
        eventName: "",
        eventDescription: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
        eventHostId: "",
        eventHostApiKey: "",
        eventStatus: "incomplete",
    });
    const [suggestions, setSuggestions] = useState([]);

    // Geoapify API Key
    const GEOAPIFY_API_KEY = "7bc7429af98f4810b5f1960d07f51320";

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

        // Fetch location suggestions if the field is eventLocation
        if (name === "eventLocation") {
            if (value.trim() === "") {
                setSuggestions([]); // Clear suggestions if input is empty
            } else {
                fetchLocationSuggestions(value);
            }
        }
    };

    // Fetch location suggestions from Geoapify
    const fetchLocationSuggestions = async (query) => {
        if (query.length > 2) {
            try {
                const response = await axios.get(
                    `https://api.geoapify.com/v1/geocode/autocomplete`,
                    {
                        params: {
                            text: query,
                            apiKey: GEOAPIFY_API_KEY,
                        },
                    }
                );
                setSuggestions(response.data.features);
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setEventData((prev) => ({
            ...prev,
            eventLocation: suggestion.properties.formatted,
        }));
        setSuggestions([]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { eventDate, eventTime, ...restData } = eventData;

        // Combine date and time into a single ISO string
        const combinedDateTime = new Date(`${eventDate}T${eventTime}`).toISOString();

        // Prepare data to be sent
        const requestData = {
            ...restData,
            eventDate: combinedDateTime,
        };

        try {
            const response = await axios.post(
                "http://localhost:8000/events/",
                requestData
            );
            console.log(response.data);
            alert("Event created successfully!");
            setShowModal(false);
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event. Please try again.");
        }
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
                        onClick={() => {
                            setEventData({
                                eventName: "",
                                eventDescription: "",
                                eventDate: "",
                                eventTime: "",
                                eventLocation: "",
                                eventHostId: eventData.eventHostId,
                                eventHostApiKey: eventData.eventHostApiKey,
                                eventStatus: "incomplete",
                            });
                            setShowModal(true);
                        }}
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
                                required
                                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
                            />

                            <input
                                type="text"
                                name="eventDescription"
                                placeholder="Event Description"
                                value={eventData.eventDescription}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
                            />

                            <input
                                type="date"
                                name="eventDate"
                                value={eventData.eventDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
                            />

                            <input
                                type="time"
                                name="eventTime"
                                value={eventData.eventTime}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
                            />

                            <input
                                type="text"
                                name="eventLocation"
                                placeholder="Event Location"
                                value={eventData.eventLocation}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
                            />

                            <ul className="bg-gray-800 rounded-lg border border-gray-700 text-white">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="cursor-pointer px-4 py-2 hover:bg-gray-700"
                                    >
                                        {suggestion.properties.formatted}
                                    </li>
                                ))}
                            </ul>

                            <button type="submit" className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 hover:shadow-lg">
                                Create Event
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
