import axios from "axios";

const apiKey = "9c0c6041ba7e4ad5f513a0391675a74b";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";
const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid=${apiKey}`;


const allData = {
  countries: [],
};

const getCounties = () => {
  const request = axios.get(baseUrl);
  
  return request.then((response) => response.data);
};

const getWeather = () => {
  const request = axios.get(weatherUrl)
  console.log(request.then((response) => response.data))
  return request.then((response) => response.data)
}

export default { getCounties, getWeather };
