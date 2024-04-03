import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Travel from './features/travel/travel';

function App() {
  return (
    <Provider store={store}>
    <div>
      <Travel/>
    </div>
    </Provider>
  );
}

export default App;
