import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import themes from '../themes';

const { colors, typography } = themes;

const ProductCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.8}>
            {/* Vùng chứa ảnh hình vuông */}
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                    // Thêm thuộc tính này nếu bạn dùng Android để đảm bảo bo góc hoạt động tốt
                    borderBottomLeftRadius={12}
                    borderBottomRightRadius={12}
                    borderTopLeftRadius={12}
                    borderTopRightRadius={12}
                />
            </View>

            {/* Tên sản phẩm */}
            <Text style={[typography.subMedium, styles.productName]} numberOfLines={1}>
                {item.name}
            </Text>

            {/* Loại cây */}
            {item.type ? (
                <Text style={[typography.bodyRegular, styles.productType]}>
                    {item.type}
                </Text>
            ) : null}

            {/* Giá tiền */}
            <Text style={[typography.subBold, styles.productPrice]}>
                {item.price}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    productCard: {
        width: '47%',
        marginBottom: 20,
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 1, // Ép vuông
        backgroundColor: colors.NEW,
        borderRadius: 12,
        marginBottom: 12,
        // Dùng elevation/shadow ở đây nếu cần, nhưng cẩn thận với overflow: hidden
    },
    productImage: {
        // Dùng absolute fill để bắt buộc ảnh lấp đầy hoàn toàn view cha (imageWrapper)
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Cover thường dễ lên ảnh hơn contain khi dùng absoluteFill
        borderRadius: 12, // Ép bo góc trực tiếp lên Image
    },
    productName: {
        color: colors.BLACK,
        marginBottom: 4,
    },
    productType: {
        color: colors.GRAY,
        marginBottom: 6,
    },
    productPrice: {
        color: colors.MAIN,
    },
});

export default ProductCard;