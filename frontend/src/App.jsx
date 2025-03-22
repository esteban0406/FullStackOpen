import { useState, useEffect, useCallback } from "react";
import app from "./services/app";
import CountryInfo from "./components/CountryInfo";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  // Fetch countries data on initial render
  useEffect(() => {
    app.getCounties().then((data) => {
      if (!data.error) {
        setCountries(data);
        console.log("Countries data fetched:");
      } else {
        console.log("Error fetching countries data:", data.error);
      }
    });
  }, []);

  // Filter countries based on the filter input
  const filteredCountries = countries.filter((country) =>
    filter
      ? country.name.common.toLowerCase().includes(filter.toLowerCase())
      : false
  );

  // Handle filter input change
  const handleFilterChange = useCallback((event) => {
    setFilter(event.target.value);
  }, []);

  // Handle showing country info
  const handleShowCountryInfo = useCallback((id) => {
    setSelectedCountryId((prevId) => (prevId === id ? null : id));
  }, []);

  return (
    <div>
      <h1>Countries</h1>
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
    </div>
  );
};

export default App;
