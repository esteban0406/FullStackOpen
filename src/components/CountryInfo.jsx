import app from "../services/app";
import { useEffect, useState } from "react";

const CountryInfo = ({ CountryInfo }) => {
  const [weather, setweather] = useState(null);

  useEffect(() => {
    app.getWeather(CountryInfo.name.common).then((data) => {
      if (!data.error) {
        setweather(data);
        console.log("Weather data fetched:");
      } else {
        console.log("Error fetching weather data:", data.error);
      }
    });
  }, []);

  return (
    <div>
      <h2>{CountryInfo.name.common}</h2>
      <p>capital {CountryInfo.capital[0]}</p>
      <p>population: {CountryInfo.population}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(CountryInfo.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={CountryInfo.flags.png}
        alt={CountryInfo.name.common}
        width="100"
      />

      {weather ? (
        <div>
          <h3>Weather in {CountryInfo.name.common}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Conditions: {weather.weather[0].description}</p>
        </div>
      ) : null}

      <img
        src={CountryInfo.weather_icons}
        alt={CountryInfo.weather_descriptions}
        width="100"
      />
    </div>
  );
};

export default CountryInfo;
