import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";
import axios from 'axios';

const ACCESS_KEY = 'u-access';
//const USERNAME_KEY = 'u-username';

// Типы для Auth стора
type tAuth = {
    userId: number | null,
    login: string,
    userData: object | null,
    access: string,
    isAuth: boolean,
    group: number,
    error: object | null
}

const initialState: tAuth = {
    userId: null,
    login: '',
    userData: null,
    access: localStorage.getItem(ACCESS_KEY) ?? '',
    isAuth: false,
    group: 2,
    error: null
}

export const fetchLogin = createAsyncThunk(
    'auth/fetchLogin',
    async function ([emailData, passwordData]: string[], { rejectWithValue }) {
        try {
            const loginData = await axios.post('/api/auth/login', { email: emailData, password: passwordData });
            //console.log('loginData', loginData);
            return loginData.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchAuth = createAsyncThunk(
    'auth/fetchAuth',
    async function (_, { rejectWithValue }) {
        try {
            const token = localStorage.getItem('u-access');
            const checkAccess = await axios.get('/api/auth/access', { params: { token: token } });
            //console.log('checkAccess', checkAccess);
            if (checkAccess.data.type === 'error') {
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
        } catch (error: any) {
            //console.log('error.response.data', error.response.data);
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
        } catch (error: any) {
            localStorage.removeItem('u-access');
            return rejectWithValue(error.response.data);
        }
    }
)

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
    extraReducers: (builder) => {
        builder.addCase(fetchLogin.fulfilled, (state, action) => {
            let user: any = jwt_decode(action.payload.access_token);
            state.userId = user.id;
            state.login = action.payload.user.login;
            state.userData = action.payload.user;
            state.access = action.payload.access_token;
            state.group = user.group;
            //console.log('action.payload', jwt_decode(action.payload.access_token));
            //console.log('action.payload', action.payload);
            state.isAuth = true;
            localStorage.setItem(ACCESS_KEY, action.payload.access_token);
        })
        builder.addCase(fetchLogin.rejected, (state, action) => {
            //state.error = action.payload;
            state.isAuth = false;
            //console.log(action.payload);
        })
        builder.addCase(fetchAuth.pending, (state) => {
            state.error = null;
        })
        builder.addCase(fetchAuth.fulfilled, (state, action) => {
            state.isAuth = action.payload.isAuth;
            state.login = action.payload.user.name;
            state.group = action.payload.user.group_id;
            state.userData = action.payload.user;
            //state.login = action.payload.email;
            //console.log(action.payload)
        })
        builder.addCase(fetchAuth.rejected, (state) => {
            state.isAuth = false;
        })
        builder.addCase(fetchLogout.fulfilled, (state) => {
            state.access = '';
            state.isAuth = false;
        })
        builder.addCase(fetchLogout.rejected, (state) => {
            state.isAuth = false;
        })
    }
})

export const { login } = authSlice.actions;

export default authSlice.reducer