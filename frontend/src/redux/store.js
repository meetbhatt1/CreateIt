import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './AuthSlice';

const store = configureStore({
    reducer: {
        auth: AuthReducer,
    },
});

export default store;
