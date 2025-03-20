import { useState } from "react";
import { useEffect } from "react";
import app from "./services/app";
import CountryInfo from "./components/CountryInfo";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [showCountryInfo, setShowCountryInfo] = useState(false);

  useEffect(() => {
    app.getCounties().then((data) => {
      setCountries(data);
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

  const handleShowCountryInfo = () => {
    setShowCountryInfo(!showCountryInfo);
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
            <li key={country.id}>
              {country.name.common}
              <button onClick={handleShowCountryInfo}>Shows</button>
              {showCountryInfo ? (
                <CountryInfo country={country} />
              ) : null}
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
