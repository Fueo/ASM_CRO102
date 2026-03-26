import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { COLORS, typography } from '../../themes';
import axiosClient from '../../utils/axiosHelper';
import LoginButton from './LoginButton';
import LoginInput from './LoginInput';
import SocialAuthButtons from './SocialAuthButtons';

const RegisterForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const { isLoading } = useSelector((state) => state.user);

  const handleNavigateToLogin = () => {
    router.back();
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      phone: '',
      password: '',
    };

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
      isValid = false;
    }

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

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await axiosClient.post('/users/register', {
        name: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || null,
      });

      Alert.alert(
        'Thành công',
        'Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục.',
        [{ text: 'OK', onPress: handleNavigateToLogin }]
      );
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Đăng ký thất bại';

      if (String(errorMessage).toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, email: errorMessage }));
      } else {
        Alert.alert('Lỗi đăng ký', errorMessage);
      }
    }
  };

  // Giống LoginForm
  const handleSocialSuccess = (result) => {
    Alert.alert(
      'Thành công',
      `Chào mừng ${result?.user?.name || result?.user?.email || 'bạn'}!`
    );
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Đăng ký</Text>
      <Text style={styles.subtitle}>Tạo tài khoản</Text>

      <LoginInput
        placeholder="Họ tên"
        value={fullName}
        onChangeText={(text) => {
          setFullName(text);
          setErrors((prev) => ({ ...prev, fullName: '' }));
        }}
        autoCapitalize="words"
        error={errors.fullName}
      />

      <LoginInput
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: '' }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <LoginInput
        placeholder="Số điện thoại (Tuỳ chọn)"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          setErrors((prev) => ({ ...prev, phone: '' }));
        }}
        keyboardType="phone-pad"
        error={errors.phone}
      />

      <LoginInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors((prev) => ({ ...prev, password: '' }));
        }}
        isPassword
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
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.MAIN} />
        ) : (
          <LoginButton title="Đăng ký" onPress={handleRegister} />
        )}
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Hoặc</Text>
        <View style={styles.dividerLine} />
      </View>

      <SocialAuthButtons onSuccess={handleSocialSuccess} />

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
    minHeight: 50,
    justifyContent: 'center',
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