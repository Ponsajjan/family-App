import { configureStore } from '@reduxjs/toolkit';
import termsReducer from './slices/termsSlice';

export const store = configureStore({
  reducer: {
    terms: termsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
