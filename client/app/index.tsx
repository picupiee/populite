import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { router } from "expo-router";
// import * as SecureStore from "expo-secure-store"
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { LoginResponse } from "@/types";
// import SecureStore from 'expo-secure-store'

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      const { token } = response.data as { token: string };
      // Save the token
      await AsyncStorage.setItem("token", token);
      window.alert(
        `Selamat Datang, ${username}!\nSilahkan tekan OK untuk melanjutkan!`
      );
      setIsLoginSuccess(true);
      router.replace("/home");
    } catch (error) {
      window.alert(
        `Maaf, username atau password yang anda masukkan salah.\n\nSilahkan coba kembali atau hubungi admin untuk bantuan!`
      );
      setIsLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-400">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Login</Text>
      <TextInput
        className="w-80 h-12 border border-gray-600 rounded-md px-4 mb-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="w-80 h-12 border border-gray-600 rounded-md px-4 mb-4"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleLogin}
      />
      <Button
        title={loading ? "Mohon Tunggu ..." : "Masuk"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}
