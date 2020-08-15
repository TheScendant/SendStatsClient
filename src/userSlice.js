import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'sends',
  initialState: {
/*     userData: {
      sends: [],
      userInfo: {},
    } */
    email: '',
  },
  reducers: {
    setStoreSends: (state, action) => {
      state.userData.sends = action.payload;
    },
    setStoreUserInfo: (state, action) => {
      state.userData.userInfo = action.payload;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    }
  }
})

export const { 
  setStoreSends, 
  setStoreUserInfo, 
  setUserEmail,
} = userSlice.actions;

export default userSlice.reducer;