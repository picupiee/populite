import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import "@/global.css";
import Buttons from "@/components/buttons";

export default function HomePage() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-200">
      <Text className="text-3xl font-bold">Selamat Datang</Text>
      <Text className="text-lg mb-4">Pilih salah satu menu dibawah ini.</Text>
      <View className="flex justify-center">
        <Buttons
          className="bg-blue-600 p-2 rounded-md mb-2"
          title="Daftar Baru Warga"
          textStyle="text-md font-medium text-white text-center"
          onPress={() => router.push("/data-entry")}
        />
        <Buttons
          className="bg-blue-600 p-2 rounded-md mb-2"
          title="Lihat Data"
          textStyle="text-md font-medium text-white text-center"
          onPress={() => router.push("/view-data")}
        />
        <Buttons
          className="bg-red-600 p-2 rounded-md mb-2"
          title="Keluar"
          textStyle="text-md font-medium text-white text-center"
          onPress={() => router.replace("/")}
        />
      </View>
    </View>
  );
}
