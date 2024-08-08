import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import modelReducer from './slices/modelSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    model: modelReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
