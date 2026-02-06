import { configureStore } from '@reduxjs/toolkit';
import { membersApi } from './services/membersApi';
import { calendarApi } from './services/calendarApi';
import { treeApi } from './services/treeApi';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        [membersApi.reducerPath]: membersApi.reducer,
        [calendarApi.reducerPath]: calendarApi.reducer,
        [treeApi.reducerPath]: treeApi.reducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            membersApi.middleware,
            calendarApi.middleware,
            treeApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


