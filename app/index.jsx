import { Redirect } from 'expo-router';
import React from 'react';
import { useSelector } from 'react-redux';
import LoginScreen from './Login';

export default function Index() {
  // Móc thẳng trạng thái isLoggedIn từ kho Redux ra
  // Giá trị này luôn chính xác vì PersistGate đã lo việc đọc từ máy lên rồi
  const { isLoggedIn } = useSelector((state) => state.user);
  if (isLoggedIn) {
    return <Redirect href="/tabs" />;
  }

  return <LoginScreen />;
}