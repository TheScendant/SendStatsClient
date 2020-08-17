import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setStoreUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserID: (state, action) => {
      state.userID = action.payload;
    }
  }
})

export const { 
  setStoreUserInfo, 
  setUserEmail,
  setUserID,
} = userSlice.actions;

export default userSlice.reducer;