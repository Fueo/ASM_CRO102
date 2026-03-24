import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, typography } from '../../themes';
import LoginButton from './LoginButton'; // 1. Import component LoginButton
import LoginInput from './LoginInput';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleNavigateToRegister = () => {
        router.push('/Register');
    };

    // Hàm xử lý khi nhấn nút Đăng nhập
    const handleLogin = () => {
        console.log("Đăng nhập:", { email, password });
        router.replace('/tabs'); // Điều hướng đến trang Home sau khi đăng nhập thành công
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.title}>Chào mừng bạn</Text>
            <Text style={styles.subtitle}>Đăng nhập tài khoản</Text>

            <LoginInput
                placeholder="Nhập email hoặc số điện thoại"
                value={email}
                onChangeText={setEmail}
            />
            <LoginInput
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                isPassword={true}
            />

            <View style={styles.rememberForgotContainer}>
                <TouchableOpacity style={styles.rememberMe} onPress={() => setRememberMe(!rememberMe)}>
                    <Ionicons
                        name={rememberMe ? "checkmark-circle" : "ellipse-outline"}
                        size={20}
                        color={COLORS.MAIN}
                    />
                    <Text style={[typography.textSmall, styles.rememberText]}>Nhớ tài khoản</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.forgotText}>Quên mật khẩu ?</Text>
                </TouchableOpacity>
            </View>

            {/* 2. Sử dụng component LoginButton ở đây */}
            <View style={styles.buttonWrapper}>
                <LoginButton
                    title="Đăng nhập"
                    onPress={handleLogin}
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
                <Text style={styles.textSmall}>Bạn không có tài khoản</Text>
                <TouchableOpacity onPress={handleNavigateToRegister}>
                    <Text style={[typography.link, styles.footerLink]}> Tạo tài khoản</Text>
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
    // ... (Giữ nguyên các style khác của bạn)
    rememberForgotContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberText: {
        marginLeft: 5,
        color: COLORS.GRAY,
    },
    forgotText: {
        color: COLORS.MAIN,
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
    },
    // Style bọc ngoài nút đăng nhập để tạo khoảng cách (thay cho loginButtonContainer cũ)
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

export default LoginForm;