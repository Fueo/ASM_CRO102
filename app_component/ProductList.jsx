import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import themes from '../themes';
import ProductCard from './ProductCard';

const { colors, typography } = themes;

const ProductList = ({ title, data, cateID, onViewMore }) => {

    // Hàm xử lý khi bấm nút "Xem thêm"
    const handleViewMore = () => {
        if (onViewMore) {
            onViewMore(cateID);
        } else {
            console.log(`Chuyển đến trang danh mục: ${title} - ID: ${cateID}`);
            // Gợi ý: Nếu dùng expo-router, bạn có thể gọi: 
            // router.push(`/category/${cateID}`)
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