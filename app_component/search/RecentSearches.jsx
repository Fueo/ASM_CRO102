import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import themes from '../../themes';

const { colors, typography } = themes;

const RecentSearches = ({ data, onRemove, onItemPress }) => {
    // Nếu không có dữ liệu thì không render gì cả
    if (!data || data.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={[typography.subMedium, styles.sectionTitle]}>
                Tìm kiếm gần đây
            </Text>

            {data.map((item, index) => (
                <View key={index.toString()} style={styles.itemContainer}>
                    <TouchableOpacity 
                        style={styles.itemContent} 
                        onPress={() => onItemPress && onItemPress(item)}
                    >
                        <Feather name="clock" size={20} color={colors.LIGHT} />
                        <Text style={[typography.subRegular, styles.itemText]}>
                            {item}
                        </Text>
                    </TouchableOpacity>

                    {/* Nút Xóa (X) */}
                    <TouchableOpacity 
                        style={styles.removeBtn} 
                        onPress={() => onRemove && onRemove(item)}
                    >
                        <Feather name="x" size={20} color={colors.BLACK} />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        color: colors.BLACK,
        marginBottom: 15,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemText: {
        color: colors.BLACK,
        marginLeft: 12, // Khoảng cách giữa icon đồng hồ và chữ
    },
    removeBtn: {
        padding: 5,
    },
});

export default RecentSearches;