import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// LƯU Ý: Import các component bạn vừa tạo và kiểm tra lại đường dẫn
import CartProductCard from '../app_component/cart/CartProductCard';
import ConfirmModal from '../app_component/cart/ConfirmModal';
import Header from '../app_component/home/Header';
import themes from '../themes';

const { colors, typography } = themes;

const DUMMY_CART = [
    {
        id: '1',
        name: 'Spider Plant',
        type: 'Ưa bóng',
        price: 250000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1596547609652-9fc5d8d42850?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Song of India',
        type: 'Ưa sáng',
        price: 250000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1485909645996-33924151433f?q=80&w=200&auto=format&fit=crop'
    }
];

const CartScreen = () => {
    const [cartItems, setCartItems] = useState(DUMMY_CART);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; 
            }
            return item;
        }));
    };

    // Xóa 1 sản phẩm (bấm nút Xóa ở item)
    const removeItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        setSelectedIds(prev => prev.filter(itemId => itemId !== id)); 
    };

    // Xóa TẤT CẢ giỏ hàng
    const clearAllCart = () => {
        setCartItems([]);
        setSelectedIds([]);
        setModalVisible(false);
    };

    // Xóa CHỈ NHỮNG SẢN PHẨM ĐƯỢC CHỌN
    const removeSelectedItems = () => {
        setCartItems(prevItems => prevItems.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]); // Làm trống danh sách đã chọn
        setModalVisible(false);
    };

    const calculateTotal = () => {
        return cartItems
            .filter(item => selectedIds.includes(item.id))
            .reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const totalPrice = calculateTotal();

    // Biến cờ kiểm tra xem có đang chọn sản phẩm nào không
    const hasSelectedItems = selectedIds.length > 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

            <Header
                title="GIỎ HÀNG"
                onBackPress={() => router.back()}
                rightIcon="trash-2"
                onRightPress={() => {
                    // Chỉ bật modal nếu giỏ hàng có đồ
                    if (cartItems.length > 0) setModalVisible(true);
                }}
            />

            {cartItems.length > 0 ? (
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <CartProductCard
                            item={item}
                            isSelected={selectedIds.includes(item.id)}
                            onToggleSelect={() => toggleSelect(item.id)}
                            onIncrease={() => updateQuantity(item.id, 1)}
                            onDecrease={() => updateQuantity(item.id, -1)}
                            onRemove={() => removeItem(item.id)}
                        />
                    )}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
                </View>
            )}

            {hasSelectedItems && (
                <View style={styles.bottomCheckout}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tạm tính</Text>
                        <Text style={[typography.subBold, styles.totalPrice]}>
                            {totalPrice.toLocaleString('vi-VN')}đ
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8}>
                        <Text style={styles.checkoutBtnText}>Tiến hành thanh toán</Text>
                        <Feather name="chevron-right" size={20} color={colors.WHITE} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Gọi ConfirmModal với Title và Hàm Confirm linh hoạt */}
            <ConfirmModal 
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                // Đổi hàm thực thi tùy theo việc có đang tick chọn sp hay không
                onConfirm={hasSelectedItems ? removeSelectedItems : clearAllCart}
                // Đổi câu chữ cho phù hợp với 2 trường hợp
                title={hasSelectedItems ? "Xác nhận xoá sản phẩm đã chọn?" : "Xác nhận xoá tất cả đơn hàng?"}
                description="Thao tác này sẽ không thể khôi phục."
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 100, 
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: colors.GRAY,
        fontSize: 16,
    },
    bottomCheckout: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.WHITE,
        paddingHorizontal: 24,
        paddingTop: 15,
        paddingBottom: 25,
        borderTopWidth: 1,
        borderColor: colors.NEW,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: {
        color: colors.GRAY,
        fontSize: 14,
    },
    totalPrice: {
        color: colors.BLACK,
        fontSize: 18,
    },
    checkoutBtn: {
        backgroundColor: colors.MAIN,
        flexDirection: 'row',
        height: 50,
        borderRadius: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    checkoutBtnText: {
        color: colors.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartScreen;