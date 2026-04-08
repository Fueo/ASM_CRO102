import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Import router để làm nút back
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../redux/userSlice'; // Đảm bảo đường dẫn này đúng với project của bạn

// Component mô phỏng icon mặc định caro tròn
const DefaultAvatar = () => (
  <View style={styles.avatarDefaultContainer}>
    <View style={styles.avatarCaro}></View>
    <View style={styles.avatarCaro2}></View>
    <View style={styles.avatarCaro3}></View>
    <View style={styles.avatarCaro4}></View>
  </View>
);

// Component chung cho các trường Form Input
const FormInput = ({ label, value, onChangeText, keyboardType = 'default', autoCapitalize = 'sentences', placeholder }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      placeholder={placeholder}
      placeholderTextColor="#ABABAB"
    />
  </View>
);

// Component Header tùy chỉnh
const Header = ({ title }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={24} color="black" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={{ width: 24 }} /> {/* View rỗng để cân bằng title ra giữa */}
  </View>
);

const EditInfoScreen = () => {
  const dispatch = useDispatch();

  // 1. Lấy thông tin user hiện tại từ Redux
  const { currentUser, isLoading } = useSelector((state) => state.user);

  // 2. Gán giá trị mặc định cho State từ currentUser
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  
  const [isSuccess, setIsSuccess] = useState(false);

  // Cập nhật lại form nếu currentUser thay đổi (load chậm)
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setAddress(currentUser.address || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Kiểm tra tính hợp lệ của form
  const isFormValid = name.trim() && email.trim() && address.trim() && phone.trim();

  // 3. Hàm xử lý khi nhấn nút lưu
  const handleSave = () => {
    if (isFormValid && !isLoading) {
      // Gọi API cập nhật
      dispatch(updateUserProfile({ name, email, address, phone }))
        .unwrap()
        .then(() => {
          // Hiện thông báo thành công
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 3000);
        })
        .catch((error) => {
          // Hiện thông báo lỗi
          Alert.alert('Thất bại', error || 'Có lỗi xảy ra, vui lòng thử lại sau.');
        });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Header title="CHỈNH SỬA THÔNG TIN" />
      
      {/* View đẩy form lên khi bàn phím xuất hiện */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* View cuộn cho form dài */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Khu vực Avatar tròn caro */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <DefaultAvatar />
            </View>
          </View>

          {/* Đoạn text ghi chú */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              Thông tin của bạn sẽ được lưu cho lần mua kế tiếp. Bạn hãy chắc chắn thông tin của mình là chính xác.
            </Text>
          </View>

          {/* Thông báo thành công màu xanh lá (nếu có) */}
          {isSuccess && (
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessageText}>
                Thông tin của bạn đã được cập nhật thành công. Vui lòng kiểm tra lại thông tin.
              </Text>
            </View>
          )}

          {/* Các trường Form nhập liệu */}
          <FormInput 
            label="Tên người dùng" 
            value={name} 
            onChangeText={setName} 
            placeholder="Nhập tên"
          />
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Nhập email"
          />
          <FormInput 
            label="Địa chỉ" 
            value={address} 
            onChangeText={setAddress} 
            placeholder="Nhập địa chỉ" 
          />
          <FormInput 
            label="Số điện thoại" 
            value={phone} 
            onChangeText={setPhone} 
            keyboardType="numeric" 
            placeholder="Nhập số điện thoại"
          />

        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Nút lưu ở dưới cùng */}
      <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              isFormValid ? styles.saveButtonActive : styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!isFormValid || isLoading} // Khóa nút khi đang load
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>LƯU THÔNG TIN</Text>
            )}
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Stylesheet để định nghĩa kiểu dáng
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  // Header styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
  },
  // Avatar styles
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ABABAB',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
  },
  // Default Avatar Caro styles
  avatarDefaultContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  avatarCaro: { width: '50%', height: '50%', backgroundColor: 'white' },
  avatarCaro2: { width: '50%', height: '50%', backgroundColor: 'black' },
  avatarCaro3: { width: '50%', height: '50%', backgroundColor: 'black' },
  avatarCaro4: { width: '50%', height: '50%', backgroundColor: 'white' },

  // Ghi chú styles
  noteContainer: {
    marginBottom: 20,
  },
  noteText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '400',
    color: '#ABABAB',
    lineHeight: 18,
  },
  // Thông báo thành công styles
  successMessageContainer: {
    marginBottom: 20,
  },
  successMessageText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '400',
    color: '#009245', 
    lineHeight: 18,
  },
  // Form input styles
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: '#ABABAB',
    marginBottom: 5,
  },
  input: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  // Nút lưu styles
  saveButtonContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#EDEDED',
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonActive: {
    backgroundColor: '#007537', 
  },
  saveButtonDisabled: {
    backgroundColor: '#ABABAB', 
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});

export default EditInfoScreen;