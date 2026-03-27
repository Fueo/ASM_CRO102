import { router } from 'expo-router'; // Import router
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import themes from '../../themes'; // Sửa lại đường dẫn themes cho đúng (tùy cấu trúc của bạn)

const { colors, typography } = themes;

const SearchProductCard = ({ item, onPress }) => {
    
    // Xử lý sự kiện nhấn: Dùng onPress truyền vào, nếu không thì tự điều hướng
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            // Điều hướng sang file [id].tsx và truyền id của sản phẩm
            router.push(`/product/${item.id}`); 
            // Lưu ý: Đường dẫn '/product' có thể thay đổi tùy vào việc bạn đặt file [id].tsx ở thư mục nào
        }
    };

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={handlePress} activeOpacity={0.8}>
            {/* Ảnh sản phẩm bên trái */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            
            {/* Thông tin sản phẩm bên phải */}
            <View style={styles.infoContainer}>
                <Text style={[typography.subMedium, styles.name]} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={[typography.subMedium, styles.price]}>
                    {item.price}
                </Text>
                <Text style={[typography.bodyRegular, styles.stock]}>
                    Còn {item.stock} sp
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        width: 80, 
        height: 80,
        borderRadius: 8,
        backgroundColor: colors.NEW,
        overflow: 'hidden',
        padding: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    name: {
        color: colors.BLACK,
        marginBottom: 4,
    },
    price: {
        color: colors.BLACK, 
        marginBottom: 2,
    },
    stock: {
        color: colors.BLACK,
    },
});

export default SearchProductCard;