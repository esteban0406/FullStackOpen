import { useState } from "react";
import { useEffect } from "react";
import app from "./services/app";
import CountryInfo from "./components/CountryInfo";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    app.getCounties().then((data) => {
      !data.error
        ? setCountries(data)
        : console.log("Error fetching countries data:", data.error);
    });
  }, []);

  useEffect(() => {
    app.getWeather().then((data) => {
      setWeather(data);
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    filter
      ? country.name.common.toLowerCase().includes(filter.toLowerCase())
      : false
  );

  const handleShowCountryInfo = (id) => {
    console.log("Clicked country ID:", id)
    setSelectedCountryId(id === selectedCountryId ? null : id);
  };

  return (
    <div>
      <h1>countries</h1>
      <p>Find a country</p>
      <form>
        <input type="text" value={filter} onChange={handleFilterChange} />
      </form>
      {filteredCountries.length === 1 ? (
        <CountryInfo CountryInfo={filteredCountries[0]} />
      ) : filteredCountries.length < 10 ? (
        <ul>
          {filteredCountries.map((country) => (            
            <li key={country.cca2}>
              {country.name.common}
              <button onClick={() => handleShowCountryInfo(country.cca2)}>
                Shows
              </button>
              {selectedCountryId === country.cca2 && (
                <CountryInfo CountryInfo={country} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Too many matches, specify another filter</p>
      )}
      <h3>Weahther Bogota "locas"</h3>
      <p>Temperature: {weather.weather}</p>
      <p>Location {weather.values}</p>
    </div>
  );
};

export default App;
