import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {subjectApi} from './api';
export const store = configureStore({
  reducer: {
    [subjectApi.reducerPath]: subjectApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(subjectApi.middleware),
});

setupListeners(store.dispatch);
