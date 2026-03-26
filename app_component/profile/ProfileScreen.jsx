import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAsync } from '../../redux/userSlice';

import themes from '../../themes';

const { colors, typography } = themes;

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { currentUser, isLoading } = useSelector((state) => state.user);

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(logoutUserAsync()).unwrap();
            } catch (error) {
              console.log('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const MenuItem = ({ title, isRed = false, onPress }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={isLoading && title === 'Đăng xuất'}
    >
      <Text
        style={[
          typography.subMedium,
          styles.menuText,
          isRed && styles.textRed,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[typography.subMediumUppercase, styles.headerTitle]}>
          PROFILE
        </Text>

        <View style={styles.userInfoContainer}>
          <Image
            source={{ uri: currentUser?.avatarURL || 'https://i.pravatar.cc/150?img=11' }}
            style={styles.avatar}
          />
          <View style={styles.userInfoText}>
            <Text style={[typography.subBold, styles.userName]}>
              {currentUser?.name || 'Chưa cập nhật tên'}
            </Text>
            <Text style={[typography.bodyRegular, styles.userEmail]}>
              {currentUser?.email || 'Chưa có email'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[typography.bodyRegular, styles.sectionTitle]}>Chung</Text>
          <View style={styles.divider} />

          <MenuItem title="Chỉnh sửa thông tin" onPress={() => console.log('Sửa thông tin')} />
          <MenuItem title="Cẩm nang trồng cây" onPress={() => console.log('Cẩm nang')} />
          <MenuItem title="Lịch sử giao dịch" onPress={() => console.log('Lịch sử')} />
          <MenuItem title="Q & A" onPress={() => console.log('QnA')} />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[typography.bodyRegular, styles.sectionTitle]}>
            Bảo mật và Điều khoản
          </Text>
          <View style={styles.divider} />

          <MenuItem title="Điều khoản và điều kiện" onPress={() => console.log('Điều khoản')} />
          <MenuItem title="Chính sách quyền riêng tư" onPress={() => console.log('Chính sách')} />
          <MenuItem title="Đăng xuất" isRed={true} onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 50,
  },
  headerTitle: {
    textAlign: 'center',
    color: colors.BLACK,
    marginBottom: 30,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: colors.NEW,
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    color: colors.BLACK,
    marginBottom: 2,
  },
  userEmail: {
    color: colors.GRAY,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: colors.GRAY,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    color: colors.BLACK,
  },
  textRed: {
    color: colors.ERROR,
  },
});

export default ProfileScreen;