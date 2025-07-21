import React, { useEffect, useState } from "react";


const WeatherWithLocation: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [address, setAddress] = useState<string>("");


  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {

          // 📍 Fetch Address from lat/lng using Nominatim
          const locationRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const locationData = await locationRes.json();
          console.log(locationData);

          const addr = locationData?.address;
          const fullAddress = `State := ${addr?.state || ""}, pincode :=${addr?.postcode || ""},${addr.suburb || ""}
          ,${addr.county || ""},city:=${addr.city || ""} state_district:=${addr.state_district || ""},
          `;
          setAddress(fullAddress);
        } catch (err) {
          setError("Failed to fetch data");
        }
      },
      () => {
        setError("Location access denied");
      }
    );
  }, []);

  const handlesend = () => {
    console.log(address);

  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 500 }}>
      <h2>🌤 Your Current Weather</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <strong>📍 Area:</strong> {address}

      <button onClick={handlesend}>Send</button>

    </div>
  );
};

export default WeatherWithLocation;