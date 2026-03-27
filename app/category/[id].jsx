import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../app_component/home/Header';
import ProductCard from '../../app_component/ProductCard';
import { fetchProducts } from '../../redux/productSlice';
import themes from '../../themes';

const { colors, typography } = themes;

// Helper function map data
const mapProductsForUI = (products = [], categoryName = '') =>
    products.map((item) => {
        let typeDisplay = '';

        if (categoryName === 'Hàng mới về') {
            typeDisplay = item.subCategoryName || ''; 
        } 
        else if (categoryName === 'Cây trồng') {
            typeDisplay = item.subCategoryName || categoryName;
        }
        else {
            typeDisplay = ''; 
        }

        return {
            id: item.id,
            name: item.name,
            type: typeDisplay,
            price: `${Number(item.unitPrice || 0).toLocaleString('vi-VN')}đ`,
            image: item.imageURL || 'https://via.placeholder.com/300x300?text=No+Image',
        };
    });


const CategoryScreen = () => {
    // Lấy params từ Router
    const { id, title, categoryId } = useLocalSearchParams(); 
    
    // Xử lý id danh mục chính
    const mainCateId = categoryId || id;

    const dispatch = useDispatch();
    const { productsByKey, loadingByKey } = useSelector((state) => state.product);

    // State lưu tab danh mục đang chọn 
    const [activeCateId, setActiveCateId] = useState(mainCateId);
    
    // Thêm state quản lý trạng thái pull to refresh
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 1. Gọi API cho danh mục gốc khi mới vào màn hình
    useEffect(() => {
        if (mainCateId && !productsByKey[mainCateId]) {
            dispatch(fetchProducts({ categoryId: mainCateId }));
        }
    }, [mainCateId, dispatch]);

    // 2. Gọi API khi user bấm vào một Chip (danh mục con)
    useEffect(() => {
        if (activeCateId && activeCateId !== mainCateId && !productsByKey[activeCateId]) {
            dispatch(fetchProducts({ categoryId: activeCateId }));
        }
    }, [activeCateId, dispatch]);

    // Hàm xử lý sự kiện kéo xuống để Refresh
    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        // Gọi lại API cho danh mục đang chọn (ép tải lại dữ liệu mới nhất từ server)
        await dispatch(fetchProducts({ categoryId: activeCateId }));
        setIsRefreshing(false);
    }, [dispatch, activeCateId]);

    // Lấy data từ Redux
    const parentData = productsByKey[mainCateId]; 
    const currentData = productsByKey[activeCateId]; 
    const isLoading = loadingByKey[activeCateId];

    // Mảng danh mục con 
    const subCategories = parentData?.subCategories || [];
    
    // Map dữ liệu đổ ra UI
    const mappedProducts = mapProductsForUI(currentData?.products || [], title);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

            {/* 1. Header Tái sử dụng của bạn */}
            <Header 
                title={title || "DANH MỤC"} 
                onBackPress={() => router.back()}
                rightIcon="shopping-cart"
                onRightPress={() => router.push('/Cart')} 
            />

            {/* 2. Filter Chips (Danh mục con) */}
            {subCategories.length > 0 && (
                <View style={styles.filterContainer}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScrollContent}
                    >
                        {/* Chip "Tất cả" */}
                        <TouchableOpacity 
                            style={[styles.chip, activeCateId === mainCateId && styles.activeChip]}
                            onPress={() => setActiveCateId(mainCateId)}
                        >
                            <Text style={[
                                typography.subMedium, 
                                styles.chipText, 
                                activeCateId === mainCateId && styles.activeChipText
                            ]}>
                                Tất cả
                            </Text>
                        </TouchableOpacity>

                        {/* Map các Chip danh mục con từ API */}
                        {subCategories.map((cate) => {
                            const isActive = activeCateId === cate.id;
                            return (
                                <TouchableOpacity 
                                    key={cate.id} 
                                    style={[styles.chip, isActive && styles.activeChip]}
                                    onPress={() => setActiveCateId(cate.id)}
                                >
                                    <Text style={[
                                        typography.subMedium, 
                                        styles.chipText, 
                                        isActive && styles.activeChipText
                                    ]}>
                                        {cate.name} 
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {/* 3. Lưới Sản phẩm (Product Grid) bằng FlatList */}
            {isLoading && mappedProducts.length === 0 && !isRefreshing ? (
                // Hiệu ứng Loading lần đầu (ẩn đi khi đang pull to refresh để tránh flash)
                <View style={{ flex: 1, paddingTop: 40 }}>
                    <ActivityIndicator size="large" color={colors.MAIN} />
                </View>
            ) : mappedProducts.length === 0 ? (
                // State trống
                <ScrollView 
                    contentContainerStyle={{flex: 1}}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.MAIN]} tintColor={colors.MAIN} />
                    }
                >
                    <Text style={{ textAlign: 'center', marginTop: 40, color: colors.GRAY }}>
                        Không có sản phẩm nào.
                    </Text>
                </ScrollView>
            ) : (
                // Render lưới sản phẩm thực tế
                <FlatList
                    data={mappedProducts}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    // Thêm thuộc tính Refresh cho FlatList
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    refreshControl={
                        <RefreshControl 
                            refreshing={isRefreshing} 
                            onRefresh={onRefresh} 
                            colors={[colors.MAIN]} 
                            tintColor={colors.MAIN} 
                        />
                    }
                    renderItem={({ item }) => (
                        <ProductCard item={item} />
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    // --- Styles cho phần Filter Chips ---
    filterContainer: {
        marginBottom: 10,
    },
    filterScrollContent: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        alignItems: 'center',
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginRight: 15, 
        backgroundColor: 'transparent',
    },
    activeChip: {
        backgroundColor: colors.MAIN, 
    },
    chipText: {
        color: colors.GRAY, 
        fontSize: 14,
    },
    activeChipText: {
        color: colors.WHITE, 
    },

    // --- Styles cho FlatList (Lưới sản phẩm) ---
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between', 
    },
});

export default CategoryScreen;