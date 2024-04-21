import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import travelAPI from './travelAPI';

const initialState = {
  travels: [],
  travel: {},
  status: 'idle',
  error: null
};

export const fetchTravels = createAsyncThunk(
  'travel/fetchTravels',
  async (config) => {
    const res = await travelAPI.get('/api/travels', config);
    return res.data;
  }
);

export const fetchTravelsById = createAsyncThunk(
  'travel/fetchTravelsById',
  async (config) => {
    const { id } = config;
    const res = await travelAPI.get(`/api/travel/${id}`);
    return res.data;
  }
);

export const fetchSearchTravels = createAsyncThunk(
  'travel/fetchSearchTravels',
  async (config) => {
    const res = await travelAPI.get('/api/travels/search', config);
    return res.data;
  }
);

export const addTravel = createAsyncThunk(
  'travel/addTravel',
  async (body) => {
    const res = await travelAPI.post('/api/travel', body);
    return res.data;
  }
);

export const editTravel = createAsyncThunk(
  'travel/editTravel',
  async (config) => {
    const { id, body } = config;
    const res = await travelAPI.put(`/api/travel/${id}`, body);
    return res.data;
  }
);

export const removeTravel = createAsyncThunk(
  'travel/removeTravel',
  async (config) => {
    const { id } = config;
    const res = await travelAPI.delete(`/api/travel/${id}`);
    return res.data;
  }
);

export const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    setTravel: (state, action) => {
      state.travel = {
        ...state.travel,
        [action.payload.name]: action.payload.value
      }
    },
  },
  extraReducers: {
    [addTravel.pending]: (state) => {
      state.status = 'loading';
    },
    [addTravel.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.travels = [action.payload, ...state.travels];
    },
    [addTravel.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [editTravel.pending]: (state) => {
      state.status = 'loading';
    },
    [editTravel.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      const index = state.travels.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.travels[index] = action.payload;
      }
    },
    [editTravel.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [fetchTravels.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchTravels.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.travels = action.payload;
    },
    [fetchTravels.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [fetchSearchTravels.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchSearchTravels.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.travels = action.payload;
    },
    [fetchSearchTravels.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [fetchTravelsById.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchTravelsById.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.travel = action.payload;
    },
    [fetchTravelsById.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [removeTravel.pending]: (state) => {
      state.status = 'loading';
    },
    [removeTravel.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.travels = action.payload;
    },
    [removeTravel.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
  }
});

export const { setTravel } = travelSlice.actions;
export default travelSlice.reducer;
