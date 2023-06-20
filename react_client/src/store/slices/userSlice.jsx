import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    loading: false,
    error: '',
    errorName: null,
    users: []
}

// export const getTaskDetail = createAsyncThunk(
//     'task/getTaskDetail',
//     async function (data, { rejectWithValue }) {

//     }
// )

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

// export const addTask = createAsyncThunk(
//     'task/addTask',
//     async function (data, { rejectWithValue }) {

//         try {
//             const response = await axios.post('/api/tasks/addTask', data, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('u-access')}`,
//                 }
//             });
//             response.data.task.key = response.data.task.id;
//             //console.log(response.data)

//             return response.data;
//         } catch (err) {
//             //console.log(err.response.data)
//             return rejectWithValue(err.response.data);
//         }
//     }

// );

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        loadingStatus(state) {

        }
    },
    extraReducers: {
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
    }
});

export const { clearUsers } = userSlice.actions;

export default userSlice.reducer