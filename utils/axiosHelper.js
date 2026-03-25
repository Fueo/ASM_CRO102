import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Nhớ thay đổi IP thành IP máy tính của bạn (IPv4)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Tự động huỷ request nếu quá 10s không phản hồi
});

// 1. Interceptor cho Request: Tự động đính kèm Token trước khi gửi API
axiosClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Interceptor cho Response: Xử lý dữ liệu trả về hoặc bắt lỗi chung
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về luôn phần data của Axios để ở UI gọi cho ngắn gọn (response thay vì response.data)
        return response.data;
    },
    (error) => {
        // Xử lý lỗi tập trung
        console.error('Lỗi API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;