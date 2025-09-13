import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config";

interface DataEntry {
  uid: string;
  fullname: string;
  occupancy: string;
  street: string;
  blockAndNumber: string;
  totalPeople: number;
  adults: { male: number; female: number };
  kids: { male: number; female: number };
  isGunungSariResident: boolean;
  createdAt: string;
}

export default function DetailPage() {
  const { uid } = useLocalSearchParams();
  const [data, setData] = useState<DataEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          throw new Error("No Token Found");
        }
        const response = await axios.get<DataEntry>(
          `${API_BASE_URL}/data/${uid}`,
          {
            headers: {
              "x-auth-token": token,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error Fetching Data :", error);
        window.alert(
          "Mohon Maaf. Terjadi kesalahan saat memuat data.\nSilahkan Coba Lagi"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uid]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) {
    window.alert(
      "Mohon Maaf, data tidak ditemukan.\n\nSilahkan hubungi admin untuk info lebih lanjut."
    );
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-semibold text-center">
          Data Tidak Ditemukan
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6 bg-gray-100">
      <Text className="text-xl font-bold mb-6 text-center">
        Detail Data Penduduk
      </Text>

      <View className="bg-white p-6 rounded-lg shadow-md">
        <View className="flex-row items-center mb-2">
          <Text>Nama Lengkap:</Text>
          <Text>{data.fullname}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
