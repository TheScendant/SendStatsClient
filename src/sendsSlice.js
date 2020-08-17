import { createSlice } from '@reduxjs/toolkit';

export const sendsSlice = createSlice({
  name: 'sends',
  initialState: {},
  reducers: {
    setStoreSends: (state, action) => {
      state.sends = action.payload;
    },
    setStoreStars: (state, action) => {
      state.stars = action.payload;
    }
  }
})

export const {
  setStoreSends,
  setStoreStars,
} = sendsSlice.actions;

export default sendsSlice.reducer;