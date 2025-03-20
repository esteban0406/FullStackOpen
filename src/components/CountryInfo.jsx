const CountryInfo = ({ CountryInfo }) => {
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
    </div>
  );
};

export default CountryInfo;
