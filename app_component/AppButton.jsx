import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import themes from '../themes'

const AppButton = (props) => {
    const {
        title = "Button",
        disabled = false,
        fullWidth = false,
        borderRadius = 8,
        center = false,
        onPress,
    } = props

    const buttonStyles = [
        styles.button,
        fullWidth && styles.fullWidth,
        center && styles.centerContent,
        disabled && styles.buttonDisabled,
        ,
        { borderRadius },
    ]

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[themes.typography.subMediumUppercase, { color: themes.colors.WHITE }]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default AppButton

const styles = StyleSheet.create({
    button: {
        backgroundColor: themes.colors.MAIN,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    buttonDisabled: {
        backgroundColor: themes.colors.GRAY,
    },
    fullWidth: {
        width: '100%',
    },
    centerContent: {
        alignItems: 'center',
    },
})