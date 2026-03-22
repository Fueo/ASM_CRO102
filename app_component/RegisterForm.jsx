import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, typography } from '../themes';
import LoginInput from './LoginInput';

const RegisterForm = () => {
    // Cập nhật các state tương ứng với form đăng ký
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.formContainer}>
            {/* Tiêu đề Đăng ký */}
            <Text style={styles.title}>Đăng ký</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>Tạo tài khoản</Text>

            {/* Các trường nhập liệu */}
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

            {/* Phần Terms & Conditions */}
            <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                    Để đăng ký tài khoản, bạn đồng ý{' '}
                    <Text style={styles.termsLink}>Terms & Conditions</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
            </View>

            {/* Nút Đăng ký */}
            <TouchableOpacity style={styles.loginButtonContainer}>
                <LinearGradient
                    colors={COLORS.GRADIENT_PRIMARY || [COLORS.MAIN, '#4CAF50']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.loginButton}
                >
                    <Text style={[typography.h3Bold, styles.loginText]}>Đăng ký</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Divider Hoặc */}
            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Hoặc</Text>
                <View style={styles.dividerLine} />
            </View>

            {/* Social Đăng nhập */}
            <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <Image source={require('../assets/images/icon_google.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image source={require('../assets/images/icon_facebook.png')} style={styles.socialIcon} />
                </TouchableOpacity>
            </View>

            {/* Footer chuyển sang Đăng nhập */}
            <View style={styles.footerContainer}>
                <Text style={styles.textSmall}>Tôi đã có tài khoản</Text>
                <TouchableOpacity>
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
    // Style cho phần Terms & Conditions
    termsContainer: {
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    termsText: {
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: COLORS.BLACK,
        lineHeight: 18, // Giúp khoảng cách dòng dễ nhìn hơn
    },
    termsLink: {
        color: COLORS.MAIN,
        fontFamily: 'Poppins-Bold',
        textDecorationLine: 'underline', // Gạch chân link
    },
    loginButtonContainer: {
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 30,
    },
    loginButton: {
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: COLORS.WHITE,
        textTransform: 'none',
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