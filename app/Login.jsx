import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import HeaderBanner from '../app_component/auth/HeaderLoginBanner';
import LoginForm from '../app_component/auth/LoginForm';
import { COLORS } from '../themes';

const LoginScreen = () => {
    const handleBack = () => {
        router.canGoBack() && router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    <HeaderBanner onBackPress={handleBack} />
                    <LoginForm />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.NEW, // Nền hồng nhạt
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1, // Đảm bảo scrollable view chiếm hết chiều cao
    },
});

export default LoginScreen;