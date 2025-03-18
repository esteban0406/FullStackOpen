import { useState } from "react";
import { useEffect } from "react";
import app from "./services/app";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    app.getPersons().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: event.target[0].value,
      number: event.target[1].value,
    };
    if (persons.some((person) => person.name === personObject.name)) {
      confirm(
        `${personObject.name} is already added to phonebook, would you like to update it?`
      )
        ? app.updatePerson(
            persons.find((person) => person.name === personObject.name).id,
            personObject
          ).then((returnedPerson) => {
          setPersons(persons.map((person) => (person.id !== returnedPerson.id ? person : returnedPerson)));
        })
        : console.log("No changes made");
    } else
      app.createPerson(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
      });
    event.target[0].value = "";
    event.target[1].value = "";
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <p>
        Filter show with:
        <input id="Filter" value={filter} onChange={handleFilterChange} />
      </p>
      <h2>Add new number</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input />
        </div>
        <div>
          number: <input />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}{" "}
          <button
            onClick={() => {
              app
                .deletePerson(person.id)
                .then(setPersons(persons.filter((n) => n.id !== person.id)));
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;
