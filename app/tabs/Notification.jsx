import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../redux/orderSlice';
import themes from '../../themes';

// 1. IMPORT HEADER DÙNG CHUNG (Giống SearchScreen)
import Header from '../../app_component/home/Header'; // Chú ý kiểm tra lại đường dẫn này cho khớp với cấu trúc thư mục của bạn

const { colors, typography } = themes;

const getOrderStatusText = (status) => {
    switch (status) {
        case 'pending': return 'Đang chờ xác nhận';
        case 'confirmed': return 'Đã xác nhận';
        case 'shipping': return 'Đang giao hàng';
        case 'completed': return 'Giao hàng thành công';
        case 'cancelled': return 'Đã hủy';
        default: return 'Đặt hàng thành công';
    }
};

const NotificationScreen = () => {
    const dispatch = useDispatch();

    const orderState = useSelector((state) => state.order || {});
    const isLoading = orderState.isLoading || false;

    let rawOrders = orderState.historyOrders;
    if (rawOrders && !Array.isArray(rawOrders) && rawOrders.data) {
        rawOrders = rawOrders.data;
    }
    if (!Array.isArray(rawOrders)) {
        rawOrders = [];
    }

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(fetchMyOrders()).unwrap();
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
        }
    };

    const groupOrdersByDate = (orders) => {
        if (!orders || orders.length === 0) return [];

        const groups = {};

        orders.forEach(order => {
            const dateObj = new Date(order.createdAt);
            const dateString = dateObj.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            if (!groups[dateString]) {
                groups[dateString] = [];
            }

            const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
            const product = firstItem?.productId || {};
            const totalQuantity = order.items ? order.items.reduce((sum, i) => sum + i.quantity, 0) : 0;

            groups[dateString].push({
                id: order._id,
                status: getOrderStatusText(order.status),
                productName: product.name || `Đơn hàng #${order._id.slice(-5)}`,
                category: product.origin || product.size || 'Cây trồng',
                quantity: totalQuantity,
                image: product.imageURL || 'https://via.placeholder.com/300x300?text=No+Image',
            });
        });

        return Object.keys(groups).map(date => ({
            date,
            data: groups[date]
        }));
    };

    const groupedData = groupOrdersByDate(rawOrders);
    const isEmpty = groupedData.length === 0;

    const renderNotificationItem = ({ item }) => (
        <TouchableOpacity style={styles.notificationCard} activeOpacity={0.7}>
            <View style={styles.imageWrap}>
                <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            <View style={styles.infoWrap}>
                <Text style={[typography.subMedium, styles.statusText]}>
                    {item.status}
                </Text>
                <Text style={[typography.subMedium, styles.productName]} numberOfLines={1}>
                    {item.productName} <Text style={styles.categoryText}>| {item.category}</Text>
                </Text>
                <Text style={[typography.bodyRegular, styles.quantityText]}>
                    {item.quantity} sản phẩm
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderDateSection = ({ item }) => (
        <View style={styles.sectionContainer}>
            <View style={styles.dateHeaderWrap}>
                <Text style={[typography.subMedium, styles.dateText]}>{item.date}</Text>
            </View>
            <FlatList
                data={item.data}
                keyExtractor={(noti) => noti.id}
                renderItem={renderNotificationItem}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                title="THÔNG BÁO"
                onBackPress={() => router.back()}
            />

            {isLoading && !refreshing ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.MAIN} />
                </View>
            ) : isEmpty ? (
                <ScrollView
                    contentContainerStyle={styles.emptyContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.MAIN}
                            colors={[colors.MAIN]}
                        />
                    }
                >
                    <Text style={[typography.bodyRegular, styles.emptyText]}>
                        Hiện chưa có thông báo nào cho bạn
                    </Text>
                </ScrollView>
            ) : (
                <FlatList
                    data={groupedData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderDateSection}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.MAIN}
                            colors={[colors.MAIN]}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.WHITE },

    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 50 },
    emptyText: { color: colors.BLACK },

    listContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
    sectionContainer: { marginBottom: 30 },
    dateHeaderWrap: { borderBottomWidth: 1, borderBottomColor: '#E6E6E6', paddingBottom: 8, marginBottom: 16 },
    dateText: { color: colors.BLACK, textTransform: 'capitalize' },

    notificationCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    imageWrap: { width: 75, height: 75, borderRadius: 8, backgroundColor: colors.NEW, overflow: 'hidden', marginRight: 15 },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    infoWrap: { flex: 1, justifyContent: 'center' },
    statusText: { color: colors.MAIN, marginBottom: 4 },
    productName: { color: colors.BLACK, marginBottom: 4 },
    categoryText: { color: colors.GRAY, fontWeight: 'normal' },
    quantityText: { color: colors.BLACK },
});

export default NotificationScreen;