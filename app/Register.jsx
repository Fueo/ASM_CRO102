import { Redirect, router } from 'expo-router';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet
} from 'react-native';
import { useSelector } from 'react-redux';
import HeaderBanner from '../app_component/auth/HeaderLoginBanner'; // Điều chỉnh lại đường dẫn import nếu cần
import RegisterForm from '../app_component/auth/RegisterForm'; // Điều chỉnh lại đường dẫn import nếu cần
import { COLORS } from '../themes'; // Điều chỉnh lại đường dẫn import nếu cần

const RegisterScreen = ({ navigation }) => {
    // Hàm xử lý khi bấm nút Back trên HeaderBanner
    const handleBack = () => {
        router.canGoBack() && router.back();
    };

      const { isLoggedIn } = useSelector((state) => state.user);

    if (isLoggedIn) {
        return <Redirect href="/tabs/Home" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Hỗ trợ đẩy màn hình lên khi bàn phím ảo xuất hiện */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Phần Banner chứa ảnh lá cây và nút Back */}
                    <HeaderBanner onBackPress={handleBack} heightRatio={0.5} />

                    {/* Phần Form Đăng ký chúng ta vừa tạo */}
                    <RegisterForm />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.NEW, // Nền màu hồng nhạt đồng bộ với form
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        // Đảm bảo nội dung luôn lấp đầy không gian màn hình, 
        // cho phép cuộn mượt mà khi form dài ra
    },
});

export default RegisterScreen;