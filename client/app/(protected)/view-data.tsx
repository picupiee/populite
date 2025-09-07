import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DataEntry {
  _id: string;
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

export default function ViewDataScreen() {
  const [data, setData] = useState<DataEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        const response = await axios.get<DataEntry[]>(
          `http://192.168.1.5:5000/api/data`,
          { headers: { "x-auth-token": token } }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error Fetching Data :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-semibold">
          Tidak ada data yang tersedia
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-semibold underline underline-offset-4 mb-6 text-center">
        Data Penduduk
      </Text>

      {/* Table Header */}
      <View className="flex-row bg-gray-200 py-3 rounded-t-lg">
        <Text className="flex-1 text-center font-bold">Nama</Text>
        <Text className="flex-1 text-center font-bold">Alamat</Text>
        <Text className="flex-1 text-center font-bold">Status Hunian</Text>
        <Text className="flex-1 text-center font-bold">Total Penghuni</Text>
      </View>
      {/* Table Row */}
      {data.map((item, index) => (
        <View
          key={item._id}
          className={`flex-row border-b border-gray-300 py-3 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
        >
          <Text className="flex-1 text-center">{item.fullname}</Text>
          <Text className="flex-1 text-center">{item.street}</Text>
          <Text className="flex-1 text-center">{item.occupancy}</Text>
          <Text className="flex-1 text-center">{item.totalPeople}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
