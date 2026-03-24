import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import themes from '../../themes';
import BottomTab from '../BottomTabs';
import ProductList from '../ProductList'; // Import component danh sách

const { colors, typography } = themes;

// Giữ nguyên DUMMY_DATA của bạn
const DUMMY_DATA = [
    {
        id: '1',
        name: 'Spider Plant',
        type: 'Ưa bóng',
        price: '250.000đ',
        image: 'https://picsum.photos/200'
    },
    {
        id: '2',
        name: 'Song of India',
        type: 'Ưa sáng',
        price: '250.000đ',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLzvDV12o-JVDfBt3-VNV6TL4nw6CuBG-WDA&s'
    },
    {
        id: '3',
        name: 'Hồng Môn',
        type: 'Ưa bóng',
        price: '250.000đ',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLzvDV12o-JVDfBt3-VNV6TL4nw6CuBG-WDA&s'
    },
    {
        id: '4',
        name: 'Trầu Bà',
        type: 'Ưa bóng',
        price: '250.000đ',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLzvDV12o-JVDfBt3-VNV6TL4nw6CuBG-WDA&s'
    },
];

const HomeScreen = () => {
    const [activeTab, setActiveTab] = useState('home');

    // Link ảnh banner thật (hình các chậu cây cảnh trên bàn gỗ)
    const BANNER_IMAGE_URI = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsIZGlfJb4Ld7WO-19wrl-VGOCK69EJHryBw&s';

    return (
        <View style={styles.container}>
            {/* Đổi thành dark-content để dễ nhìn trên nền xám nhạt */}
            <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" translucent />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>

                {/* --- HEADER SECTION --- */}
                <View style={styles.headerWrapper}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerTextWrap}>
                            <Text style={[typography.h1Medium, styles.title]}>Planta - toả sáng</Text>
                            <Text style={[typography.h1Medium, styles.title]}>không gian nhà bạn</Text>

                            <TouchableOpacity activeOpacity={0.7} style={styles.newArrivalBtn}>
                                <Text style={[typography.subMedium, styles.newArrivalText]}>Xem hàng mới về</Text>
                                <Feather name="arrow-right" size={18} color={colors.MAIN} />
                            </TouchableOpacity>
                        </View>

                        {/* Nút Giỏ hàng */}
                        <TouchableOpacity activeOpacity={0.8} style={styles.cartBtn}>
                            <Feather name="shopping-cart" size={20} color={colors.BLACK} />
                        </TouchableOpacity>
                    </View>

                    {/* Vùng chứa ảnh banner thực tế - nằm sát dưới cùng bên phải */}
                    <View style={styles.bannerContainer}>
                        <Image
                            source={{ uri: BANNER_IMAGE_URI }}
                            style={styles.bannerImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* --- PRODUCT SECTION --- */}
                {/* Thêm khoảng đệm paddingTop để danh sách sản phẩm không bị dính vào ảnh banner */}
                <View style={styles.bodyContent}>
                    <ProductList
                        title="Cây trồng"
                        cateID="CAY_TRONG_01"
                        data={DUMMY_DATA}
                        onViewMore={(id) => {
                            console.log('Xem thêm danh mục ID:', id);
                        }}
                    />

                    {/* Danh mục Chậu cây trồng test scroll */}
                    <ProductList
                        title="Chậu cây trồng"
                        cateID="CHAU_CAY_02"
                        data={DUMMY_DATA}
                        onViewMore={(id) => {
                            console.log('Xem thêm danh mục ID:', id);
                        }}
                    />
                </View>

            </ScrollView>

            {/* --- BOTTOM TAB --- */}
            <BottomTab activeTab={activeTab} onTabPress={setActiveTab} />
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
        backgroundColor: '#F9F9F9', // Màu xám rất nhạt
        paddingTop: 65, // Tạo khoảng trống cho Notch/Status bar
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
    // Banner Styles - Nằm sát góc dưới bên phải
    bannerContainer: {
        height: 140, // Tăng chiều cao để ảnh nổi bật
        alignItems: 'flex-end', // Căn ảnh sang bên phải
        justifyContent: 'flex-end', // Căn ảnh xuống dưới cùng
        marginTop: -30, // Kéo ảnh lên một chút để tạo cảm giác cây "mọc" lên
        paddingRight: 10,
    },
    bannerImage: {
        width: '65%', // Chiều rộng ảnh chiếm khoảng 65% màn hình
        height: '100%',
    },
    // Body Styles
    bodyContent: {
        marginTop: 0, // Điều chỉnh nếu cần thêm khoảng cách với Header
        backgroundColor: colors.WHITE,
    },
});

export default HomeScreen;