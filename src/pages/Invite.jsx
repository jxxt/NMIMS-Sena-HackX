import { useState, useEffect } from "react";
import styles from "./Invite.module.css";

const Invite = () => {
  const [name, setName] = useState("");
  const [showRSVP, setShowRSVP] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get("name") || "Guest";
    setName(userName);
  }, []);

  const fetchWeather = async () => {
    const apiKey = "906ee9e8f6fb41abb07201116241206"; // Replace with your actual key
    const location = "Mumbai";
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
  
  const handleRSVP = (response) => {
    alert(`You clicked: ${response}`);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.mobileFrame}>
        <div className={styles.eventInfoPage}>
          <h1>You're Invited!</h1>
          <p>Join us for an unforgettable event.</p>

          <div className={styles.eventDetails}>
            <h2>Event Details</h2>
            <p><strong>Date:</strong> October 25, 2023</p>
            <p><strong>Time:</strong> 7:00 PM</p>
            <p><strong>Location:</strong> 123 Apple Street, Cupertino, CA</p>
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
                className={`${styles.rsvpButton} ${styles.notSure}`}
                onClick={() => handleRSVP("Not sure")}
              >
                Not sure
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
            <div className={styles.mapPlaceholder}>
              <p>Map will be displayed here.</p>
            </div>
          </div>

          <div className={styles.weatherContainer}>
            <h2>Weather Forecast</h2>
            {loading ? (
              <p>Loading weather data...</p>
            ) : weatherData ? (
              <div className={styles.weatherInfo}>
                <p><strong>Condition:</strong> {weatherData.current.condition.text}</p>
                <p><strong>Temperature:</strong> {weatherData.current.temp_c}°C</p>
                <p><strong>Feels Like:</strong> {weatherData.current.feelslike_c}°C</p>
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

export default Invite;