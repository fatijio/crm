import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

type tNotify = {
    messages: tMessages[];
    loading: boolean;
}

type tMessages = {
    [key: string]: string;
}

const initialState: tNotify = {
    messages: [],
    loading: false,
}

export const getNotifications = createAsyncThunk(
    'notify/getNotifications',
    async function (_, { rejectWithValue }) {
        try {
            const { data } = await axios.get('/api/notifications', { headers: { Authorization: `Bearer ${localStorage.getItem('u-access')}` } });
            //console.log('notify_slice', data);
            return data;
        } catch (error: any) {
            console.log(error.response.data);
        }
    }

);

export const deleteNotification = createAsyncThunk(
    'notify/deleteNotification',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.delete(`/api/notifications/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('u-access')}` } });
            return response.data;
        } catch (error: any) {
            console.log(error.response.data);
        }
    }
)

const notifySlice = createSlice({
    name: 'notify',
    initialState: initialState,
    reducers: {
        setNewNotice(state, action) {
            state.messages.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getNotifications.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(getNotifications.fulfilled, (state, action) => {
            state.messages = action.payload;
            state.loading = false;
        })
        builder.addCase(getNotifications.rejected, (state, action) => {
            state.loading = false;
        })
        builder.addCase(deleteNotification.fulfilled, (state, action) => {
            //console.log('action_id', action.payload);
            state.messages = state.messages.filter(notice => {
                //console.log('filter', notice)
                return notice.id !== action.payload;
            });
        })

    }
})

export const { setNewNotice } = notifySlice.actions;

export default notifySlice.reducer;