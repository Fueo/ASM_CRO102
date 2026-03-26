import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../redux/store'; // Nhớ sửa đường dẫn cho đúng

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    // Bọc Provider của Redux
    <Provider store={store}>
      {/* Bọc PersistGate để đợi load dữ liệu từ máy lên trước khi render UI */}
      <PersistGate loading={null} persistor={persistor}>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }} initialRouteName="index">
          <Stack.Screen name="index" />
          <Stack.Screen name="tabs" />
        </Stack>
      </PersistGate>
    </Provider>
  );
}