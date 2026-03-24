import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import themes from '../../themes'; // Điều chỉnh đường dẫn đến thư mục themes

const { colors } = themes;

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                // Ẩn Header mặc định của tab (vì mỗi screen tự làm Header riêng)
                headerShown: false,
                // Màu icon khi được chọn (Active)
                tabBarActiveTintColor: colors.BLACK,
                // Màu icon khi không được chọn (Inactive)
                tabBarInactiveTintColor: colors.BLACK,
                // Ẩn tên tab ở dưới icon cho giống thiết kế
                tabBarShowLabel: false,
                // Style cho toàn bộ thanh Bottom Tab
                tabBarStyle: {
                    backgroundColor: colors.WHITE,
                    borderTopWidth: 1,
                    borderTopColor: colors.NEW,
                    height: 60, // Chiều cao của thanh tab
                    paddingBottom: 5,
                    paddingTop: 5,
                },
            }}
        >
            {/* 1. Tab Home */}
            <Tabs.Screen
                name="Home" // Bắt buộc phải là chữ thường để khớp với file home.tsx
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.tabItem}>
                            <Feather 
                                name="home" 
                                size={24} 
                                color={color} 
                                style={{ marginBottom: focused ? 6 : 0 }} // Đẩy icon lên khi active
                            />
                            {focused && <View style={styles.activeDot} />}
                        </View>
                    ),
                }}
            />

            {/* 2. Tab Search */}
            <Tabs.Screen
                name="Search" // Bắt buộc phải là chữ thường để khớp với file search.tsx
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.tabItem}>
                            <Feather 
                                name="search" 
                                size={24} 
                                color={color} 
                                style={{ marginBottom: focused ? 6 : 0 }} // Đẩy icon lên khi active
                            />
                            {focused && <View style={styles.activeDot} />}
                        </View>
                    ),
                }}
            />

            {/* 3. Tab Notification */}
            <Tabs.Screen
                name="Notification" // Bắt buộc phải là chữ thường
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.tabItem}>
                            <Feather 
                                name="bell" 
                                size={24} 
                                color={color} 
                                style={{ marginBottom: focused ? 6 : 0 }} // Đẩy icon lên khi active
                            />
                            {focused && <View style={styles.activeDot} />}
                        </View>
                    ),
                }}
            />

            {/* 4. Tab Profile */}
            <Tabs.Screen
                name="Profile" // Bắt buộc phải là chữ thường
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.tabItem}>
                            <Feather 
                                name="user" 
                                size={24} 
                                color={color} 
                                style={{ marginBottom: focused ? 6 : 0 }} // Đẩy icon lên khi active
                            />
                            {focused && <View style={styles.activeDot} />}
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 40, // Cố định chiều cao để tránh giật thanh tab khi icon nhích lên
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.BLACK,
        position: 'absolute',
        bottom: 0, // Căn dấu chấm nằm sát đáy của tabItem
    },
});