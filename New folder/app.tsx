import React, { useEffect, useState } from "react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
  sys: {
    sunset: number;
  };
}

const WeatherWithLocation: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");
  const apiKey = "";

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
          );
          const data = await res.json();

          if (data.cod !== 200) {
            setError(data.message || "Failed to get weather");
            return;
          }

          setWeather(data);
        } catch (err) {
          setError("Failed to fetch weather data");
        }
      },
      () => {
        setError("Location access denied");
      }
    );
  }, []);

  const click = () => {
    console.log(weather?.name);
    console.log(weather?.main.temp);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>🌤 Your Current Weather</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather ? (
        <div>
          <input type="text" value={weather.name} readOnly />
          <input
            type="text"
            value={new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
            readOnly
          />

          <p>
            <strong>📍 Location:</strong> {weather.name}
          </p>
          <p>
            <strong>🌡 Temperature:</strong> {weather.main.temp} °C
          </p>
          <p>
            <strong>⛅ Condition:</strong> {weather.weather[0].description}
          </p>
          <p>
            <strong>💧 Humidity:</strong> {weather.main.humidity}%
          </p>
          <p>
            <strong>🌇 Sunset:</strong>{" "}
            {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
          </p>

          <button onClick={click}>Log Info</button>
        </div>
      ) : (
        !error && <p>Loading weather...</p>
      )}
    </div>
  );
};

export default WeatherWithLocation;
