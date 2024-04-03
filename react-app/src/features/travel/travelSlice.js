import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  travels: [],
  travel: {},
};

export const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    setTravel: (state, action) => {
      console.log(action.payload)
      // state.travel = action.payload;
    },
    setTravels: (state, action) => {
      state.travels = action.payload;
    },
  },
});

export const { setTravel, setTravels } = travelSlice.actions;
export default travelSlice.reducer;
