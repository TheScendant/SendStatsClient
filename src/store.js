import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import sendsReducer from './sendsSlice';

export default configureStore({
  reducer: {
    userData: userReducer,
    sendsData: sendsReducer,
  },
});
