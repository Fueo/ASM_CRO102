import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import themes from '../../themes'; // Thay đổi đường dẫn cho đúng

const { colors, typography } = themes;

const Header = ({ title, onBackPress, rightIcon, onRightPress }) => {
    return (
        <View style={styles.headerContainer}>
            {/* Nút Back bên trái */}
            <TouchableOpacity style={styles.iconBtn} onPress={onBackPress}>
                <Feather name="chevron-left" size={24} color={colors.BLACK} />
            </TouchableOpacity>

            {/* Tiêu đề ở giữa */}
            <Text style={[typography.subMedium, styles.title]} numberOfLines={1}>
                {title}
            </Text>

            {/* Icon bên phải (Tùy chọn: Giỏ hàng, Search...) */}
            {rightIcon ? (
                <TouchableOpacity style={styles.iconBtn} onPress={onRightPress}>
                    <Feather name={rightIcon} size={24} color={colors.BLACK} />
                </TouchableOpacity>
            ) : (
                <View style={styles.iconBtn} /> /* Placeholder để ép chữ ra giữa */
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50, // Điều chỉnh theo SafeArea
        paddingBottom: 15,
        backgroundColor: colors.WHITE,
    },
    iconBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center', // Căn giữa icon trong vùng bấm
    },
    title: {
        color: colors.BLACK,
        flex: 1,
        textAlign: 'center',
        fontSize: 18, // Cỡ chữ tiêu đề
    },
});

export default Header;