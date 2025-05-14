import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import counterReducer from './reducers/noteReducer'; // Importa el reducer desde el archivo correcto

const store = createStore(counterReducer);

function App() {
  const good = () => {
    store.dispatch({
      type: 'GOOD',
    });
  };

  const ok = () => {
    store.dispatch({
      type: 'OK',
    });
  };

  const bad = () => {
    store.dispatch({
      type: 'BAD',
    });
  };

  const resetstats = () => {
    store.dispatch({
      type: 'ZERO',
    });
  };

  const [state, setState] = useState(store.getState()); // Almacena el objeto de estado completo

  useEffect(() => {
    const handleChange = () => {
      setState(store.getState()); // Actualiza el estado local con el nuevo estado del store
    };

    const unsubscribe = store.subscribe(handleChange);

    return () => {
      unsubscribe();
    };
  }, [store]);

  return (
    <>
      <div>
        <button onClick={good}>good</button>
        <button onClick={ok}>ok</button>
        <button onClick={bad}>bad</button>
        <button onClick={resetstats}>reset stats</button> {/* Corregí el nombre de la función */}
        <div>good {state.good}</div> {/* Accede a la propiedad 'good' del estado */}
        <div>ok {state.ok}</div> {/* Accede a la propiedad 'ok' del estado */}
        <div>bad {state.bad}</div> {/* Accede a la propiedad 'bad' del estado */}
      </div>
    </>
  );
}

export default App;
