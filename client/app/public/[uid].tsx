import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "@/config";

interface PublicData {
  uid: string;
  fullname: string;
  occupancy: string;
  street: string;
  blockAndNumber: string;
  totalPeople: number;
  isGunungSariResident: boolean;
}

export default function PublicDataScreen() {
  const { uid } = useLocalSearchParams();
  const [data, setData] = useState<PublicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get<PublicData>(
          `${API_BASE_URL}/data/public/data/${uid}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error Fetching public data :", error);
        window.alert(
          "Gagal !\nAda Kesalahan saat mengambil data, silahkan coba kembali."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uid]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Data Tidak Ditemukan</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-6 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">
        Informasi Penduduk (Publik)
      </Text>

      {/* Censored Data */}
      <View className="bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-semibold mb-2">
          Nama: {data.fullname}
        </Text>
        <Text className="text-lg font-semibold mb-2">
          Alamat: {data.street} Blok {data.blockAndNumber}
        </Text>
        <Text className="text-lg font-semibold mb-2">
          Status Hunian: {data.occupancy}
        </Text>
        <Text className="text-lg font-semibold mb-2">
          Total Penduduk: {data.totalPeople}
        </Text>
        <Text className="text-lg font-semibold mb-2">
          KTP Domisili Gunung Sari: {data.isGunungSariResident ? "Ya" : "Tidak"}
        </Text>
      </View>
    </View>
  );
}
