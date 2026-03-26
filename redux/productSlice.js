import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosHelper';

export const fetchCategories = createAsyncThunk(
    'product/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/categories');
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Lấy danh mục thất bại'
            );
        }
    }
);

export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async ({ keyword, categoryId, limit = 10, page = 1 } = {}, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/products', {
                params: {
                    keyword,
                    categoryId,
                    limit,
                    page,
                },
            });

            return {
                key: categoryId || keyword || 'all',
                data: response.data.data || response.data,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Lấy sản phẩm thất bại'
            );
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'product/fetchProductById',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(`/products/${productId}`);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Lấy chi tiết sản phẩm thất bại'
            );
        }
    }
);

export const fetchHomeData = createAsyncThunk(
    'product/fetchHomeData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/products/home');
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Lấy dữ liệu home thất bại'
            );
        }
    }
);

const initialState = {
    categories: [],
    categoriesLoading: false,
    categoriesError: null,

    productsByKey: {},
    loadingByKey: {},
    errorByKey: {},

    productDetail: null,
    detailLoading: false,
    detailError: null,

    homeData: {
        featuredCategories: [],
        categories: [],
    },
    homeLoading: false,
    homeError: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.categoriesLoading = true;
                state.categoriesError = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categoriesLoading = false;
                state.categories = action.payload || [];
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categoriesLoading = false;
                state.categoriesError = action.payload || 'Lấy danh mục thất bại';
            })

            .addCase(fetchProducts.pending, (state, action) => {
                const key = action.meta.arg?.categoryId || action.meta.arg?.keyword || 'all';
                state.loadingByKey[key] = true;
                state.errorByKey[key] = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const { key, data } = action.payload;
                state.loadingByKey[key] = false;
                state.productsByKey[key] = data;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                const key = action.meta.arg?.categoryId || action.meta.arg?.keyword || 'all';
                state.loadingByKey[key] = false;
                state.errorByKey[key] = action.payload || 'Lấy sản phẩm thất bại';
            })

            .addCase(fetchProductById.pending, (state) => {
                state.detailLoading = true;
                state.detailError = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.productDetail = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.detailLoading = false;
                state.detailError = action.payload || 'Lấy chi tiết sản phẩm thất bại';
            })

            .addCase(fetchHomeData.pending, (state) => {
                state.homeLoading = true;
                state.homeError = null;
            })
            .addCase(fetchHomeData.fulfilled, (state, action) => {
                state.homeLoading = false;
                state.homeData = action.payload || {
                    featuredCategories: [],
                    categories: [],
                };
            })
            .addCase(fetchHomeData.rejected, (state, action) => {
                state.homeLoading = false;
                state.homeError = action.payload || 'Lấy dữ liệu home thất bại';
            });
    },
});

export default productSlice.reducer;