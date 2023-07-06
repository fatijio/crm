import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openMessageBox } from './messageSlice';
import axios from 'axios';

const initialState = {
    loading: true,
    error: '',
    errorName: null,
    statuses: [],
    tasks: [],
    notify: null,
}

export const getTaskDetail = createAsyncThunk(
    'task/getTaskDetail',
    async function (data, { rejectWithValue }) {

    }
)

export const getStatuses = createAsyncThunk(
    'task/getStatuses',
    async function (_, { rejectWithValue }) {
        try {
            const response = await axios.get('/api/tasks/allTasks', {
                headers: { Authorization: `Bearer ${localStorage.getItem('u-access')}` },
                params: {
                    statuses: 'get'
                }
            });
            //console.log('getStatuses', response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const getTasks = createAsyncThunk(
    'task/getTasks',
    async function (_, { rejectWithValue }) {
        try {
            const response = await axios.get('/api/tasks/allTasks', { headers: { Authorization: `Bearer ${localStorage.getItem('u-access')}` } });
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

export const addTask = createAsyncThunk(
    'task/addTask',
    async function (data, { rejectWithValue, dispatch }) {
        try {
            const response = await axios.post('/api/tasks/addTask', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('u-access')}`,
                }
            });
            response.data.data.key = response.data.data.id;
            //console.log('addTask ok', response.data);
            dispatch(openMessageBox(response.data.notify));
            return response.data;
        } catch (err) {
            //console.log('addTask error', err.response.data);
            dispatch(openMessageBox(err.response.data.notify));
            return rejectWithValue(err.response.data);
        }
    }

);

export const taskSlice = createSlice({
    name: 'task',
    initialState: initialState,
    reducers: {
        clearNotify(state) {
          state.notify = null;
        }
    },
    extraReducers: {
        [getTasks.pending]: (state, action) => {
            state.loading = true;
            state.error = '';
        },
        [getTasks.fulfilled]: (state, action) => {
            //console.log('getTasks/fulfilled', action.payload);
            state.tasks = action.payload.empty ? [] : action.payload;
            state.loading = false;
        },
        [getTasks.rejected]: (state, action) => {
            state.error = action.payload;
            state.loading = false;
            //state.tasks = [];
        },
        [getStatuses.fulfilled]: (state, action) => {
            state.statuses = action.payload;
        },
        // ADD TASK
        [addTask.pending]: (state, action) => {
            state.loading = true;
            //state.notify = null;
            //state.errorName = "start";
        },
        [addTask.fulfilled]: (state, action) => {
            //console.log('addTask/fulfilled', action.payload.data);
            state.tasks.push(action.payload.data);
            state.loading = false;
            //state.notify = action.payload.notify;
        },
        [addTask.rejected]: (state, action) => {
            //state.error = true;
            //state.errorName = action.payload;
            state.loading = false;
            //state.notify = action.payload.notify;
            //console.log(action.payload);
        }
    }
});

export const { clearNotify } = taskSlice.actions;

export default taskSlice.reducer