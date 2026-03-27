import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProductById } from '../redux/productSlice';
import themes from '../themes';
import Header from './home/Header';

const { colors, typography } = themes;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ProductDetail = () => {
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch();

    const { productDetail, detailLoading, detailError } = useSelector((state) => state.product);

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        let isMounted = true;
        if (id) {
            dispatch(fetchProductById(id)).unwrap()
                .catch((err) => console.log("Lỗi fetch sản phẩm:", err));
            if (isMounted) setQuantity(0);
        }
        return () => { isMounted = false; };
    }, [id, dispatch]);

    const formatPrice = (price) => (price || 0).toLocaleString('vi-VN') + 'đ';
    const totalPrice = quantity * (productDetail?.unitPrice || 0);

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => { if (quantity > 0) setQuantity(prev => prev - 1); };

    if (detailLoading) {
        return (
            <View style={styles.loadingCenter}>
                <ActivityIndicator size="large" color={colors.MAIN} />
            </View>
        );
    }

    if (detailError || !productDetail) {
        return (
            <View style={styles.loadingCenter}>
                <Feather name="alert-circle" size={50} color={colors.GRAY} />
                <Text style={styles.errorText}>{detailError || "Không tìm thấy sản phẩm"}</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                    <Text style={{color: colors.MAIN}}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark"  />

            <Header
                title={productDetail?.name || "Chi tiết"}
                onBackPress={() => router.back()}
                rightIcon="shopping-cart"
                onRightPress={() => router.push('/Cart')}
            />

            {/* PHẦN NỘI DUNG CHÍNH - KHÔNG DÙNG SCROLLVIEW */}
            <View style={styles.mainContent}>
                
                {/* 2. Image Slider (Chiếm khoảng 35-40% chiều cao màn hình) */}
                <View style={styles.sliderContainer}>
                    <Image 
                        source={{ uri: productDetail.images?.[activeImageIndex]?.url || 'https://via.placeholder.com/300x300?text=No+Image' }} 
                        style={styles.productImage} 
                        resizeMode="contain"
                    />
                    
                    {/* Nút Arrow điều hướng trái phải */}
                    <View style={styles.arrowContainer}>
                        <TouchableOpacity 
                            onPress={() => activeImageIndex > 0 && setActiveImageIndex(activeImageIndex - 1)}
                            style={[styles.arrowBtn, { opacity: activeImageIndex === 0 ? 0.3 : 1 }]}
                        >
                            <Feather name="chevron-left" size={20} color={colors.BLACK} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => activeImageIndex < (productDetail.images?.length - 1) && setActiveImageIndex(activeImageIndex + 1)}
                            style={[styles.arrowBtn, { opacity: activeImageIndex === (productDetail.images?.length - 1) ? 0.3 : 1 }]}
                        >
                            <Feather name="chevron-right" size={20} color={colors.BLACK} />
                        </TouchableOpacity>
                    </View>

                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {productDetail.images?.map((_, index) => (
                            <View key={index} style={[styles.dot, activeImageIndex === index ? styles.activeDot : null]} />
                        ))}
                    </View>
                </View>

                {/* 3. Product Info (Tự động lấp đầy khoảng trống còn lại) */}
                <View style={styles.infoContainer}>
                    <View style={styles.tagsRow}>
                        {productDetail.categories?.map((cate, index) => (
                            <View key={cate.id || index} style={styles.tagBadge}>
                                <Text style={styles.tagText}>{cate.name}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={[typography.h1Medium, styles.priceText]}>
                        {formatPrice(productDetail?.unitPrice)}
                    </Text>

                    <View style={styles.detailsTable}>
                        <Text style={[typography.subMedium, styles.sectionTitle]}>Chi tiết sản phẩm</Text>
                        <View style={styles.detailDivider} />

                        <View style={styles.detailRow}>
                            <Text style={[typography.bodyRegular, styles.detailLabel]}>Kích cỡ</Text>
                            <Text style={[typography.bodyRegular, styles.detailValue]}>{productDetail?.size || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailDivider} />

                        <View style={styles.detailRow}>
                            <Text style={[typography.bodyRegular, styles.detailLabel]}>Xuất xứ</Text>
                            <Text style={[typography.bodyRegular, styles.detailValue]}>{productDetail?.origin || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailDivider} />

                        <View style={styles.detailRow}>
                            <Text style={[typography.bodyRegular, styles.detailLabel]}>Tình trạng</Text>
                            <Text style={[typography.bodyRegular, styles.stockValue]}>Còn {productDetail?.stockQuantity || 0} sp</Text>
                        </View>
                        <View style={styles.detailDivider} />
                    </View>
                </View>
            </View>

            {/* 4. Bottom Bar (Cố định ở đáy) */}
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
                    style={[styles.buyButton, quantity > 0 ? styles.buyButtonActive : styles.buyButtonInactive]}
                    disabled={quantity === 0}
                    onPress={() => console.log("Add to cart", productDetail.id, quantity)}
                >
                    <Text style={styles.buyButtonText}>CHỌN MUA</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.WHITE },
    mainContent: { flex: 1 }, // Chiếm trọn không gian giữa Header và BottomBar
    loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.WHITE },
    
    // --- Slider Styles (Thu gọn chiều cao) ---
    sliderContainer: { height: screenHeight * 0.35, backgroundColor: colors.NEW, position: 'relative', justifyContent: 'center' },
    productImage: { width: '100%', height: '80%' },
    arrowContainer: { position: 'absolute', width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 },
    arrowBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.WHITE, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    pagination: { position: 'absolute', bottom: 10, width: '100%', flexDirection: 'row', justifyContent: 'center' },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.LIGHT, marginHorizontal: 3 },
    activeDot: { backgroundColor: colors.BLACK, width: 12 },

    // --- Info Styles (Tối ưu khoảng cách) ---
    infoContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 15 },
    tagsRow: { flexDirection: 'row', marginBottom: 8, flexWrap: 'wrap' },
    tagBadge: { backgroundColor: colors.MAIN, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginRight: 8, marginBottom: 4 },
    tagText: { color: colors.WHITE, fontSize: 12 },
    priceText: { color: colors.MAIN, fontSize: 22, marginBottom: 12 },
    detailsTable: { flex: 1 },
    sectionTitle: { color: colors.BLACK, marginBottom: 4 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
    detailLabel: { color: colors.BLACK, fontSize: 14 },
    detailValue: { color: colors.BLACK, fontSize: 14 },
    stockValue: { color: colors.MAIN, fontSize: 14 },
    detailDivider: { height: 1, backgroundColor: '#EEEEEE' },

    // --- Bottom Bar ---
    bottomBar: { 
        paddingHorizontal: 24, paddingTop: 12, 
        paddingBottom: Platform.OS === 'ios' ? 30 : 15, 
        backgroundColor: colors.WHITE, borderTopWidth: 1, borderTopColor: '#F5F5F5' 
    },
    priceCalcRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    calcLabel: { color: colors.GRAY, fontSize: 12, marginBottom: 4 },
    quantityControl: { flexDirection: 'row', alignItems: 'center' },
    qtyBtn: { borderWidth: 1, borderColor: colors.BLACK, borderRadius: 4, width: 26, height: 26, justifyContent: 'center', alignItems: 'center' },
    qtyText: { marginHorizontal: 15, color: colors.BLACK, fontSize: 16 },
    totalPriceText: { color: colors.BLACK, fontSize: 22 },
    buyButton: { height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    buyButtonInactive: { backgroundColor: '#ABABAB' },
    buyButtonActive: { backgroundColor: colors.MAIN },
    buyButtonText: { color: colors.WHITE, fontSize: 16, fontWeight: 'bold' },
});

export default ProductDetail;