import {applyMiddleware, configureStore} from '@reduxjs/toolkit';
import {toastSlice} from './slices';
import thunk from 'redux-thunk';

applyMiddleware
export const store = configureStore({
    reducer: {
        navToast: toastSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    })
}, applyMiddleware(thunk))