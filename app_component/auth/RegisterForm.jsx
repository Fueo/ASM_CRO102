import { router } from 'expo-router'; // Import router để điều hướng
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, typography } from '../../themes';
import LoginButton from './LoginButton'; // 1. Import LoginButton
import LoginInput from './LoginInput';

const RegisterForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // Hàm xử lý đăng ký
    const handleRegister = () => {
        console.log("Đăng ký:", { fullName, email, phone, password });
        // Thêm logic gọi API đăng ký tại đây
    };

    // Hàm quay lại trang Đăng nhập
    const handleNavigateToLogin = () => {
        router.back(); // Hoặc dùng router.push('/Login') tùy vào cấu trúc thư mục của bạn
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.title}>Đăng ký</Text>
            <Text style={styles.subtitle}>Tạo tài khoản</Text>

            <LoginInput
                placeholder="Họ tên"
                value={fullName}
                onChangeText={setFullName}
            />
            <LoginInput
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <LoginInput
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <LoginInput
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                isPassword={true}
            />

            <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                    Để đăng ký tài khoản, bạn đồng ý{' '}
                    <Text style={styles.termsLink}>Terms & Conditions</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
            </View>

            {/* 2. Sử dụng Component LoginButton */}
            <View style={styles.buttonWrapper}>
                <LoginButton
                    title="Đăng ký"
                    onPress={handleRegister}
                />
            </View>

            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Hoặc</Text>
                <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <Image source={require('../../assets/images/icon_google.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image source={require('../../assets/images/icon_facebook.png')} style={styles.socialIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
                <Text style={styles.textSmall}>Tôi đã có tài khoản</Text>
                {/* 3. Thêm sự kiện onPress để chuyển trang */}
                <TouchableOpacity onPress={handleNavigateToLogin}>
                    <Text style={[typography.link, styles.footerLink]}> Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
        backgroundColor: COLORS.NEW,
        marginTop: -30,
    },
    title: {
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        color: COLORS.BLACK,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        color: COLORS.BLACK,
    },
    termsContainer: {
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    termsText: {
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: COLORS.BLACK,
        lineHeight: 18,
    },
    termsLink: {
        color: COLORS.MAIN,
        fontFamily: 'Poppins-Bold',
        textDecorationLine: 'underline',
    },
    // View bọc ngoài nút Đăng ký để giữ khoảng cách (thay cho loginButtonContainer cũ)
    buttonWrapper: {
        marginBottom: 30,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.MAIN,
    },
    dividerText: {
        paddingHorizontal: 15,
        color: COLORS.BLACK,
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    socialButton: {
        marginHorizontal: 15,
    },
    socialIcon: {
        width: 44,
        height: 44,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textSmall: {
        color: COLORS.BLACK,
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },
    footerLink: {
        marginLeft: 2,
        color: COLORS.MAIN,
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },
});

export default RegisterForm;