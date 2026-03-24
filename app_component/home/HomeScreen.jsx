import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router'; // 1. Import router
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import themes from '../../themes';
import ProductList from '../ProductList';

const { colors, typography } = themes;

// 1. Data cho Cây trồng
const DUMMY_DATA = [
    { id: '1', name: 'Spider Plant', type: 'Ưa bóng', price: '250.000đ', image: 'https://picsum.photos/200' },
    { id: '2', name: 'Song of India', type: 'Ưa sáng', price: '250.000đ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLzvDV12o-JVDfBt3-VNV6TL4nw6CuBG-WDA&s' },
    { id: '3', name: 'Hồng Môn', type: 'Ưa bóng', price: '250.000đ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLzvDV12o-JVDfBt3-VNV6TL4nw6CuBG-WDA&s' },
    { id: '4', name: 'Trầu Bà', type: 'Ưa bóng', price: '250.000đ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLzvDV12o-JVDfBt3-VNV6TL4nw6CuBG-WDA&s' },
];

// 2. Data cho Phụ kiện
const DUMMY_ACCESSORIES = [
    { id: '1', name: 'Bình tưới CB2 SAIC', price: '250.000đ', image: 'https://images.unsplash.com/photo-1598045618585-618413b8cb46?q=80&w=600&auto=format&fit=crop' },
    { id: '2', name: 'Bình xịt Xiaoda', price: '250.000đ', image: 'https://images.unsplash.com/photo-1622323758558-8c084fcdb442?q=80&w=600&auto=format&fit=crop' },
    { id: '3', name: 'Bộ cuốc xẻng mini', price: '250.000đ', image: 'https://images.unsplash.com/photo-1416879598555-520ef69d08e5?q=80&w=600&auto=format&fit=crop' },
    { id: '4', name: 'Giá đỡ Finn Terrazzo', price: '250.000đ', image: 'https://images.unsplash.com/photo-1616440347285-d6c5bbadbfb2?q=80&w=600&auto=format&fit=crop' },
];

// 3. Component ComboCard
const ComboCard = ({ title, description, image, onPress }) => {
    return (
        <TouchableOpacity style={styles.comboCardContainer} activeOpacity={0.8} onPress={onPress}>
            <View style={styles.comboTextWrap}>
                <Text style={[typography.subBold, styles.comboTitle]} numberOfLines={1}>{title}</Text>
                <Text style={[typography.bodyRegular, styles.comboDesc]} numberOfLines={4}>
                    {description}
                </Text>
            </View>
            <Image source={{ uri: image }} style={styles.comboImage} />
        </TouchableOpacity>
    );
};

const HomeScreen = () => {
    const BANNER_IMAGE_URI = 'https://www.shutterstock.com/image-photo/interior-living-room-monstera-plants-600w-2736506557.jpg';
    
    // Link ảnh demo cho Combo
    const COMBO_IMAGE_URI = 'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?q=80&w=600&auto=format&fit=crop';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" translucent />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>

                {/* --- HEADER SECTION --- */}
                <View style={styles.headerWrapper}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerTextWrap}>
                            <Text style={[typography.h1Medium, styles.title]}>Planta - toả sáng</Text>
                            <Text style={[typography.h1Medium, styles.title]}>không gian nhà bạn</Text>

                            {/* 2. Cập nhật onPress cho nút Xem hàng mới về */}
                            <TouchableOpacity 
                                activeOpacity={0.7} 
                                style={styles.newArrivalBtn}
                                onPress={() => router.push({
                                    pathname: '/category/hang-moi-ve',
                                    params: { title: 'HÀNG MỚI VỀ' } // Truyền title sang màn hình list
                                })}
                            >
                                <Text style={[typography.subMedium, styles.newArrivalText]}>Xem hàng mới về</Text>
                                <Feather name="arrow-right" size={18} color={colors.MAIN} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity activeOpacity={0.8} style={styles.cartBtn} onPress={() => {
                            router.push('/Cart')
                        }}> 
                            <Feather name="shopping-cart" size={20} color={colors.BLACK} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bannerContainer}>
                        <Image
                            source={{ uri: BANNER_IMAGE_URI }}
                            style={styles.bannerImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* --- BODY CONTENT --- */}
                <View style={styles.bodyContent}>
                    
                    {/* 1. Danh sách Cây trồng */}
                    <ProductList
                        title="Cây trồng"
                        cateID="CAY_TRONG"
                        data={DUMMY_DATA}
                    />

                    {/* 2. Danh sách Phụ kiện */}
                    <ProductList
                        title="Phụ kiện"
                        cateID="PHU_KIEN"
                        data={DUMMY_ACCESSORIES}
                    />

                    {/* 3. Combo chăm sóc (mới) */}
                    <View style={styles.comboSection}>
                        <Text style={[typography.h1Medium, styles.sectionTitle]}>Combo chăm sóc (mới)</Text>
                        <ComboCard
                            title="Lemon Balm Grow Kit"
                            description="Gồm: hạt giống Lemon Balm, gói đất hữu cơ, chậu Planta, marker đánh dấu..."
                            image={COMBO_IMAGE_URI}
                            onPress={() => console.log('Bấm vào Combo')}
                        />
                    </View>

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    scrollContent: {
        flex: 1,
    },
    // Header Styles
    headerWrapper: {
        backgroundColor: '#F9F9F9', 
        paddingTop: 65, 
        paddingBottom: 20,
        zIndex: 1,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        zIndex: 10,
    },
    headerTextWrap: {
        flex: 1,
    },
    title: {
        color: colors.BLACK,
        marginBottom: 4,
    },
    newArrivalBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        gap: 5,
    },
    newArrivalText: {
        color: colors.MAIN,
    },
    cartBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginLeft: 15,
    },
    bannerContainer: {
        height: 140, 
        alignItems: 'flex-end', 
        justifyContent: 'flex-end', 
        marginTop: -30, 
        paddingRight: 10,
    },
    bannerImage: {
        width: '65%', 
        height: '100%',
    },
    
    // Body Styles
    bodyContent: {
        backgroundColor: colors.WHITE,
        paddingBottom: 20, 
    },

    // Combo Section Styles
    comboSection: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        backgroundColor: colors.WHITE,
    },
    sectionTitle: {
        color: colors.BLACK,
        marginBottom: 15,
    },
    
    // Combo Card Component Styles
    comboCardContainer: {
        flexDirection: 'row',
        backgroundColor: colors.NEW, 
        borderRadius: 12,
        overflow: 'hidden',
        height: 140, 
    },
    comboTextWrap: {
        flex: 1,
        padding: 16,
        justifyContent: 'center', 
    },
    comboTitle: {
        color: colors.BLACK,
        marginBottom: 6,
    },
    comboDesc: {
        color: colors.GRAY,
        lineHeight: 20,
        fontSize: 14,
    },
    comboImage: {
        width: "35%", 
        height: '100%',
        resizeMode: 'cover',
    },
});

export default HomeScreen;