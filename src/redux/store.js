import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {subjectApi} from './api';
import slice from './slice';
export const store = configureStore({
  reducer: {
    subject: slice,
    [subjectApi.reducerPath]: subjectApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(subjectApi.middleware),
});

setupListeners(store.dispatch);
