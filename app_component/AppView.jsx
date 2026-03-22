import { StyleSheet, View } from 'react-native';

const AppView = (props) => {
    const { children, padding, margin, fullWidth, center, borderRadius } = props;

    const viewStyles = [
        fullWidth && styles.fullWidth,
        padding ? { padding } : 24,
        margin ? { margin } : null,
        center && styles.centerContent,
        borderRadius ? { borderRadius } : null,
    ]
    return (
        <View style={viewStyles}>
            {children}
        </View>
    )
}

export default AppView

const styles = StyleSheet.create({
    fullWidth: {
        width: '100%',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})