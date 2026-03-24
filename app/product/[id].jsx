import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../app_component/home/Header';
import themes from '../../themes';

const { colors, typography } = themes;
const { width: screenWidth } = Dimensions.get('window');

const PRODUCT_DATA = {
    id: '1',
    name: 'Spider Plant',
    price: 250000,
    images: [
        'https://www.bhg.com/thmb/oDnjlrHprd67aYvinrMfQgVUPtQ=/5332x0/filters:no_upscale():strip_icc()/BHG-spider-plant-c0e0fdd5ec6e4c1588998ce3167f6579.jpg',
        'https://i0.wp.com/www.gardening4joy.com/wp-content/uploads/2021/01/Caring-for-spider-plants-Main.jpg?resize=1080%2C904&ssl=1p',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ6dXUI9Zn9b9ajZL3kWIahATya4GZHSeKOA&s',
    ],
    tags: ['Cây trồng', 'Ưa bóng'],
    size: 'Nhỏ',
    origin: 'Châu Phi',
    stock: 156,
};

const ProductDetailScreen = () => {
    const { id } = useLocalSearchParams(); 

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(0);
    
    const scrollViewRef = useRef(null);

    const totalPrice = quantity * PRODUCT_DATA.price;

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + 'đ';
    };

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / screenWidth);
        setActiveImageIndex(index);
    };

    const handlePrevImage = () => {
        if (activeImageIndex > 0) {
            const newIndex = activeImageIndex - 1;
            scrollViewRef.current?.scrollTo({ x: newIndex * screenWidth, animated: true });
        }
    };

    const handleNextImage = () => {
        if (activeImageIndex < PRODUCT_DATA.images.length - 1) {
            const newIndex = activeImageIndex + 1;
            scrollViewRef.current?.scrollTo({ x: newIndex * screenWidth, animated: true });
        }
    };

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => {
        if (quantity > 0) setQuantity(prev => prev - 1);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

            <Header
                title={PRODUCT_DATA.name}
                onBackPress={() => router.back()}
                rightIcon="shopping-cart"
                onRightPress={() => console.log('Mở giỏ hàng')}
            />

            {/* Vẫn giữ ScrollView để phòng hờ các máy có màn hình quá nhỏ (iPhone SE), 
                nhưng với máy thường sẽ không cần cuộn */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScroll} bounces={false}>
                
                <View style={styles.sliderContainer}>
                    <ScrollView
                        ref={scrollViewRef}
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
                    
                    <View style={styles.arrowContainer} pointerEvents="box-none">
                        {activeImageIndex > 0 ? (
                            <TouchableOpacity style={styles.arrowBtn} onPress={handlePrevImage} activeOpacity={0.8}>
                                <Feather name="chevron-left" size={20} color={colors.BLACK} />
                            </TouchableOpacity>
                        ) : <View />}

                        {activeImageIndex < PRODUCT_DATA.images.length - 1 ? (
                            <TouchableOpacity style={styles.arrowBtn} onPress={handleNextImage} activeOpacity={0.8}>
                                <Feather name="chevron-right" size={20} color={colors.BLACK} />
                            </TouchableOpacity>
                        ) : <View />}
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.tagsRow}>
                        {PRODUCT_DATA.tags.map((tag, index) => (
                            <View key={index} style={styles.tagBadge}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={[typography.h1Medium, styles.priceText]}>
                        {formatPrice(PRODUCT_DATA.price)}
                    </Text>

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

                <TouchableOpacity 
                    style={[
                        styles.buyButton, 
                        quantity > 0 ? styles.buyButtonActive : styles.buyButtonInactive
                    ]}
                    disabled={quantity === 0}
                    onPress={() => console.log('Thêm vào giỏ hàng:', { id, quantity, totalPrice })}
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
    sliderContainer: {
        height: 250, // Đã giảm từ 300 -> 250
        backgroundColor: colors.NEW,
        position: 'relative',
    },
    slide: {
        width: screenWidth,
        height: 250, // Đã giảm từ 300 -> 250
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
    infoContainer: {
        paddingHorizontal: 24,
        paddingTop: 15, // Đã giảm padding top
    },
    tagsRow: {
        flexDirection: 'row',
        marginBottom: 10, // Đã giảm từ 15 -> 10
    },
    tagBadge: {
        backgroundColor: colors.MAIN,
        paddingHorizontal: 12,
        paddingVertical: 4, // Đã giảm nhẹ độ bự của tag
        borderRadius: 4,
        marginRight: 10,
    },
    tagText: {
        color: colors.WHITE,
        fontSize: 13, // Đã giảm nhẹ cỡ chữ tag
    },
    priceText: {
        color: colors.MAIN,
        fontSize: 24,
        marginBottom: 25, // Đã giảm từ 25 -> 15
    },
    sectionTitle: {
        color: colors.BLACK,
        marginBottom: 5,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12, // Đã giảm từ 12 -> 10
    },
    detailLabel: {
        color: colors.BLACK,
    },
    detailValue: {
        color: colors.BLACK,
    },
    stockValue: {
        color: colors.MAIN,
    },
    detailDivider: {
        height: 1,
        backgroundColor: colors.NEW,
    },
    bottomBar: {
        paddingHorizontal: 24,
        paddingTop: 15, // Đã giảm từ 15 -> 10
        paddingBottom: 20, // Đã giảm từ 25 -> 20
        backgroundColor: colors.WHITE,
        borderTopWidth: 1, // Thêm viền mờ ở trên để phân biệt rõ với nội dung khi không scroll
        borderColor: colors.NEW,
    },
    priceCalcRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15, // Đã giảm từ 15 -> 10
    },
    calcLabel: {
        color: colors.GRAY,
        fontSize: 14, // Đã giảm từ 14 -> 13
        marginBottom: 6,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyBtn: {
        borderWidth: 1,
        borderColor: colors.BLACK,
        borderRadius: 4,
        width: 26, // Đã giảm từ 28 -> 26
        height: 26, // Đã giảm từ 28 -> 26
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
        height: 50, // Đã giảm từ 50 -> 48
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyButtonInactive: {
        backgroundColor: colors.LIGHT, 
    },
    buyButtonActive: {
        backgroundColor: colors.MAIN, 
    },
    buyButtonText: {
        color: colors.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetailScreen;