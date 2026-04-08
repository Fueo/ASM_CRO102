import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosHelper';

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/users/login', { email, password });
            const { accessToken, refreshToken, user } = response.data.data;

            await AsyncStorage.setItem('accessToken', accessToken);
            if (refreshToken) {
                await AsyncStorage.setItem('refreshToken', refreshToken);
            }

            return {
                user,
                accessToken,
                refreshToken,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Đăng nhập thất bại'
            );
        }
    }
);

export const loginWithGoogle = createAsyncThunk(
    'user/loginWithGoogle',
    async (idToken, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/users/google-login', { idToken });
            const { accessToken, refreshToken, user } = response.data.data;

            await AsyncStorage.setItem('accessToken', accessToken);
            if (refreshToken) {
                await AsyncStorage.setItem('refreshToken', refreshToken);
            }

            return {
                user,
                accessToken,
                refreshToken,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Đăng nhập Google thất bại'
            );
        }
    }
);

export const logoutUserAsync = createAsyncThunk(
    'user/logoutUserAsync',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const authProvider = state?.user?.currentUser?.authProvider;

        try {
            try {
                await axiosClient.post('/users/logout');
            } catch (error) {
                console.log('Logout backend error:', error?.response?.data || error?.message);
            }

            if (authProvider === 'google') {
                try {
                    const hasPrev = await GoogleSignin.hasPreviousSignIn();
                    if (hasPrev) {
                        await GoogleSignin.signOut().catch(() => null);
                        await GoogleSignin.revokeAccess().catch(() => null);
                    }
                } catch (googleError) {
                    console.log('Google signOut error:', googleError);
                }
            }

            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');

            return true;
        } catch (error) {
            return rejectWithValue(error?.message || 'Đăng xuất thất bại');
        }
    }
);

// ==============================================================
// THÊM THUNK: CẬP NHẬT THÔNG TIN NGƯỜI DÙNG
// ==============================================================
export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (userData, { rejectWithValue }) => {
        try {
            // Gửi request PUT tới endpoint /users/me
            const response = await axiosClient.put('/users/me', userData);
            // Trả về dữ liệu user mới nhất từ backend
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại'
            );
        }
    }
);

const initialState = {
    currentUser: null,
    isLoggedIn: false,
    isLoading: false,
    accessToken: null,
    refreshToken: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.currentUser = null;
            state.isLoggedIn = false;
            state.accessToken = null;
            state.refreshToken = null;
        },
        setCredentials: (state, action) => {
            state.currentUser = action.payload.user;
            state.isLoggedIn = true;
            state.accessToken = action.payload.accessToken || null;
            state.refreshToken = action.payload.refreshToken || null;
        },
        updateTokens: (state, action) => {
            state.accessToken = action.payload.accessToken || null;
            state.refreshToken = action.payload.refreshToken || null;
            if (action.payload.user) {
                state.currentUser = action.payload.user;
                state.isLoggedIn = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // --- LOGIN LOCAL ---
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = true;
                state.currentUser = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
            })

            // --- LOGIN GOOGLE ---
            .addCase(loginWithGoogle.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = true;
                state.currentUser = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(loginWithGoogle.rejected, (state) => {
                state.isLoading = false;
            })

            // --- LOGOUT ---
            .addCase(logoutUserAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUserAsync.fulfilled, (state) => {
                state.isLoading = false;
                state.currentUser = null;
                state.isLoggedIn = false;
                state.accessToken = null;
                state.refreshToken = null;
            })
            .addCase(logoutUserAsync.rejected, (state) => {
                state.isLoading = false;
                state.currentUser = null;
                state.isLoggedIn = false;
                state.accessToken = null;
                state.refreshToken = null;
            })

            // ==============================================================
            // --- UPDATE PROFILE ---
            // ==============================================================
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                // Cập nhật lại state currentUser với dữ liệu mới trả về từ API
                state.currentUser = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { logoutUser, setCredentials, updateTokens } = userSlice.actions;
export default userSlice.reducer;