import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";
import axios from 'axios';

const ACCESS_KEY = 'u-access';
//const USERNAME_KEY = 'u-username';

export const fetchLogin = createAsyncThunk(
    'auth/fetchLogin',
    async function ([emailData, passwordData], { rejectWithValue }) {
        try {
            const loginData = await axios.post('/api/auth/login', { email: emailData, password: passwordData });
            //console.log('loginData', loginData);
            return loginData.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchAuth = createAsyncThunk(
    'auth/fetchAuth',
    async function (token, { rejectWithValue }) {
        try {
            const checkAccess = await axios.get('/api/auth/access', { params: { token: token } });
            if (!checkAccess.data) {
                const response = await axios.get('/api/auth/refresh', { withCredentials: true });
                //console.log('going to refresh', response);
                if (!response) {
                    return false;
                }
                localStorage.setItem('u-access', response.data.access_token);
                return response.data;
            }
            //console.log(checkAccess.data);
            return checkAccess.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }

    }
);

export const fetchLogout = createAsyncThunk(
    'auth/fetchLogout',
    async function (_, { rejectWithValue }) {
        try {
            const logout = await axios.post('/api/auth/logout', { withCredentials: true });
            localStorage.removeItem('u-access');
            return logout.data;
        } catch (error) {
            localStorage.removeItem('u-access');
            return rejectWithValue(error.response.data);
        }
    }
)

const initialState = {
    login: '',
    access: localStorage.getItem(ACCESS_KEY) ?? '',
    isAuth: false,
    group: 2,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        login(state, action) {
            state.login = action.payload.email;
            state.access = action.payload.access_token;
            state.isAuth = Boolean(action.payload.access_token);
            localStorage.setItem(ACCESS_KEY, action.payload.access_token);
        }
    },
    extraReducers: {
        [fetchLogin.fulfilled]: (state, action) => {
            let groupId = jwt_decode(action.payload.access_token);
            state.login = action.payload.user;
            state.access = action.payload.access_token;
            state.group = groupId.group;
            //console.log('action.payload', jwt_decode(action.payload.access_token));
            state.isAuth = true;
            localStorage.setItem(ACCESS_KEY, action.payload.access_token);
        },
        [fetchLogin.rejected]: (state, action) => {
            state.error = action.payload;
            state.isAuth = false;
            //console.log(action.payload);
        },
        [fetchAuth.pending]: (state) => {
            state.error = null;
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.isAuth = action.payload.isAuth;
            state.login = action.payload.user.fio;
            state.group = action.payload.user.group_id;
            //state.login = action.payload.email;
            //console.log(action.payload)
        },
        [fetchAuth.rejected]: (state, action) => {
            state.isAuth = false;
        },
        [fetchLogout.fulfilled]: (state) => {
            state.access = '';
            state.isAuth = false;
        },
        [fetchLogout.rejected]: (state) => {
            state.isAuth = false;
        }
    }
})

export const { login } = authSlice.actions;

export default authSlice.reducer