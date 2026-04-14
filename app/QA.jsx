import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
// 1. Import các hàm cần thiết từ react-native-reanimated
import Animated, {
    measure,
    runOnUI,
    useAnimatedRef,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import themes from '../themes';

const { colors, typography } = themes;

// --- DỮ LIỆU GIẢ LẬP Q&A ---
const qaData = [
    {
        id: '1',
        question: 'Tôi trộn các chất dinh dưỡng theo thứ tự nào?',
        answer: 'A, B, C, D,F rồi line E Root Igniter. Nên pha vào xô và cho máy sục oxy vào thì khi pha dd sẽ tan đều.'
    },
    {
        id: '2',
        question: 'Tôi có thể giữ dung dịch dinh dưỡng hỗn hợp trong bao lâu?',
        answer: 'Dinh dưỡng cao cấp nên ko có hạn sử dụng, chỉ cần bảo quản tốt dưới nhiệt độ mát, tránh ánh sáng trực tiếp là sẽ để được rất lâu. Để duy trì mức dinh dưỡng tối ưu, chúng tôi khuyên bạn nên thay đổi hồ chứa thuỷ canh của bạn sau mỗi 7 ngày, còn với thổ canh thì pha lần nào tưới lần đó, thừa thì bỏ lần sau pha mới. Đặc biệt có vi sinh Mycorrhizae có hạn sử dụng sau 2 năm kể từ ngày mua.'
    },
    {
        id: '3',
        question: 'Khi nào tôi thêm bộ điều chỉnh pH?',
        answer: 'Sau khi bạn thêm A-F nhưng trước khi bạn thêm line E Root Igniter vào thì phải cân chỉnh pH trước rồi. PH tối ưu là giữa 5.8-6.3, nấm rễ phát triển tốt hơn khi pH chuẩn, dinh dưỡng đủ. Bạn cần thêm 1 số công cụ bút đo nữa nhé.'
    },
    {
        id: '4',
        question: 'Các chất điều chỉnh tăng trưởng có được sử dụng trong các sản phẩm Planta không?',
        answer: 'Không, các sản phẩm của Planta cam kết sử dụng 100% nguyên liệu tự nhiên và an toàn, không chứa các chất kích thích tăng trưởng hóa học độc hại.'
    },
    {
        id: '5',
        question: 'Các sản phẩm Planta có phải là hữu cơ không?',
        answer: 'Phần lớn các dòng sản phẩm của Planta đều đạt chứng nhận hữu cơ. Tuy nhiên có một số dòng đặc trị sẽ có tỷ lệ khoáng vô cơ ở mức an toàn cho phép.'
    }
];

// --- COMPONENT HEADER ---
const Header = ({ title }) => (
    <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color={colors.BLACK} />
        </TouchableOpacity>
        <Text style={[typography.subMediumUppercase, styles.headerTitle]}>
            {title}
        </Text>
        <View style={{ width: 24 }} />
    </View>
);

// --- COMPONENT ACCORDION ITEM (SỬ DỤNG REANIMATED) ---
const AccordionItem = ({ question, answer }) => {
    const [expanded, setExpanded] = useState(false);

    // Ref để đo chiều cao thực tế của nội dung câu trả lời
    const listRef = useAnimatedRef();

    // SharedValue quản lý chiều cao của phần trả lời
    const heightValue = useSharedValue(0);

    // SharedValue quản lý góc xoay của mũi tên (0 = đóng, 1 = mở)
    const progress = useDerivedValue(() =>
        expanded ? withTiming(1, { duration: 300 }) : withTiming(0, { duration: 300 })
    );

    const toggleExpand = () => {
        if (!expanded) {
            // Nếu đang đóng -> Mở ra: Đo chiều cao thực tế và set animation mở
            runOnUI(() => {
                'worklet';
                const measurement = measure(listRef);
                if (measurement) {
                    heightValue.value = withSpring(measurement.height, {
                        damping: 15,
                        stiffness: 120,
                        mass: 0.5,
                    });
                }
            })();
        } else {
            // Nếu đang mở -> Đóng lại: Set chiều cao về 0
            heightValue.value = withTiming(0, { duration: 300 });
        }
        setExpanded(!expanded);
    };

    // Style animation cho icon mũi tên (xoay từ 0 đến 180 độ)
    const iconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${progress.value * 180}deg` }],
        };
    });

    // Style animation cho chiều cao phần nội dung (clip/ẩn nội dung khi đóng)
    const contentStyle = useAnimatedStyle(() => {
        return {
            height: heightValue.value,
            opacity: progress.value, // Làm mờ chữ khi đang thu gọn
            overflow: 'hidden',
        };
    });

    return (
        <View style={styles.accordionContainer}>
            {/* Header câu hỏi bấm được */}
            <TouchableOpacity
                style={styles.accordionHeader}
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <Text style={[typography.bodyRegular, styles.questionText]}>
                    {question}
                </Text>
                <Animated.View style={iconStyle}>
                    <Feather name="chevron-down" size={20} color={colors.BLACK} />
                </Animated.View>
            </TouchableOpacity>

            {/* Phần Content chứa câu trả lời bị ẩn/hiện */}
            <Animated.View style={contentStyle}>
                {/* Lớp bọc bên trong tuyệt đối vị trí để listRef có thể đo đạc chính xác chiều cao */}
                <View
                    ref={listRef}
                    style={styles.accordionContentWrapper}
                    collapsable={false} // Bắt buộc cho Android để đo được view
                >
                    <Text style={[typography.bodyRegular, styles.answerText]}>
                        {answer}
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
};

// --- MÀN HÌNH CHÍNH ---
const QAScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title="Q & A" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {qaData.map((item) => (
                    <AccordionItem
                        key={item.id}
                        question={item.question}
                        answer={item.answer}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 15,
        backgroundColor: colors.WHITE,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: colors.BLACK,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 40,
    },
    accordionContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    accordionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    questionText: {
        flex: 1,
        color: colors.BLACK,
        marginRight: 16,
        lineHeight: 22,
    },
    accordionContentWrapper: {
        width: '100%',
        paddingBottom: 16,
        paddingRight: 24,
        position: 'absolute', // Bắt buộc để reanimated đo được chiều cao thực khi bị ẩn
        top: 0,
    },
    answerText: {
        color: colors.GRAY,
        lineHeight: 22,
    },
});

export default QAScreen;