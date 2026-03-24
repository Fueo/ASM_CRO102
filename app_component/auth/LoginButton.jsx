import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import themes from '../../themes'; // Import tệp themes đã sửa đổi từ câu hỏi trước

// Component nút Đăng nhập
const LoginButton = (props) => {
    const { onPress, title } = props;
    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
            <LinearGradient
                colors={themes.colors.GRADIENT_PRIMARY} s
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <Text style={styles.text}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        height: 50,
        borderRadius: 15,
        width: '90%',
        alignSelf: 'center',
        shadowColor: themes.colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    text: {
        fontFamily: "Poppins-Bold",
        fontSize: 20,
        color: themes.colors.WHITE,
        textTransform: 'none',
    },
});

export default LoginButton;