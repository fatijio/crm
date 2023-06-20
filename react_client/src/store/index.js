import { configureStore, combineReducers } from "@reduxjs/toolkit";
import taskSlice from './slices/taskSlice';
import authSlice from './slices/authSlice';
import notifySlice from './slices/notifySlice';
import userSlice from './slices/userSlice';
import testSlice from './slices/testSlice';
import messageSlice from './slices/messageSlice';

const rootReducer = combineReducers({
    task: taskSlice,
    auth: authSlice,
    notify: notifySlice,
    user: userSlice,
    testSlice: testSlice,
    message: messageSlice,
})

export function setupStore() {
    return configureStore({
        reducer: rootReducer
    });
}
