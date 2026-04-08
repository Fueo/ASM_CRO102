import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
    clearSelectedCartItems,
    fetchCart,
    removeCartItem,
    toggleCartItemSelection,
    updateCartItemQuantity,
    updateCartItemQuantityLocal // Action tĩnh để cập nhật UI ngay lập tức
} from '../redux/cartSlice';

import CartProductCard from '../app_component/cart/CartProductCard';
import ConfirmModal from '../app_component/cart/ConfirmModal';
import Header from '../app_component/home/Header';
import themes from '../themes';

const { colors, typography } = themes;

const CartScreen = () => {
    const dispatch = useDispatch();

    // Móc dữ liệu thật từ Redux State
    const { items, summary, isLoading } = useSelector((state) => state.cart);
    const [isModalVisible, setModalVisible] = useState(false);

    // Dùng đối tượng để lưu trữ timeout của từng item riêng biệt (Debounce)
    const debounceTimers = useRef({});

    // Gọi API lấy dữ liệu giỏ hàng khi vừa vào trang
    useEffect(() => {
        dispatch(fetchCart());

        // Cleanup function: Clear mọi timeout khi rời khỏi màn hình để tránh rò rỉ bộ nhớ
        return () => {
            Object.values(debounceTimers.current).forEach(clearTimeout);
        };
    }, [dispatch]);

    // Xử lý chọn / bỏ chọn sản phẩm
    const handleToggleSelect = (item) => {
        dispatch(toggleCartItemSelection({
            cartItemId: item._id,
            isSelected: !item.isSelected
        }));
    };

    // Xử lý Tăng / Giảm số lượng với Optimistic Update & Debounce
    const handleUpdateQuantity = (item, delta) => {
        const newQuantity = item.quantity + delta;

        // Chặn không cho số lượng tụt xuống <= 0
        if (newQuantity <= 0) return;

        // Check tồn kho
        if (item.productId && newQuantity > item.productId.stockQuantity) {
            Alert.alert("Thông báo", "Số lượng vượt quá tồn kho!");
            return;
        }

        // 1. CẬP NHẬT GIAO DIỆN NGAY LẬP TỨC (Chỉ đổi State trên điện thoại)
        dispatch(updateCartItemQuantityLocal({
            cartItemId: item._id,
            quantity: newQuantity
        }));

        // 2. XOÁ TIMEOUT CŨ (nếu người dùng bấm liên tục chưa tới 1s)
        if (debounceTimers.current[item._id]) {
            clearTimeout(debounceTimers.current[item._id]);
        }

        // 3. SET TIMEOUT MỚI (Đợi 1 giây sau lần bấm cuối cùng mới gọi API)
        debounceTimers.current[item._id] = setTimeout(() => {
            dispatch(updateCartItemQuantity({
                cartItemId: item._id,
                quantity: newQuantity
            }))
                .unwrap()
                .catch(() => {
                    // Rollback giao diện nếu API gọi ngầm bị lỗi
                    Alert.alert("Lỗi", "Không thể cập nhật số lượng trên máy chủ");
                    dispatch(fetchCart()); // Tải lại giỏ hàng cho chắc ăn
                });
        }, 1000);
    };

    // Xử lý xóa 1 sản phẩm
    const handleRemoveItem = (id) => {
        dispatch(removeCartItem(id));
    };

    // Xử lý xóa các sản phẩm đang được chọn
    const handleRemoveSelectedItems = () => {
        dispatch(clearSelectedCartItems());
        setModalVisible(false);
    };

    // Kiểm tra có đang chọn item nào để xóa không (dựa vào `summary` của Redux)
    const hasSelectedItems = summary.totalSelectedItems > 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

            <Header
                title="GIỎ HÀNG"
                onBackPress={() => router.back()}
                rightIcon="trash-2"
                onRightPress={() => {
                    if (items.length === 0) return;

                    if (hasSelectedItems) {
                        setModalVisible(true);
                    } else {
                        Alert.alert("Lưu ý", "Vui lòng chọn sản phẩm cần xoá.");
                    }
                }}
            />

            {isLoading ? (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color={colors.MAIN} />
                </View>
            ) : items.length > 0 ? (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <CartProductCard
                            item={item}
                            isSelected={item.isSelected}
                            onToggleSelect={() => handleToggleSelect(item)}
                            onIncrease={() => handleUpdateQuantity(item, 1)}
                            onDecrease={() => handleUpdateQuantity(item, -1)}
                            onRemove={() => handleRemoveItem(item._id)}
                        />
                    )}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
                </View>
            )}

            {/* Chỉ hiển thị Checkout Bar khi có sản phẩm được chọn */}
            {hasSelectedItems && (
                <View style={styles.bottomCheckout}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tạm tính</Text>
                        <Text style={[typography.subBold, styles.totalPrice]}>
                            {(summary.totalCartAmount || 0).toLocaleString('vi-VN')}đ
                        </Text>
                    </View>
                    
                    {/* BỔ SUNG sự kiện onPress VÀO ĐÂY */}
                    <TouchableOpacity 
                        style={styles.checkoutBtn} 
                        activeOpacity={0.8}
                        onPress={() => router.push('/Order')} // Điều hướng sang OrderScreen
                    >
                        <Text style={styles.checkoutBtnText}>Tiến hành thanh toán</Text>
                        <Feather name="chevron-right" size={20} color={colors.WHITE} />
                    </TouchableOpacity>
                </View>
            )}

            <ConfirmModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleRemoveSelectedItems}
                title="Xác nhận xoá sản phẩm đã chọn?"
                description="Thao tác này sẽ không thể khôi phục."
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.WHITE },
    listContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 100 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: colors.GRAY, fontSize: 16 },
    bottomCheckout: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.WHITE, paddingHorizontal: 24, paddingTop: 15, paddingBottom: 25, borderTopWidth: 1, borderColor: colors.NEW },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    totalLabel: { color: colors.GRAY, fontSize: 14 },
    totalPrice: { color: colors.BLACK, fontSize: 18 },
    checkoutBtn: { backgroundColor: colors.MAIN, flexDirection: 'row', height: 50, borderRadius: 8, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
    checkoutBtnText: { color: colors.WHITE, fontSize: 16, fontWeight: 'bold' },
});

export default CartScreen;