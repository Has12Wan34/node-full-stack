import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Movie from './features/movie/movie';

function App() {
  return (
    <Provider store={store}>
    <div>
      <Movie/>
    </div>
    </Provider>
  );
}

export default App;
