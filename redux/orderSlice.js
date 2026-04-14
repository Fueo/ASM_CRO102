// src/redux/orderSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosHelper';

// Thunk lấy lịch sử đơn hàng
export const fetchMyOrders = createAsyncThunk(
    'order/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/orders');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi lấy lịch sử đơn hàng');
        }
    }
);

// Thunk tạo đơn hàng
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/orders', orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        currentOrder: null,
        historyOrders: [], // 1. THÊM BIẾN NÀY ĐỂ HỨNG DỮ LIỆU
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
            // --- XỬ LÝ TẠO ĐƠN HÀNG ---
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
            })

            // --- XỬ LÝ LẤY LỊCH SỬ ĐƠN HÀNG (2. BỔ SUNG ĐOẠN NÀY) ---
            .addCase(fetchMyOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.historyOrders = action.payload; // Lắp data từ API vào biến historyOrders
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;