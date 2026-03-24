import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import themes from '../../themes'; // Đường dẫn đến theme
import Header from '../home/Header'; // Đường dẫn đến Header

const { colors, typography } = themes;
const { width: screenWidth } = Dimensions.get('window'); // Lấy chiều rộng màn hình cho Slider

// Dữ liệu giả lập của sản phẩm
const PRODUCT_DATA = {
    id: '1',
    name: 'Spider Plant',
    price: 250000,
    images: [
        'https://images.unsplash.com/photo-1596547609652-9fc5d8d42850?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1485909645996-33924151433f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=800&auto=format&fit=crop',
    ],
    tags: ['Cây trồng', 'Ưa bóng'],
    size: 'Nhỏ',
    origin: 'Châu Phi',
    stock: 156,
};

const ProductDetail = () => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(0);

    // Tính tổng tiền
    const totalPrice = quantity * PRODUCT_DATA.price;

    // Format tiền tệ VNĐ
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + 'đ';
    };

    // Hàm bắt sự kiện cuộn Slider để đổi dấu chấm (Pagination)
    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / screenWidth);
        setActiveImageIndex(index);
    };

    // Tăng / Giảm số lượng
    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => {
        if (quantity > 0) setQuantity(prev => prev - 1);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

            {/* 1. Header Tái sử dụng */}
            <Header
                title={PRODUCT_DATA.name}
                onBackPress={() => router.back()}
                rightIcon="shopping-cart"
                onRightPress={() => console.log('Mở giỏ hàng')}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScroll}>
                
                {/* 2. Image Slider */}
                <View style={styles.sliderContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {PRODUCT_DATA.images.map((img, index) => (
                            <View key={index} style={styles.slide}>
                                <Image source={{ uri: img }} style={styles.productImage} />
                            </View>
                        ))}
                    </ScrollView>

                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {PRODUCT_DATA.images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    activeImageIndex === index ? styles.activeDot : null
                                ]}
                            />
                        ))}
                    </View>
                    
                    {/* (Tùy chọn) Nút Arrow trái phải đè lên ảnh giống thiết kế */}
                    <View style={styles.arrowContainer} pointerEvents="none">
                        <View style={styles.arrowBtn}><Feather name="chevron-left" size={20} color={colors.BLACK} /></View>
                        <View style={styles.arrowBtn}><Feather name="chevron-right" size={20} color={colors.BLACK} /></View>
                    </View>
                </View>

                {/* 3. Product Info */}
                <View style={styles.infoContainer}>
                    {/* Tags */}
                    <View style={styles.tagsRow}>
                        {PRODUCT_DATA.tags.map((tag, index) => (
                            <View key={index} style={styles.tagBadge}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Price */}
                    <Text style={[typography.h1Medium, styles.priceText]}>
                        {formatPrice(PRODUCT_DATA.price)}
                    </Text>

                    {/* Details List */}
                    <Text style={[typography.subMedium, styles.sectionTitle]}>Chi tiết sản phẩm</Text>
                    <View style={styles.detailDivider} />

                    <View style={styles.detailRow}>
                        <Text style={[typography.bodyRegular, styles.detailLabel]}>Kích cỡ</Text>
                        <Text style={[typography.bodyRegular, styles.detailValue]}>{PRODUCT_DATA.size}</Text>
                    </View>
                    <View style={styles.detailDivider} />

                    <View style={styles.detailRow}>
                        <Text style={[typography.bodyRegular, styles.detailLabel]}>Xuất xứ</Text>
                        <Text style={[typography.bodyRegular, styles.detailValue]}>{PRODUCT_DATA.origin}</Text>
                    </View>
                    <View style={styles.detailDivider} />

                    <View style={styles.detailRow}>
                        <Text style={[typography.bodyRegular, styles.detailLabel]}>Tình trạng</Text>
                        <Text style={[typography.bodyRegular, styles.stockValue]}>Còn {PRODUCT_DATA.stock} sp</Text>
                    </View>
                    <View style={styles.detailDivider} />
                </View>
            </ScrollView>

            {/* 4. Bottom Checkout Section */}
            <View style={styles.bottomBar}>
                <View style={styles.priceCalcRow}>
                    <View>
                        <Text style={styles.calcLabel}>Đã chọn {quantity} sản phẩm</Text>
                        <View style={styles.quantityControl}>
                            <TouchableOpacity onPress={decreaseQuantity} style={styles.qtyBtn}>
                                <Feather name="minus" size={16} color={colors.BLACK} />
                            </TouchableOpacity>
                            <Text style={[typography.subMedium, styles.qtyText]}>{quantity}</Text>
                            <TouchableOpacity onPress={increaseQuantity} style={styles.qtyBtn}>
                                <Feather name="plus" size={16} color={colors.BLACK} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.calcLabel}>Tạm tính</Text>
                        <Text style={[typography.h1Medium, styles.totalPriceText]}>
                            {formatPrice(totalPrice)}
                        </Text>
                    </View>
                </View>

                {/* Nút CHỌN MUA đổi màu khi số lượng > 0 */}
                <TouchableOpacity 
                    style={[
                        styles.buyButton, 
                        quantity > 0 ? styles.buyButtonActive : styles.buyButtonInactive
                    ]}
                    disabled={quantity === 0}
                >
                    <Text style={styles.buyButtonText}>CHỌN MUA</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    contentScroll: {
        flex: 1,
    },
    // --- Slider Styles ---
    sliderContainer: {
        height: 300,
        backgroundColor: colors.NEW,
        position: 'relative',
    },
    slide: {
        width: screenWidth,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    pagination: {
        position: 'absolute',
        bottom: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.LIGHT,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: colors.BLACK,
    },
    arrowContainer: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    arrowBtn: {
        width: 32, height: 32,
        borderRadius: 16,
        backgroundColor: colors.WHITE,
        justifyContent: 'center', alignItems: 'center',
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3,
    },

    // --- Info Styles ---
    infoContainer: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    tagsRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    tagBadge: {
        backgroundColor: colors.MAIN,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginRight: 10,
    },
    tagText: {
        color: colors.WHITE,
        fontSize: 14,
    },
    priceText: {
        color: colors.MAIN,
        fontSize: 24,
        marginBottom: 25,
    },
    sectionTitle: {
        color: colors.BLACK,
        marginBottom: 5,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    detailLabel: {
        color: colors.BLACK,
    },
    detailValue: {
        color: colors.BLACK,
    },
    stockValue: {
        color: colors.MAIN, // Màu xanh lá cho "Còn ... sp"
    },
    detailDivider: {
        height: 1,
        backgroundColor: colors.NEW, // Đường kẻ mờ
    },

    // --- Bottom Checkout Styles ---
    bottomBar: {
        paddingHorizontal: 24,
        paddingTop: 15,
        paddingBottom: 25, // Tránh dính đáy màn hình (tai thỏ/home indicator)
        backgroundColor: colors.WHITE,
    },
    priceCalcRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    calcLabel: {
        color: colors.GRAY,
        fontSize: 14,
        marginBottom: 5,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyBtn: {
        borderWidth: 1,
        borderColor: colors.BLACK,
        borderRadius: 4,
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        marginHorizontal: 15,
        color: colors.BLACK,
    },
    totalPriceText: {
        color: colors.BLACK,
        fontSize: 24,
    },
    buyButton: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyButtonInactive: {
        backgroundColor: colors.LIGHT, // Nền xám khi số lượng = 0
    },
    buyButtonActive: {
        backgroundColor: colors.MAIN, // Nền xanh khi số lượng > 0
    },
    buyButtonText: {
        color: colors.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetail;