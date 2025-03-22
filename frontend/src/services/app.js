import axios from "axios";

const apiKey = import.meta.env.VITE_SOME_KEY
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

const allData = {
  countries: [],
};

const getCounties = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const getWeather = (location) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`;
  const request = axios.get(weatherUrl);
  return request.then((response) => response.data);
};

export default { getCounties, getWeather };
