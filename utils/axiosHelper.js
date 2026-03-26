import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

let reduxStore = null;

export const injectStore = (store) => {
    reduxStore = store;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

axiosClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isUnauthorized = error.response?.status === 401;
        const isRefreshApi = originalRequest?.url?.includes('/users/refresh-token');

        if (!isUnauthorized || originalRequest?._retry || isRefreshApi) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((newAccessToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosClient(originalRequest);
                });
            }

            isRefreshing = true;

            const refreshToken = await AsyncStorage.getItem('refreshToken');

            if (!refreshToken) {
                throw new Error('Không có refresh token');
            }

            const refreshResponse = await axios.post(
                `${API_BASE_URL}/users/refresh-token`,
                { refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                }
            );

            const newAccessToken = refreshResponse.data?.data?.accessToken;
            const newRefreshToken = refreshResponse.data?.data?.refreshToken;

            if (!newAccessToken || !newRefreshToken) {
                throw new Error('Refresh token response không hợp lệ');
            }

            await AsyncStorage.setItem('accessToken', newAccessToken);
            await AsyncStorage.setItem('refreshToken', newRefreshToken);

            // dispatch động để tránh circular import
            if (reduxStore) {
                reduxStore.dispatch({
                    type: 'user/updateTokens',
                    payload: {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    },
                });
            }

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);

            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');

            if (reduxStore) {
                reduxStore.dispatch({
                    type: 'user/logoutUser',
                });
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosClient;