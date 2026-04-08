import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
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
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// LƯU Ý: Kiểm tra lại đường dẫn import Header, themes và Redux Slices cho khớp với thư mục của bạn
import Header from '../../app_component/home/Header';
import { fetchCart } from '../../redux/cartSlice';
import { createOrder } from '../../redux/orderSlice'; // Hãy đảm bảo bạn đã tạo file orderSlice.js
import themes from '../../themes';

const { colors, typography } = themes;

const OrderScreen = () => {
  const dispatch = useDispatch();

  // 1. LẤY DỮ LIỆU TỪ REDUX
  const { summary } = useSelector((state) => state.cart);
  const subTotal = summary?.totalCartAmount || 0; // Tạm tính (Chỉ tính các SP được chọn)

  // Trạng thái loading từ Redux (khi đang gọi API tạo đơn hàng)
  // Nếu state order chưa có, fallback về false để tránh lỗi
  const isOrdering = useSelector((state) => state.order?.isLoading || false);

  // 2. STATE CỦA FORM ĐIỀN THÔNG TIN
  const [name, setName] = useState('Trần Minh Trí');
  const [email, setEmail] = useState('tranminhtri@gmail.com');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [shippingMethod, setShippingMethod] = useState('fast'); // 'fast' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('visa'); // 'visa' | 'atm'

  // 3. LOGIC TÍNH TOÁN & KIỂM TRA
  const isFormValid = name.trim() !== '' && email.trim() !== '' && address.trim() !== '' && phone.trim() !== '';
  const shippingFee = shippingMethod === 'fast' ? 15000 : 20000;
  const totalAmount = subTotal + shippingFee;

  // 4. HÀM XỬ LÝ KHI BẤM THANH TOÁN
  const handleCheckout = () => {
    if (isOrdering) return; // Ngăn bấm 2 lần

    const orderData = {
      name: name.trim(),
      email: email.trim(),
      address: address.trim(),
      phone: phone.trim(),
      shippingMethod: shippingMethod,
      paymentMethod: paymentMethod,
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then((res) => {
        // THÀNH CÔNG
        Alert.alert(
          "Thành công", 
          "Đơn hàng của bạn đã được tạo thành công!",
          [
            { 
              text: "OK", 
              onPress: () => {
                // Tải lại giỏ hàng (vì backend đã xóa các item được chọn)
                dispatch(fetchCart());
                // Điều hướng về Trang chủ (Dùng replace để không cho khách Back lại màn hình thanh toán)
                router.replace('/'); // Sửa đường dẫn này thành trang Home của bạn nếu cần
              }
            }
          ]
        );
      })
      .catch((err) => {
        // THẤT BẠI
        Alert.alert("Thất bại", err.message || "Có lỗi xảy ra, vui lòng thử lại.");
      });
  };

  // ==========================================
  // COMPONENT CON SỬ DỤNG TRONG GIAO DIỆN
  // ==========================================
  const InputField = ({ placeholder, value, onChangeText, keyboardType = 'default' }) => (
    <TextInput
      style={[typography.bodyRegular, styles.input]}
      placeholder={placeholder}
      placeholderTextColor={colors.GRAY}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );

  const SelectionOption = ({ title, subtitle, isSelected, onPress }) => (
    <TouchableOpacity style={styles.optionContainer} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.optionTextContainer}>
        <Text style={[typography.bodyRegular, { color: isSelected ? colors.MAIN : colors.BLACK }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[typography.bodyRegular, styles.subtitle]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {isSelected ? <Feather name="check" size={20} color={colors.MAIN} /> : null}
    </TouchableOpacity>
  );

  // ==========================================
  // RENDER GIAO DIỆN CHÍNH
  // ==========================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Header
            title="THANH TOÁN"
            onBackPress={() => router.back()}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Mục 1: Thông tin khách hàng */}
          <View style={styles.section}>
            <Text style={[typography.subMedium, styles.sectionTitle]}>
              Thông tin khách hàng
            </Text>
            <View style={styles.divider} />
            <InputField placeholder="Tên khách hàng" value={name} onChangeText={setName} />
            <InputField placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <InputField placeholder="Địa chỉ" value={address} onChangeText={setAddress} />
            <InputField placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>

          {/* Mục 2: Vận chuyển */}
          <View style={styles.section}>
            <Text style={[typography.subMedium, styles.sectionTitle]}>
              Phương thức vận chuyển
            </Text>
            <View style={styles.divider} />
            <SelectionOption
              title="Giao hàng Nhanh - 15.000đ"
              subtitle="Dự kiến giao hàng 5-7/9"
              isSelected={shippingMethod === 'fast'}
              onPress={() => setShippingMethod('fast')}
            />
            <View style={styles.divider} />
            <SelectionOption
              title="Giao hàng COD - 20.000đ"
              subtitle="Dự kiến giao hàng 4-8/9"
              isSelected={shippingMethod === 'cod'}
              onPress={() => setShippingMethod('cod')}
            />
            <View style={styles.divider} />
          </View>

          {/* Mục 3: Thanh toán */}
          <View style={styles.section}>
            <Text style={[typography.subMedium, styles.sectionTitle]}>
              Hình thức thanh toán
            </Text>
            <View style={styles.divider} />
            <SelectionOption
              title="Thẻ VISA/MASTERCARD"
              isSelected={paymentMethod === 'visa'}
              onPress={() => setPaymentMethod('visa')}
            />
            <View style={styles.divider} />
            <SelectionOption
              title="Thẻ ATM"
              isSelected={paymentMethod === 'atm'}
              onPress={() => setPaymentMethod('atm')}
            />
            <View style={styles.divider} />
          </View>
        </ScrollView>

        {/* Footer: Tính tiền & Button Submit */}
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={[typography.bodyRegular, { color: colors.GRAY }]}>Tạm tính</Text>
            <Text style={[typography.bodyRegular, { color: colors.BLACK }]}>
              {subTotal.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[typography.bodyRegular, { color: colors.GRAY }]}>Phí vận chuyển</Text>
            <Text style={[typography.bodyRegular, { color: colors.BLACK }]}>
              {shippingFee.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 4 }]}>
            <Text style={[typography.subMedium, { color: colors.GRAY }]}>Tổng cộng</Text>
            <Text style={[typography.subBold, { color: colors.MAIN }]}>
              {totalAmount.toLocaleString('vi-VN')}đ
            </Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.submitButton, 
              { backgroundColor: isFormValid ? colors.MAIN : colors.LIGHT }
            ]} 
            activeOpacity={0.8}
            disabled={!isFormValid || isOrdering}
            onPress={handleCheckout}
          >
            {isOrdering ? (
              <ActivityIndicator color={colors.WHITE} />
            ) : (
              <Text style={[typography.subMediumUppercase, styles.submitButtonText]}>
                TIẾP TỤC
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.BLACK,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    marginBottom: 16,
    color: colors.BLACK,
    paddingVertical: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  optionTextContainer: {
    flex: 1,
  },
  subtitle: {
    color: colors.GRAY,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    backgroundColor: colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: '#E6E6E6',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  submitButton: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: colors.WHITE,
  },
});

export default OrderScreen;