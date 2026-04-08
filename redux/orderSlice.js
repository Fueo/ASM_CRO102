// src/redux/orderSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// Import helper gọi API của bạn (ví dụ axios instance)
// Nếu bạn chưa cấu hình api, bạn có thể dùng fetch thẳng.
import axiosClient from '../utils/axiosHelper'; // Tùy vào cấu trúc project của bạn

// Thunk để gọi API tạo đơn hàng
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            // Thay đổi đường dẫn cho đúng với config API của bạn
            const response = await axiosClient.post('/orders', orderData);
            return response.data; // Trả về data đơn hàng vừa tạo
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        currentOrder: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload.data;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Có lỗi xảy ra khi thanh toán';
            });
    }
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;