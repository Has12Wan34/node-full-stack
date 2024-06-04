import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
// import Travel from './features/travel/travel';
import Chat from './features/Chat';

function App() {
  return (
    <Provider store={store}>
    <div>
      <Chat/>
    </div>
    </Provider>
  );
}

export default App;
