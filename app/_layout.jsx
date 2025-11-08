import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { requestUserPermission, setupbackgroundNotificationListener, setupForegroundNotificationListener } from '../utils/notifications';

export default function RootLayout() {

  useEffect(() => {
    requestUserPermission();
    setupForegroundNotificationListener();
    setupbackgroundNotificationListener();

  }, []);

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
