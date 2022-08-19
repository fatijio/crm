import { configureStore, combineReducers } from "@reduxjs/toolkit";
import taskReducer from './slices/taskSlice';
import authReducer from './slices/authSlice';
import notifyReducer from './slices/notifySlice';
import testReducer from './slices/testSlice';

const rootReducer = combineReducers({
    task: taskReducer,
    auth: authReducer,
    notify: notifyReducer,
    testSlice: testReducer
})

export function setupStore() {
    return configureStore({
        reducer: rootReducer
    });
}
