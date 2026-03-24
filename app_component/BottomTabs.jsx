import { Feather } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import themes from '../themes'; // Import file theme của bạn

const { colors } = themes;

const BottomTab = ({ activeTab = 'home', onTabPress }) => {
    const tabs = [
        { id: 'home', icon: 'home' },
        { id: 'search', icon: 'search' },
        { id: 'bell', icon: 'bell' },
        { id: 'user', icon: 'user' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={styles.tabItem}
                            onPress={() => onTabPress && onTabPress(tab.id)}
                        >
                            <Feather
                                name={tab.icon}
                                size={24}
                                color={isActive ? colors.BLACK : colors.BLACK}
                            />
                            {/* Dấu chấm nhỏ dưới icon active */}
                            {isActive && <View style={styles.activeDot} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.WHITE,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: colors.WHITE,
        borderTopWidth: 1,
        borderTopColor: colors.NEW,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.BLACK,
        marginTop: 4,
        position: 'absolute',
        bottom: -10,
    }
});

export default BottomTab;