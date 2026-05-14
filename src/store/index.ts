import { configureStore, Reducer } from '@reduxjs/toolkit';
import termsReducer, { TermsState } from './slices/termsSlice';

export const store = configureStore({
  reducer: {
    terms: termsReducer as Reducer<TermsState>,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
