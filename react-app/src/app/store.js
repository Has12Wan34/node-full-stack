import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import travelReducer from '../features/travel/travelSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    travels: travelReducer,
    travel: travelReducer,
  },
});
