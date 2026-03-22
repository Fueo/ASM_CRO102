import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../themes';

const { width } = Dimensions.get('window');

const HeaderBanner = ({ onBackPress, heightRatio = 0.9 }) => (
    <View style={[styles.outerContainer, { height: width * heightRatio }]}>
        <Image
            source={require('../assets/images/bg_login.png')}
            style={styles.backgroundImage}
        />

        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    outerContainer: {
        width: width,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
    },
    backgroundImage: {
        position: 'absolute',
        // 1. Thay 'top: 0' thành 'bottom: 0' để ghim đường cong của ảnh xuống đáy container
        bottom: 0,
        left: 0,
        width: width,
        // 2. Cố định chiều cao của ảnh luôn to hơn container (ví dụ 1.15 lần width). 
        // Điều này giúp ảnh luôn giữ nguyên tỷ lệ gốc, không bị cắt méo khi container lùn đi.
        height: width * 1.15,
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F8EEC0',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});

export default HeaderBanner;