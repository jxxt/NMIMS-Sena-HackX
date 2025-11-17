import { useEffect, useState } from "react";
import { db, ref, get, set, push } from "../config/firebase";
import { useParams } from "react-router-dom";
import styles from "./Invite.module.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

const EventDetails = () => {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState(null);
    const [name, setName] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationCoords, setLocationCoords] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [attendeeData, setAttendeeData] = useState({
        name: "",
        email: "",
        response: "",
    });

    useEffect(() => {
        const fetchEventDetails = async () => {
            const eventRef = ref(db, `events/${eventId}`);
            const eventSnapshot = await get(eventRef);

            if (eventSnapshot.exists()) {
                setEventData(eventSnapshot.val());
            }
        };

        fetchEventDetails();
    }, [eventId]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userName = urlParams.get("name") || "Guest";
        setName(userName);
    }, []);

    const fetchWeather = async () => {
        const apiKey = "906ee9e8f6fb41abb07201116241206";
        const location = eventData?.eventLocation;
        if (!location) return;

        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.current) {
                throw new Error("Invalid response structure");
            }

            setWeatherData(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setWeatherData(null);
            setLoading(false);
        }
    };

    const fetchLocationCoordinates = async () => {
        const location = eventData?.eventLocation;
        if (!location) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    location
                )}`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                setLocationCoords({
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon),
                });
                return;
            }

            const stateResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&state=${encodeURIComponent(
                    location
                )}&country=India`
            );
            const stateData = await stateResponse.json();

            if (stateData && stateData.length > 0) {
                setLocationCoords({
                    latitude: parseFloat(stateData[0].lat),
                    longitude: parseFloat(stateData[0].lon),
                });
                return;
            }

            setLocationCoords(null);
        } catch (error) {
            console.error("Error fetching location coordinates:", error);
            setLocationCoords(null);
        }
    };

    useEffect(() => {
        if (eventData?.eventLocation) {
            fetchWeather();
            fetchLocationCoordinates();
        }
    }, [eventData?.eventLocation]);

    const handleRSVP = (response) => {
        setAttendeeData((prev) => ({ ...prev, response }));
        setShowPopup(true);
    };

    const handleSubmitAttendee = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(
                "https://eventverse-backend.onrender.com/api/rsvp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        event_id: eventId,
                        name: attendeeData.name,
                        email: attendeeData.email,
                        response: attendeeData.response,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit RSVP");
            }

            const result = await response.json();
            setShowPopup(false);

            if (result.status === "success") {
                // Only show the thank you message for positive RSVPs
                if (attendeeData.response === "I will attend") {
                    alert(
                        "Thank you for your response! A confirmation email has been sent."
                    );
                } else {
                    alert("Your response has been recorded.");
                }
            } else {
                alert("There was an issue recording your response.");
            }

            setAttendeeData({
                name: "",
                email: "",
                response: "",
            });
        } catch (error) {
            console.error("Error saving attendee data:", error);
            alert("There was an error saving your response. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const customMarker = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [30, 30],
    });

    const qrRef = useRef(null);

    const handleDownload = () => {
        const canvas = qrRef.current.querySelector("canvas");
        const imageUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = imageUrl;
        downloadLink.download = "event-qr-code.png";
        downloadLink.click();
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.mobileFrame}>
                <div className={styles.eventInfoPage}>
                    <h1>{eventData?.eventName || "You're Invited!"}</h1>
                    <p>Join us for an unforgettable event.</p>

                    <div className={styles.eventDetails}>
                        <h2>Event Details</h2>
                        <p>
                            <strong>Name:</strong> {eventData?.eventName}
                        </p>
                        <p>
                            <strong>Description:</strong>{" "}
                            {eventData?.eventDescription}
                        </p>
                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(
                                eventData?.eventDate
                            ).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Time:</strong>{" "}
                            {new Date(
                                eventData?.eventDate
                            ).toLocaleTimeString()}
                        </p>

                        <p>
                            <strong>Location:</strong>{" "}
                            {eventData?.eventLocation}
                        </p>
                        <p>
                            <strong>Status:</strong> {eventData?.eventStatus}
                        </p>
                    </div>

                    <div className={styles.rsvpSection}>
                        <h2 className="mt-10 text-xl mb-5 underline font-bold">
                            Will you attend?
                        </h2>
                        <div className={styles.rsvpButtons}>
                            <button
                                className={`${styles.rsvpButton} ${styles.attend}`}
                                onClick={() => handleRSVP("I will attend")}
                                disabled={submitting}
                            >
                                I will attend
                            </button>
                            <button
                                className={`${styles.rsvpButton} ${styles.decline}`}
                                onClick={() => handleRSVP("No, won't join")}
                                disabled={submitting}
                            >
                                No, won't join
                            </button>
                        </div>
                    </div>

                    {showPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
                                <h3 className="text-xl font-semibold mb-4">
                                    Please enter your details
                                </h3>
                                <form
                                    onSubmit={handleSubmitAttendee}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Name:
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={attendeeData.name}
                                            onChange={(e) =>
                                                setAttendeeData((prev) => ({
                                                    ...prev,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Email:
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={attendeeData.email}
                                            onChange={(e) =>
                                                setAttendeeData((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowPopup(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                            disabled={submitting}
                                        >
                                            {submitting
                                                ? "Submitting..."
                                                : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* <div className={styles.sharedAlbumContainer}>
                        <h2>Shared Album</h2>
                        <div className={styles.albumGrid}>
                            <div className={styles.albumItem}>Photo 1</div>
                            <div className={styles.albumItem}>Photo 2</div>
                            <div className={styles.albumItem}>Photo 3</div>
                            <div className={styles.albumItem}>Photo 4</div>
                        </div>
                    </div> */}

                    {locationCoords && (
                        <div className={styles.locationContainer}>
                            <h2 className="mt-10 text-xl mb-5 underline font-bold">
                                Location
                            </h2>
                            <MapContainer
                                center={[
                                    locationCoords.latitude,
                                    locationCoords.longitude,
                                ]}
                                zoom={12}
                                style={{ height: "200px", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker
                                    position={[
                                        locationCoords.latitude,
                                        locationCoords.longitude,
                                    ]}
                                    icon={customMarker}
                                />
                            </MapContainer>
                        </div>
                    )}

                    <div className={styles.weatherContainer}>
                        <h2 className="mt-0 text-xl mb-2 underline font-bold">
                            Weather Forecast
                        </h2>
                        {loading ? (
                            <p>Loading weather data...</p>
                        ) : weatherData ? (
                            <div className={styles.weatherInfo}>
                                <p>
                                    <strong>Condition:</strong>{" "}
                                    {weatherData.current.condition.text}
                                </p>
                                <p>
                                    <strong>Temperature:</strong>{" "}
                                    {weatherData.current.temp_c}°C
                                </p>
                                <p>
                                    <strong>Feels Like:</strong>{" "}
                                    {weatherData.current.feelslike_c}°C
                                </p>
                                <img
                                    src={weatherData.current.condition.icon}
                                    alt={weatherData.current.condition.text}
                                />
                            </div>
                        ) : (
                            <p>Failed to fetch weather data.</p>
                        )}
                    </div>

                    <div className="flex flex-col items-center mt-10 p-5 border border-gray-200 rounded-2xl bg-gray-50 shadow-sm">
                        <h2 className="text-xl mb-4 underline font-bold">
                            Share Event
                        </h2>
                        <div ref={qrRef} className="flex justify-center">
                            <QRCodeCanvas
                                value={window.location.href}
                                size={200}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>
                        <p className="mt-2 text-gray-600">
                            Scan this QR code to view this event on another
                            device.
                        </p>
                        <button
                            className="mt-3 text-sm px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            onClick={handleDownload}
                        >
                            Download QR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
