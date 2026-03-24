import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import themes from '../../themes'; // Điều chỉnh lại đường dẫn themes cho đúng

const { colors, typography } = themes;

const CartProductCard = ({ item, isSelected, onToggleSelect, onIncrease, onDecrease, onRemove }) => {
    return (
        <View style={styles.cardContainer}>
            {/* Checkbox */}
            <TouchableOpacity style={styles.checkboxWrap} onPress={onToggleSelect} activeOpacity={0.8}>
                <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                    {isSelected && <Feather name="check" size={14} color={colors.WHITE} />}
                </View>
            </TouchableOpacity>

            {/* Ảnh sản phẩm */}
            <View style={styles.imageWrap}>
                <Image source={{ uri: item.image }} style={styles.image} />
            </View>

            {/* Thông tin chi tiết */}
            <View style={styles.infoWrap}>
                <Text style={[typography.subMedium, styles.name]} numberOfLines={1}>
                    {item.name} <Text style={styles.type}>| {item.type}</Text>
                </Text>
                <Text style={[typography.subBold, styles.price]}>
                    {item.price.toLocaleString('vi-VN')}đ
                </Text>

                {/* Hàng chứa Nút Tăng giảm & Nút Xóa */}
                <View style={styles.actionRow}>
                    <View style={styles.quantityControl}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
                            <Feather name="minus" size={14} color={colors.BLACK} />
                        </TouchableOpacity>
                        <Text style={[typography.subMedium, styles.qtyText]}>{item.quantity}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
                            <Feather name="plus" size={14} color={colors.BLACK} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={onRemove}>
                        <Text style={[typography.bodyRegular, styles.removeText]}>Xoá</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    checkboxWrap: {
        marginRight: 15,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: colors.GRAY,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: colors.BLACK,
        borderColor: colors.BLACK,
    },
    imageWrap: {
        width: 75,
        height: 75,
        borderRadius: 8,
        backgroundColor: colors.NEW,
        overflow: 'hidden',
        marginRight: 15,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoWrap: {
        flex: 1,
        justifyContent: 'space-between',
    },
    name: {
        color: colors.BLACK,
        marginBottom: 2,
    },
    type: {
        color: colors.GRAY,
        fontWeight: 'normal',
    },
    price: {
        color: colors.MAIN, 
        marginBottom: 10,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyBtn: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: colors.BLACK,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        marginHorizontal: 12,
        color: colors.BLACK,
    },
    removeText: {
        color: colors.BLACK,
        textDecorationLine: 'underline',
    },
});

export default CartProductCard;