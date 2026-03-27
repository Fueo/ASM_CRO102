import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchHomeData } from '../../redux/productSlice';
import themes from '../../themes';
import ProductList from '../ProductList';

const { colors, typography } = themes;

const ComboCard = ({ title, description, image, onPress }) => {
    return (
        <TouchableOpacity style={styles.comboCardContainer} activeOpacity={0.8} onPress={onPress}>
            <View style={styles.comboTextWrap}>
                <Text style={[typography.subBold, styles.comboTitle]} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={[typography.bodyRegular, styles.comboDesc]} numberOfLines={4}>
                    {description}
                </Text>
            </View>
            <Image source={{ uri: image }} style={styles.comboImage} />
        </TouchableOpacity>
    );
};

const mapProductsForUI = (products = [], categoryName = '') =>
    products.map((item) => {
        let typeDisplay = '';

        if (categoryName === 'Hàng mới về') {
            typeDisplay = item.subCategoryName || ''; 
        } 
        else {
            if (item.subCategoryName) {
                typeDisplay = item.subCategoryName;
            } 
            else {
                typeDisplay = null; 
            }
        }

        return {
            id: item.id,
            name: item.name,
            type: typeDisplay,
            price: `${Number(item.unitPrice || 0).toLocaleString('vi-VN')}đ`,
            image: item.imageURL || 'https://via.placeholder.com/300x300?text=No+Image',
        };
    });

const HomeScreen = () => {
    const dispatch = useDispatch();

    const BANNER_IMAGE_URI_FALLBACK =
        'https://www.shutterstock.com/image-photo/interior-living-room-monstera-plants-600w-2736506557.jpg';

    const { homeData, homeLoading, homeError } = useSelector((state) => state.product);
    
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchHomeData());
    }, [dispatch]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchHomeData()); 
        setRefreshing(false);
    }, [dispatch]);

    const featuredCategories = homeData?.featuredCategories || [];
    const normalCategories = homeData?.categories || [];

    const newArrivalCategory = useMemo(
        () =>
            featuredCategories.find(
                (item) => item?.name?.trim().toLowerCase() === 'hàng mới về'
            ) || null,
        [featuredCategories]
    );

    const comboCategory = useMemo(
        () =>
            featuredCategories.find(
                (item) => item?.name?.trim().toLowerCase() === 'combo chăm sóc'
            ) || null,
        [featuredCategories]
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" translucent />

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        colors={[colors.MAIN]} 
                        tintColor={colors.MAIN} 
                    />
                }
            >
                <View style={styles.headerWrapper}>
                    {/* Đưa ảnh nền lên làm con đầu tiên của headerWrapper (Nằm dưới các layer chữ) */}
                    <Image
                        source={{ uri: newArrivalCategory?.image || BANNER_IMAGE_URI_FALLBACK }}
                        style={styles.bannerImage}
                        resizeMode="cover" // Cover để bung full 100% không bị vỡ/méo hình
                    />

                    <View style={styles.headerTop}>
                        <View style={styles.headerTextWrap}>
                            <Text style={[typography.h1Medium, styles.title]}>Planta - toả sáng</Text>
                            <Text style={[typography.h1Medium, styles.title]}>không gian nhà bạn</Text>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.newArrivalBtn}
                                onPress={() => {
                                    if (!newArrivalCategory?.id) return;

                                    router.push({
                                        pathname: '/category/hang-moi-ve',
                                        params: {
                                            title: 'HÀNG MỚI VỀ',
                                            categoryId: newArrivalCategory.id,
                                        },
                                    });
                                }}
                            >
                                <Text style={[typography.subMedium, styles.newArrivalText]}>
                                    Xem hàng mới về
                                </Text>
                                <Feather name="arrow-right" size={18} color={colors.MAIN} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.cartBtn}
                            onPress={() => {
                                router.push('/Cart');
                            }}
                        >
                            <Feather name="shopping-cart" size={20} color={colors.BLACK} />
                        </TouchableOpacity>
                    </View>

                    {/* VẪN GIỮ NGUYÊN View này ở dạng rỗng để BẢO TOÀN thiết kế Layout cũ */}
                    <View style={styles.bannerContainer}></View>
                </View>

                <View style={styles.bodyContent}>
                    {homeLoading && !refreshing ? (
                        <ActivityIndicator size="large" color={colors.MAIN} style={{ marginTop: 20 }} />
                    ) : homeError ? (
                        <Text style={styles.errorText}>{homeError}</Text>
                    ) : (
                        <>
                            {newArrivalCategory && (
                                <ProductList
                                    title={newArrivalCategory.name}
                                    cateID={newArrivalCategory.id}
                                    data={mapProductsForUI(newArrivalCategory.products, newArrivalCategory.name)}
                                />
                            )}

                            {normalCategories.map((category) => (
                                <ProductList
                                    key={category.id}
                                    title={category.name}
                                    cateID={category.id}
                                    data={mapProductsForUI(category.products, category.name)}
                                />
                            ))}

                            {comboCategory && (
                                <View style={styles.comboSection}>
                                    <Text style={[typography.h1Medium, styles.sectionTitle]}>
                                        {comboCategory.name}
                                    </Text>
                                    
                                    <ComboCard
                                        title={comboCategory.name} 
                                        description={`Gồm: ${comboCategory.products?.map(p => p.name).join(', ')}...`} 
                                        image={comboCategory.image || 'https://via.placeholder.com/300x300?text=No+Image'} 
                                        onPress={() => {
                                            router.push({
                                                pathname: `/category/${comboCategory.id}`,
                                                params: { title: comboCategory.name }
                                            });
                                        }}
                                    />
                                </View>
                            )}
                        </>
                    )}
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
    headerWrapper: {
        backgroundColor: '#F9F9F9',
        paddingTop: 65,
        paddingBottom: 20,
        zIndex: 1,
        overflow: 'hidden', // Thêm cái này để ảnh không tràn ra khỏi Header
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
        shadowColor: '#000',
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
        // Style mới cho hình nền để bung full đằng sau chữ
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        opacity: 1, // Mờ nhẹ đi 1 xíu để chữ Đen bên trên không bị chìm vào nền
    },
    bodyContent: {
        backgroundColor: colors.WHITE,
        paddingBottom: 20,
    },
    comboSection: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        backgroundColor: colors.WHITE,
        gap: 12,
    },
    sectionTitle: {
        color: colors.BLACK,
        marginBottom: 15,
    },
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
        width: '35%',
        height: '100%',
        resizeMode: 'cover',
    },
    errorText: {
        paddingHorizontal: 24,
        marginTop: 20,
        color: 'red',
    },
});

export default HomeScreen;