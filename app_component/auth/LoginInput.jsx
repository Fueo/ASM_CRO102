import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import themes from '../../themes';

const LoginInput = ({
    placeholder,
    value,
    onChangeText,
    isPassword = false,
    error,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(isPassword);

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                ]}
            >
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={[
                            styles.input,
                            isPassword && { paddingRight: 35 },
                            // Chuyển chữ thành màu đen khi đang focus hoặc khi đã có text
                            (isFocused || (value && value.length > 0)) && { color: '#000000', fontSize: 15 }
                        ]}
                        placeholder={placeholder}
                        placeholderTextColor="#8B8B8B"
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={isSecure}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        textAlignVertical="center"
                        multiline={false}
                        {...props}
                    />
                </View>

                {isPassword && (
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => setIsSecure(!isSecure)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isSecure ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            // Icon cũng có thể chuyển màu hoặc giữ nguyên xám, ở đây tôi giữ nguyên xám
                            color="#8B8B8B"
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderWidth: 1, // Viền mặc định mỏng
        borderColor: '#8B8B8B',
        borderRadius: 12,
        paddingHorizontal: 15,
        backgroundColor: 'transparent',
    },
    inputFocused: {
        borderColor: themes.colors.MAIN,
        borderWidth: 2, // Viền dày hơn khi focus
    },
    textInputWrapper: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
    },
    input: {
        height: 48,
        padding: 0,
        margin: 0,
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#8B8B8B', // Màu mặc định khi chưa focus/chưa gõ
        includeFontPadding: false,
    },
    iconContainer: {
        position: 'absolute',
        right: 15,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    errorText: {
        marginTop: 5,
        color: themes.colors.ERROR,
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        marginLeft: 2,
    },
});

export default LoginInput;