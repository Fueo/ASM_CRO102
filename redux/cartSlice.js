import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosHelper';

// =========================================================
// 1. CÁC ASYNC THUNKS (GỌI API)
// =========================================================

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/cart');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi tải giỏ hàng');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/cart', { productId, quantity });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi thêm vào giỏ hàng');
        }
    }
);

export const updateCartItemQuantity = createAsyncThunk(
    'cart/updateCartItemQuantity',
    async ({ cartItemId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.patch(`/cart/${cartItemId}/quantity`, { quantity });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi cập nhật số lượng');
        }
    }
);

export const toggleCartItemSelection = createAsyncThunk(
    'cart/toggleCartItemSelection',
    async ({ cartItemId, isSelected }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.patch(`/cart/${cartItemId}/select`, { isSelected });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi cập nhật trạng thái chọn');
        }
    }
);

export const toggleAllCartItemsSelection = createAsyncThunk(
    'cart/toggleAllCartItemsSelection',
    async ({ isSelected }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.patch('/cart/select-all', { isSelected });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi chọn tất cả sản phẩm');
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeCartItem',
    async (cartItemId, { rejectWithValue }) => {
        try {
            await axiosClient.delete(`/cart/${cartItemId}`);
            return cartItemId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi xóa sản phẩm');
        }
    }
);

export const clearSelectedCartItems = createAsyncThunk(
    'cart/clearSelectedCartItems',
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.delete('/cart/selected');
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi xóa sản phẩm đã chọn');
        }
    }
);

// =========================================================
// 2. HELPER FUNCTION: TỰ ĐỘNG TÍNH TOÁN LẠI TỔNG TIỀN
// =========================================================
const recalculateSummary = (state) => {
    let totalCartAmount = 0;
    let totalSelectedItems = 0;

    state.items.forEach((item) => {
        if (item.isSelected) {
            totalCartAmount += item.total || 0;
            totalSelectedItems += item.quantity || 0;
        }
    });

    state.summary = {
        totalItems: state.items.length,
        totalSelectedItems,
        totalCartAmount,
    };
};

// =========================================================
// 3. CART SLICE
// =========================================================
const initialState = {
    items: [],
    summary: {
        totalItems: 0,
        totalSelectedItems: 0,
        totalCartAmount: 0,
    },
    isLoading: false,
    actionLoading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartOnLogout: (state) => {
            state.items = [];
            state.summary = initialState.summary;
            state.error = null;
        },
        // Thêm action này để Cập nhật Giao diện Ngay lập tức (Optimistic Update)
        updateCartItemQuantityLocal: (state, action) => {
            const { cartItemId, quantity } = action.payload;
            const index = state.items.findIndex(item => item._id === cartItemId);

            if (index >= 0) {
                const item = state.items[index];
                item.quantity = quantity;

                // Tính toán lại giá trị 'total' của riêng item này dựa trên đơn giá
                if (item.productId && item.productId.unitPrice) {
                    item.total = quantity * item.productId.unitPrice;
                }

                // Gọi lại helper để update tổng tiền toàn giỏ hàng
                recalculateSummary(state);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // --- FETCH CART ---
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.items || [];
                state.summary = action.payload.summary || initialState.summary;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // --- ADD TO CART ---
            .addCase(addToCart.pending, (state) => { state.actionLoading = true; })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.actionLoading = false;
                const newItem = action.payload;
                const existingIndex = state.items.findIndex(item => item._id === newItem._id);

                if (existingIndex >= 0) {
                    state.items[existingIndex] = newItem;
                } else {
                    state.items.push(newItem);
                }
                recalculateSummary(state);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // --- UPDATE QUANTITY (SILENT SYNC) ---
            // Bỏ state.actionLoading = true ở đây để giao diện không bị giật loading khi call API ngầm
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                const updatedItem = action.payload;
                const index = state.items.findIndex(item => item._id === updatedItem._id);
                if (index >= 0) {
                    // Đồng bộ lại với data chuẩn từ Backend trả về
                    state.items[index] = updatedItem;
                    recalculateSummary(state);
                }
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.error = action.payload;
                // Nếu muốn hoàn hảo, bạn có thể dispatch fetchCart ở view để roll-back UI nếu API báo lỗi
            })

            // --- TOGGLE SINGLE ITEM SELECTION ---
            .addCase(toggleCartItemSelection.fulfilled, (state, action) => {
                const updatedItem = action.payload;
                const index = state.items.findIndex(item => item._id === updatedItem._id);
                if (index >= 0) {
                    state.items[index] = updatedItem;
                    recalculateSummary(state);
                }
            })

            // --- TOGGLE ALL SELECTION ---
            .addCase(toggleAllCartItemsSelection.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.summary = action.payload.summary;
            })

            // --- REMOVE SINGLE ITEM ---
            .addCase(removeCartItem.pending, (state) => { state.actionLoading = true; })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.actionLoading = false;
                const deletedId = action.payload;
                state.items = state.items.filter(item => item._id !== deletedId);
                recalculateSummary(state);
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // --- CLEAR SELECTED ITEMS ---
            .addCase(clearSelectedCartItems.pending, (state) => { state.actionLoading = true; })
            .addCase(clearSelectedCartItems.fulfilled, (state) => {
                state.actionLoading = false;
                state.items = state.items.filter(item => !item.isSelected);
                recalculateSummary(state);
            })
            .addCase(clearSelectedCartItems.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });
    },
});

// Nhớ export action này để CartScreen có thể dùng được
export const { clearCartOnLogout, updateCartItemQuantityLocal } = cartSlice.actions;
export default cartSlice.reducer;