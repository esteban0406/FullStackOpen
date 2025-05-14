import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';

function App() {
  const counterReducer = (state = 0, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      case 'ZERO':
        return 0;
      default:
        return state;
    }
  };

  const store = createStore(counterReducer);
  const [count, setCount] = useState(store.getState()); // Estado local para el contador

  useEffect(() => {
    // Función listener que se ejecuta cuando el estado de Redux cambia
    const handleChange = () => {
      setCount(store.getState()); // Actualiza el estado local con el nuevo valor del store
    };

    // Suscribe el listener al store
    const unsubscribe = store.subscribe(handleChange);

    // Función de limpieza que se ejecuta cuando el componente se desmonta
    return () => {
      unsubscribe(); // Desuscribe el listener para evitar fugas de memoria
    };
  }, [store]); // Dependencia en el store (aunque generalmente no cambia)

  return (
    <>
      <div>
        {count} {/* Muestra el valor del estado local */}
      </div>
      <button onClick={() => store.dispatch({ type: 'INCREMENT' })}>
        plus
      </button>
      <button onClick={() => store.dispatch({ type: 'DECREMENT' })}>
        minus
      </button>
      <button onClick={() => store.dispatch({ type: 'ZERO' })}>
        zero
      </button>
    </>
  );
}

export default App;
