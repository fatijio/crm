import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openMessageBox } from './messageSlice';
import axios from 'axios';

const initialState = {
    loading: false,
    notify: null,
    users: []
}

export const getUsers = createAsyncThunk(
    'user/getUsers',
    async function (_, { rejectWithValue }) {
        try {
            const response = await axios.get('/api/users/list', { headers: { Authorization: `Bearer ${localStorage.getItem('u-access')}` } });
            //console.log('getTasks/slice', response);
            if (response.statusText !== 'OK') {
                throw new Error('Server error !');
            }
            return response.data;
        } catch (error) {
            //console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

export const queryUpdateUser = createAsyncThunk(
    'task/queryUpdateUser',
    async function ({id, newFormData}, { rejectWithValue, dispatch }) {
        try {
            const response = await axios.put(`/api/users/${id}`, newFormData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('u-access')}`,
                }
            });
            //response.data.task.key = response.data.task.id;
            //console.log(response.data);
            dispatch(openMessageBox(response.data.notify));
            return response.data;
        } catch (err) {
            //console.log(err.response.data)
            dispatch(openMessageBox(err.response.data.notify));
            return rejectWithValue(err.response.data);
        }
    }

);

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        loadingStatus(state) {

        }
    },
    extraReducers: {
        // getUsers
        [getUsers.pending]: (state, action) => {
            state.loading = true;
            //state.error = '';
        },
        [getUsers.fulfilled]: (state, action) => {
            //console.log('getTasks/fulfilled', action.payload);
            state.users = action.payload.empty ? [] : action.payload;
            state.loading = false;
        },
        [getUsers.rejected]: (state, action) => {
            state.error = action.payload;
            state.loading = false;
            //state.tasks = [];
        },
        // queryUpdateUser
        [queryUpdateUser.pending]: (state, action) => {
            state.loading = true;
        },
        [queryUpdateUser.fulfilled]: (state, action) => {
            //state.notify = action.payload.notify;
            state.loading = false;
        },
        [queryUpdateUser.rejected]: (state, action) => {
            //state.notify = action.payload.notify;
            state.loading = false;
        },
    }
});

export const { clearUsers } = userSlice.actions;

export default userSlice.reducer