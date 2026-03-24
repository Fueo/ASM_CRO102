import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../app_component/home/Header'; // Điều chỉnh lại đường dẫn
import ProductCard from '../../app_component/ProductCard'; // Import ProductCard đã có
import themes from '../../themes';

const { colors, typography } = themes;

// --- DỮ LIỆU GIẢ LẬP (Tương lai lấy từ API dựa vào biến 'id') ---
const DUMMY_SUBCATEGORIES = [
    { id: 'new', title: 'Hàng mới về' },
    { id: 'light', title: 'Ưa sáng' },
    { id: 'shade', title: 'Ưa bóng' },
];

const DUMMY_PRODUCTS = [
    { id: '1', name: 'Spider Plant', type: 'Ưa bóng', price: '250.000đ', image: 'https://images.unsplash.com/photo-1596547609652-9fc5d8d42850?q=80&w=400&auto=format&fit=crop' },
    { id: '2', name: 'Song of India', type: 'Ưa sáng', price: '250.000đ', image: 'https://images.unsplash.com/photo-1485909645996-33924151433f?q=80&w=400&auto=format&fit=crop' },
    { id: '3', name: 'Pink Anthurium', type: 'Ưa bóng', price: '250.000đ', image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=400&auto=format&fit=crop' },
    { id: '4', name: 'Black Love Anthurium', type: 'Ưa bóng', price: '250.000đ', image: 'https://images.unsplash.com/photo-1620127807580-282e787968bc?q=80&w=400&auto=format&fit=crop' },
    { id: '5', name: 'Grey Star Calarthea', type: 'Ưa sáng', price: '250.000đ', image: 'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?q=80&w=400&auto=format&fit=crop' },
    { id: '6', name: 'Banana Plant', type: 'Ưa sáng', price: '250.000đ', image: 'https://images.unsplash.com/photo-1616440347285-d6c5bbadbfb2?q=80&w=400&auto=format&fit=crop' },
];

const CategoryScreen = () => {
    // Lấy params từ Router (VD: router.push({ pathname: '/category/cay-trong', params: { title: 'CÂY TRỒNG' } }))
    const { id, title } = useLocalSearchParams(); 

    // State lưu tab danh mục đang chọn (Mặc định là 'all')
    const [activeCate, setActiveCate] = useState('all');

    // Logic xử lý mảng sub-categories (Thêm "Tất cả" vào đầu nếu mảng có dữ liệu)
    // Thực tế bạn có thể truyền props mảng này hoặc fetch API
    const subCategories = DUMMY_SUBCATEGORIES.length > 0 
        ? [{ id: 'all', title: 'Tất cả' }, ...DUMMY_SUBCATEGORIES] 
        : [];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

            {/* 1. Header Tái sử dụng */}
            <Header 
                title={title || "DANH MỤC"} // Tiêu đề lấy từ router params, mặc định là DANH MỤC
                onBackPress={() => router.back()}
                rightIcon="shopping-cart"
                onRightPress={() => console.log('Mở giỏ hàng')}
            />

            {/* 2. Filter Chips (Danh mục con) - Chỉ render khi có data */}
            {subCategories.length > 0 && (
                <View style={styles.filterContainer}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScrollContent}
                    >
                        {subCategories.map((cate) => {
                            const isActive = activeCate === cate.id;
                            return (
                                <TouchableOpacity 
                                    key={cate.id} 
                                    style={[styles.chip, isActive && styles.activeChip]}
                                    onPress={() => setActiveCate(cate.id)}
                                >
                                    <Text style={[
                                        typography.subMedium, 
                                        styles.chipText, 
                                        isActive && styles.activeChipText
                                    ]}>
                                        {cate.title}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {/* 3. Lưới Sản phẩm (Product Grid) bằng FlatList */}
            <FlatList
                data={DUMMY_PRODUCTS}
                keyExtractor={(item) => item.id}
                numColumns={2} // Chia làm 2 cột
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper} // Xử lý khoảng cách giữa 2 cột
                renderItem={({ item }) => (
                    // Tái sử dụng ProductCard
                    <ProductCard 
                        item={item} 
                        // onPress={...} // ProductCard đã có mặc định chuyển sang trang chi tiết
                    />
                )}
            />
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
        marginRight: 15, // Khoảng cách giữa các chip
        backgroundColor: 'transparent',
    },
    activeChip: {
        backgroundColor: colors.MAIN, // Màu xanh lá khi được chọn
    },
    chipText: {
        color: colors.GRAY, // Màu chữ xám khi chưa chọn
        fontSize: 14,
    },
    activeChipText: {
        color: colors.WHITE, // Chữ trắng khi được chọn
    },

    // --- Styles cho FlatList (Lưới sản phẩm) ---
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between', // Đẩy 2 thẻ ProductCard dạt ra 2 bên lề
    },
});

export default CategoryScreen;