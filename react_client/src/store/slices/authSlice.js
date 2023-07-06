import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openMessageBox } from './messageSlice';
import jwt_decode from "jwt-decode";
import axios from 'axios';

const ACCESS_KEY = 'u-access';
//const USERNAME_KEY = 'u-username';

export const fetchLogin = createAsyncThunk(
    'auth/fetchLogin',
    async function ([emailData, passwordData], { rejectWithValue, dispatch }) {
        try {
            const response = await axios.post('/api/auth/login', { email: emailData, password: passwordData });
            //console.log('loginData', loginData);
            dispatch(openMessageBox(response.data.notify));
            return response.data;
        } catch (error) {
            dispatch(openMessageBox(error.response.data.notify));
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchAuth = createAsyncThunk(
    'auth/fetchAuth',
    async function (token, { rejectWithValue, dispatch }) {
        try {
            const checkAccess = await axios.get('/api/auth/access', { params: { token: token } });
            console.log('checkAccess', checkAccess);
            if (checkAccess.data.type === 'error') {
                const response = await axios.get('/api/auth/refresh', { withCredentials: true });
                console.log('going to refresh', response);
                dispatch(openMessageBox(response.data.notify));
                if (!response) {
                    return false;
                }
                dispatch(openMessageBox(response.data.notify));
                localStorage.setItem('u-access', response.data.access_token);
                return response.data;
            }
            console.log(checkAccess.data);
            return checkAccess.data;
        } catch (error) {
            dispatch(openMessageBox(error.response.data.notify));
            console.log('error.response.data', error.response.data);
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
    userId: null,
    login: '',
    userData: null,
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
            let user = jwt_decode(action.payload.access_token);
            state.userId = user.id;
            state.login = action.payload.user.login;
            state.userData = action.payload.user;
            state.access = action.payload.access_token;
            state.group = user.group;
            //console.log('action.payload', jwt_decode(action.payload.access_token));
            console.log('action.payload', action.payload);
            state.isAuth = true;
            localStorage.setItem(ACCESS_KEY, action.payload.access_token);
        },
        [fetchLogin.rejected]: (state, action) => {
            //state.error = action.payload;
            state.isAuth = false;
            console.log(action.payload);
        },
        [fetchAuth.pending]: (state) => {
            state.error = null;
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.isAuth = action.payload.isAuth;
            state.login = action.payload.user.name;
            state.group = action.payload.user.group_id;
            state.userData = action.payload.user;
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