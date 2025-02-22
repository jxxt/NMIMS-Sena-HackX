import { useEffect, useState } from "react";
import { db, ref, get } from "../config/firebase";
import { useParams } from "react-router-dom";
import styles from "./Invite.module.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const EventDetails = () => {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState(null);
    const [name, setName] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

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
        const apiKey = "906ee9e8f6fb41abb07201116241206"; // Replace with your actual key
        const location = eventData?.eventLocation || "Mumbai";
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

    useEffect(() => {
        if (eventData?.eventLocation) {
            fetchWeather();
        }
    }, [eventData?.eventLocation]);

    const handleRSVP = (response) => {
        alert(`You clicked: ${response}`);
    };

    // Custom Marker Icon for Map
    const customMarker = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [30, 30],
    });

    // Default Coordinates (Mumbai) if location not available
    const defaultCoords = {
        latitude: 19.076,
        longitude: 72.8777,
    };

    const latitude = eventData?.latitude || defaultCoords.latitude;
    const longitude = eventData?.longitude || defaultCoords.longitude;

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
                            <strong>Date:</strong> {eventData?.eventDate}
                        </p>
                        <p>
                            <strong>Location:</strong>{" "}
                            {eventData?.eventLocation || "Mumbai"}
                        </p>
                        <p>
                            <strong>Status:</strong> {eventData?.eventStatus}
                        </p>
                    </div>

                    <div className={styles.rsvpSection}>
                        <h2>Will you attend?</h2>
                        <div className={styles.rsvpButtons}>
                            <button
                                className={`${styles.rsvpButton} ${styles.attend}`}
                                onClick={() => handleRSVP("I will attend")}
                            >
                                I will attend
                            </button>
                            <button
                                className={`${styles.rsvpButton} ${styles.decline}`}
                                onClick={() => handleRSVP("No, won't join")}
                            >
                                No, won't join
                            </button>
                        </div>
                    </div>

                    <div className={styles.sharedAlbumContainer}>
                        <h2>Shared Album</h2>
                        <div className={styles.albumGrid}>
                            <div className={styles.albumItem}>Photo 1</div>
                            <div className={styles.albumItem}>Photo 2</div>
                            <div className={styles.albumItem}>Photo 3</div>
                            <div className={styles.albumItem}>Photo 4</div>
                        </div>
                    </div>

                    <div className={styles.locationContainer}>
                        <h2>Location</h2>
                        <MapContainer
                            center={[latitude, longitude]}
                            zoom={12}
                            style={{ height: "200px", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker
                                position={[latitude, longitude]}
                                icon={customMarker}
                            />
                        </MapContainer>
                    </div>

                    <div className={styles.weatherContainer}>
                        <h2>Weather Forecast</h2>
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
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
