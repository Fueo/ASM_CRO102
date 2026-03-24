import { router } from 'expo-router'; // 1. Import router từ expo-router
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import themes from '../themes';
import ProductCard from './ProductCard';

const { colors, typography } = themes;

const ProductList = ({ title, data, cateID, onViewMore }) => {

    // Hàm xử lý khi bấm nút "Xem thêm"
    const handleViewMore = () => {
        if (onViewMore) {
            onViewMore(cateID); // Vẫn giữ lại nếu component cha muốn ghi đè logic
        } else {
            // 2. Thực hiện chuyển trang và truyền params
            router.push({
                pathname: `/category/${cateID}`,
                params: { title: title } // Truyền title sang để màn hình kia hiển thị trên Header
            });
        }
    };

    return (
        <View style={styles.productSection}>
            {/* Hiển thị tiêu đề */}
            {title && (
                <Text style={[typography.h1Medium, styles.sectionTitle]}>{title}</Text>
            )}

            {/* Render danh sách sản phẩm */}
            <View style={styles.productGrid}>
                {data.map((item) => (
                    <ProductCard
                        key={item.id}
                        item={item}
                    // onPress={() => console.log('Click item:', item.name)} 
                    />
                ))}
            </View>

            {/* Nút Xem thêm (Chỉ hiển thị khi có cateID và title) */}
            {cateID && title && (
                <TouchableOpacity style={styles.viewMoreContainer} onPress={handleViewMore}>
                    <Text style={[typography.subMedium, styles.viewMoreText]}>
                        Xem thêm {title}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    productSection: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
        backgroundColor: colors.WHITE,
    },
    sectionTitle: {
        color: colors.BLACK,
        marginBottom: 15,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    viewMoreContainer: {
        alignItems: 'flex-end', // Căn nút sang sát lề phải
        marginTop: 10,
        marginEnd: 10,
    },
    viewMoreText: {
        color: colors.BLACK,
        textDecorationLine: 'underline', // Hiệu ứng gạch chân chữ
    },
});

export default ProductList;