// reducers/noteReducer.js
const initialState = {
  good: 0,
  ok: 0,
  bad: 0,
};

const counterReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case 'GOOD':
      return { ...state, good: state.good + 1 }; // Actualiza la propiedad 'good'
    case 'OK':
      return { ...state, ok: state.ok + 1 };     // Actualiza la propiedad 'ok'
    case 'BAD':
      return { ...state, bad: state.bad + 1 };   // Actualiza la propiedad 'bad'
    case 'ZERO':
      return initialState;                      // Retorna el estado inicial para resetear
    default:
      return state;
  }
};

export default counterReducer;