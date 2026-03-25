import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, typography } from '../../themes';
import LoginButton from './LoginButton';
import LoginInput from './LoginInput';

// Import cấu hình axios riêng đã tạo
// Lưu ý: Đảm bảo đường dẫn này trỏ đúng tới nơi bạn lưu file axiosClient.js
import axiosClient from '../../utils/axiosHelper';

// Cấu hình mã Web Client ID từ Firebase
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Khởi tạo Google Signin khi load màn hình
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: false,
        });
    }, []);

    const handleNavigateToRegister = () => {
        router.push('/Register');
    };

    // Hàm tiện ích: Lưu Token vào thiết bị
    const saveTokens = async (accessToken, refreshToken) => {
        try {
            await AsyncStorage.setItem('accessToken', accessToken);
            if (refreshToken) {
                await AsyncStorage.setItem('refreshToken', refreshToken);
            }
        } catch (error) {
            console.error('Lỗi lưu token:', error);
        }
    };

    // 1. XỬ LÝ ĐĂNG NHẬP BẰNG TÀI KHOẢN THƯỜNG
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        try {
            // Gọi API qua axiosClient
            const response = await axiosClient.post('/users/login', {
                email: email.trim(),
                password: password,
            });

            // Lấy dữ liệu từ backend (theo cấu trúc user.controller.js của bạn)
            const { accessToken, refreshToken, user } = response.data;
            
            // Lưu token lại để dùng cho các API sau này
            await saveTokens(accessToken, refreshToken);
            
            console.log('Đăng nhập thường thành công:', user);
            Alert.alert('Thành công', `Chào mừng ${user.name || 'bạn'}!`);
            
            // Điều hướng vào màn hình chính
            router.replace('/tabs'); 
        } catch (error) {
            console.error('Lỗi login thường:', error);
            const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
            Alert.alert('Lỗi Đăng Nhập', errorMessage);
        }
    };

    // 2. XỬ LÝ ĐĂNG NHẬP BẰNG GOOGLE
    const handleGoogleLogin = async () => {
        try {
            // Đảm bảo máy ảo/điện thoại có dịch vụ Google Play
            await GoogleSignin.hasPlayServices();
            
            // Bật popup chọn tài khoản Google
            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken || userInfo.idToken;

            if (!idToken) {
                throw new Error('Không lấy được token từ Google');
            }

            // Gửi idToken xuống backend của bạn để xác thực và tạo user
            const response = await axiosClient.post('/users/google-login', { 
                idToken 
            });

            const { accessToken, refreshToken, user } = response.data;

            // Lưu token tương tự như đăng nhập thường
            await saveTokens(accessToken, refreshToken);

            console.log('Đăng nhập Google thành công:', user);
            Alert.alert('Thành công', `Đăng nhập Google thành công!`);
            
            // Điều hướng vào màn hình chính
            router.replace('/tabs');

        } catch (error) {
            console.error('Lỗi Google Login:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Hệ thống đang bận, vui lòng thử lại sau.';
            Alert.alert('Lỗi Đăng Nhập Google', errorMessage);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.title}>Chào mừng bạn</Text>
            <Text style={styles.subtitle}>Đăng nhập tài khoản</Text>

            <LoginInput
                placeholder="Nhập email hoặc số điện thoại"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
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
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
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