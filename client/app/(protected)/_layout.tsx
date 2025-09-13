import { useEffect, useState } from "react";
import { Stack, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@/global.css";

export default function RootLayout() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setHasToken(!!token); // token resulting into boolean
    };

    checkToken();
  }, []);

  if (hasToken === null) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  if (!hasToken) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: "fade" }} />;
}
