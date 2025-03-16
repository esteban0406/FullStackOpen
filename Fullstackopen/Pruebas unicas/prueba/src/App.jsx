import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  },[])

  const addPerson = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);
    const personObject = {
      name: event.target[0].value,
      number: event.target[1].value,
    };
    if (persons.some((person) => person.name === personObject.name)) {
      alert(`${personObject.name} is already added to phonebook`);
    }else(setPersons(persons.concat(personObject)))
    event.target[0].value = "";
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <p>Filter show with:<input id="Filter" value={filter} onChange={handleFilterChange}/></p>
      <h2>Add new number</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input />
        </div>
        <div>number: <input /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map((person) => (
        <div key={person.name}>{person.name} {person.number}</div>
      ))}
    </div>
  );
};

export default App;
