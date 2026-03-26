import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { loginWithGoogle } from '../../redux/userSlice';
import { COLORS } from '../../themes';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

const SocialAuthButtons = ({ onSuccess, showFacebook = true }) => {
  const dispatch = useDispatch();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: false,
    });
  }, []);

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;

    try {
      setIsGoogleLoading(true);

      await GoogleSignin.hasPlayServices();

      // Nếu muốn luôn hiện chọn tài khoản khác
      const hasPrev = await GoogleSignin.hasPreviousSignIn();
      if (hasPrev) {
        await GoogleSignin.signOut().catch(() => null);
      }

      const userInfo = await GoogleSignin.signIn();

      const idToken =
        userInfo?.data?.idToken ||
        userInfo?.idToken ||
        userInfo?.user?.idToken ||
        null;

      // User bấm ra ngoài / cancel / không lấy được token
      if (!idToken) {
        return;
      }

      const result = await dispatch(loginWithGoogle(idToken)).unwrap();

      if (onSuccess) {
        onSuccess(result);
        return;
      }

      Alert.alert(
        'Thành công',
        `Chào mừng ${result?.user?.name || result?.user?.email || 'bạn'}!`
      );
    } catch (error) {
      console.log('Google Login Error:', error);

      const code = error?.code;
      const message = error?.message?.toLowerCase?.() || '';

      if (
        code === statusCodes.SIGN_IN_CANCELLED ||
        code === 'SIGN_IN_CANCELLED' ||
        code === '12501' ||
        message.includes('cancel') ||
        message.includes('dismiss') ||
        message.includes('closed')
      ) {
        return;
      }

      if (code === statusCodes.IN_PROGRESS) {
        return;
      }

      if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          'Lỗi',
          'Google Play Services không khả dụng trên thiết bị này'
        );
        return;
      }

      Alert.alert(
        'Lỗi',
        error?.message || 'Đăng nhập Google thất bại'
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    Alert.alert('Thông báo', 'Chức năng đăng nhập Facebook đang phát triển');
  };

  return (
    <View style={styles.socialContainer}>
      <TouchableOpacity
        style={styles.socialButton}
        onPress={handleGoogleLogin}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <ActivityIndicator size="small" color={COLORS.MAIN} />
        ) : (
          <Image
            source={require('../../assets/images/icon_google.png')}
            style={styles.socialIcon}
          />
        )}
      </TouchableOpacity>

      {showFacebook && (
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleFacebookLogin}
        >
          <Image
            source={require('../../assets/images/icon_facebook.png')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    minHeight: 44,
  },
  socialButton: {
    marginHorizontal: 15,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 44,
    height: 44,
  },
});

export default SocialAuthButtons;