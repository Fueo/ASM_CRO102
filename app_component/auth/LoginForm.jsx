import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { loginUser } from '../../redux/userSlice';
import { COLORS, typography } from '../../themes';
import LoginButton from './LoginButton';
import LoginInput from './LoginInput';
import SocialAuthButtons from './SocialAuthButtons';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  const handleNavigateToRegister = () => {
    router.push('/Register');
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      const result = await dispatch(
        loginUser({
          email: email.trim(),
          password,
        })
      ).unwrap();

      Alert.alert(
        'Thành công',
        `Chào mừng ${result?.user?.name || result?.user?.email || 'bạn'}!`
      );
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message || 'Đăng nhập thất bại';

      Alert.alert('Lỗi đăng nhập', errorMessage);
    }
  };

  const handleSocialSuccess = (result) => {
    Alert.alert(
      'Thành công',
      `Chào mừng ${result?.user?.name || result?.user?.email || 'bạn'}!`
    );
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
        isPassword
      />

      <View style={styles.rememberForgotContainer}>
        <TouchableOpacity
          style={styles.rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={rememberMe ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={COLORS.MAIN}
          />
          <Text style={[typography.textSmall, styles.rememberText]}>
            Nhớ tài khoản
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Quên mật khẩu ?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonWrapper}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.MAIN} />
        ) : (
          <LoginButton title="Đăng nhập" onPress={handleLogin} />
        )}
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Hoặc</Text>
        <View style={styles.dividerLine} />
      </View>

      <SocialAuthButtons onSuccess={handleSocialSuccess} />

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

export default LoginForm;