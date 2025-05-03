import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'

function App() {
  const counterReducer = (state = 0, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1
      case 'DECREMENT':
        return state - 1
      case 'ZERO':
        return 0
      default:
        return state
    }
  }
  
  const store = createStore(counterReducer)

  return (
    <>
      
      <div>
        {store.getState()}
      </div>
      <button 
        onClick={() => store.dispatch({ type: 'INCREMENT' })}
      >
        plus
      </button>
      <button
        onClick={() => store.dispatch({ type: 'DECREMENT' })}
      >
        minus
      </button>
      <button 
        onClick={() => store.dispatch({ type: 'ZERO' })}
      >
        zero
      </button>
      {store.subscribe(renderApp)}

    </>

  )

}
export default App