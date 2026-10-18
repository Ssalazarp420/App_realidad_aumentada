import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ title: "AR Furniture" }} />
        <Stack.Screen name="ar" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
