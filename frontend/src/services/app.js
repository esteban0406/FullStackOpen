import axios from "axios";

const baseUrl = "/api/people";

const getPeople = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createPerson = async (newObject) => {
  try {
    const response = await axios.post(baseUrl, newObject);
    return response.data;
  } catch (error) {
    console.error("Error in createPerson:", error.response.data.error);
    alert(error.response.data.error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

const updatePerson = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getPeople, createPerson, updatePerson, deletePerson };
