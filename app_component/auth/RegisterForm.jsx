import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, typography } from '../../themes';
import axiosClient from '../../utils/axiosHelper';
import LoginButton from './LoginButton';
import LoginInput from './LoginInput';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

const RegisterForm = () => {
    // State lưu dữ liệu người dùng nhập
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // State mới: Lưu trữ thông báo lỗi cho từng ô input
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
    });

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: false,
        });
    }, []);

    const handleNavigateToLogin = () => {
        router.back(); 
    };

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

    // Hàm kiểm tra tính hợp lệ của Form trước khi gọi API
    const validateForm = () => {
        let isValid = true;
        let newErrors = { fullName: '', email: '', phone: '', password: '' };

        // 1. Check Họ tên
        if (!fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên';
            isValid = false;
        }

        // 2. Check Email
        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                newErrors.email = 'Định dạng email không hợp lệ';
                isValid = false;
            }
        }

        // 3. Check Mật khẩu
        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        // Cập nhật state lỗi để hiển thị lên UI
        setErrors(newErrors);
        return isValid;
    };

    // XỬ LÝ ĐĂNG KÝ TÀI KHOẢN
    const handleRegister = async () => {
        // Nếu validate thất bại thì dừng luôn, không gọi API
        if (!validateForm()) return;

        try {
            const response = await axiosClient.post('/users/register', {
                name: fullName.trim(),
                email: email.trim(),
                password: password,
                phone: phone.trim() || null, 
            });

            Alert.alert(
                'Thành công', 
                'Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục.',
                [
                    { text: 'OK', onPress: () => handleNavigateToLogin() }
                ]
            );

        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
            
            // Nếu API báo lỗi "Email đã tồn tại", hiển thị lỗi ngay dưới ô Email
            if (errorMessage.toLowerCase().includes('email')) {
                setErrors(prev => ({ ...prev, email: errorMessage }));
            } else {
                // Lỗi server khác thì vẫn dùng Alert
                Alert.alert('Lỗi Đăng Ký', errorMessage);
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken || userInfo.idToken;

            if (!idToken) throw new Error('Không lấy được token từ Google');

            const response = await axiosClient.post('/users/google-login', { idToken });
            const { accessToken, refreshToken, user } = response.data;

            await saveTokens(accessToken, refreshToken);
            
            Alert.alert('Thành công', `Đăng nhập Google thành công!`);
            router.replace('/tabs');

        } catch (error) {
            console.error('Lỗi Google Login:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Hệ thống đang bận.';
            Alert.alert('Lỗi Đăng Nhập Google', errorMessage);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.title}>Đăng ký</Text>
            <Text style={styles.subtitle}>Tạo tài khoản</Text>

            <LoginInput
                placeholder="Họ tên"
                value={fullName}
                // Khi người dùng gõ lại, tự động xóa câu thông báo lỗi
                onChangeText={(text) => { setFullName(text); setErrors({...errors, fullName: ''}) }}
                autoCapitalize="words"
                error={errors.fullName} // Truyền state lỗi vào
            />
            <LoginInput
                placeholder="E-mail"
                value={email}
                onChangeText={(text) => { setEmail(text); setErrors({...errors, email: ''}) }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
            />
            <LoginInput
                placeholder="Số điện thoại (Tuỳ chọn)"
                value={phone}
                onChangeText={(text) => { setPhone(text); setErrors({...errors, phone: ''}) }}
                keyboardType="phone-pad"
                error={errors.phone}
            />
            <LoginInput
                placeholder="Mật khẩu"
                value={password}
                onChangeText={(text) => { setPassword(text); setErrors({...errors, password: ''}) }}
                isPassword={true}
                error={errors.password}
            />

            <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                    Để đăng ký tài khoản, bạn đồng ý{' '}
                    <Text style={styles.termsLink}>Terms & Conditions</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
            </View>

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
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                    <Image source={require('../../assets/images/icon_google.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image source={require('../../assets/images/icon_facebook.png')} style={styles.socialIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
                <Text style={styles.textSmall}>Tôi đã có tài khoản</Text>
                <TouchableOpacity onPress={handleNavigateToLogin}>
                    <Text style={[typography.link, styles.footerLink]}> Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
// ... (Bạn giữ nguyên phần CSS của bạn nhé, không cần thay đổi gì ở đây)
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