import {
  View,
  Text,
  Button,
  TextInput,
  Switch,
  ScrollView,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import API_BASE_URL from "@/config";

interface FormData {
  fullname: string;
  occupancy: string;
  street: string;
  blockAndNumber: string;
  totalPeople: number;
  adultsMale: number;
  adultsFemale: number;
  kidsMale: number;
  kidsFemale: number;
  isGunungSariResident: boolean;
}

export default function DataEntryScreen() {
  const [loading, setLoading] = useState(false);
  const defaultFormValues = {
    fullname: "",
    occupancy: "",
    street: "",
    blockAndNumber: "",
    totalPeople: 0,
    adultsMale: 0,
    adultsFemale: 0,
    kidsMale: 0,
    kidsFemale: 0,
    isGunungSariResident: false,
  };
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: defaultFormValues });

  const occupancyStatus = watch("occupancy");
  const isHouseEmpty = occupancyStatus === "kosong";

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found.");
      }

      const submissionData = {
        ...data,
        adults: {
          total: (data.adultsMale || 0) + (data.adultsFemale || 0),
          male: data.adultsMale,
          female: data.adultsFemale,
        },
        kids: {
          total: (data.kidsMale || 0) + (data.kidsFemale || 0),
          male: data.kidsMale,
          female: data.kidsFemale,
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/data`,
        submissionData,
        {
          headers: { "x-auth-token": token },
        }
      );

      window.alert("Sukses! Data berhasil disimpan");
      reset();
    } catch (error) {
      console.error(error);
      window.alert(`Error!\nGagal Menyimpan Data.\n\n${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20 }}
      className="flex-1 bg-gray-200"
    >
      <View className="flex-row justify-start items-center md:space-x-4 space-x-2 mb-6">
        <Pressable onPress={() => router.replace("/home")}>
          <MaterialIcons name="arrow-circle-left" size={32} color="black" />
        </Pressable>
        <Text className="text-2xl md:text-3xl font-bold text-center">
          Formulir Data Penduduk
        </Text>
      </View>

      <View>
        <Text className="text-lg font-bold mt-4 mb-2">Nama Lengkap</Text>
        <Controller
          control={control}
          name="fullname"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={
                errors.fullname
                  ? "border-red-500 bg-red-200 border w-full h-12 rounded-md px-4 outline-none"
                  : "border-gray-500 bg-gray-200 border w-full h-12 rounded-md px-4 outline-none"
              } // original style = "w-full h-12 border border-gray-300 rounded-md px-4"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.fullname && (
          <Text className="text-red-500">Nama wajib diisi.</Text>
        )}

        <Text className="text-lg font-bold mt-4 mb-2">Status Hunian</Text>
        <Controller
          control={control}
          name="occupancy"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                className={
                  errors.occupancy
                    ? "border-red-500 bg-red-200 border w-full h-12 rounded-md px-4 outline-none"
                    : "border-gray-500 bg-gray-200 border w-full h-12 rounded-md px-4 outline-none"
                }
              >
                <Picker.Item label="Pilih Salah Satu" value="" />
                <Picker.Item label="Pemilik" value="pemilik" />
                <Picker.Item label="Sewa/Indekos" value="penyewa" />
                <Picker.Item label="Kosong" value="kosong" />
              </Picker>
              {errors.occupancy && (
                <Text className="text-red-500">
                  Status Hunian Wajib Dipilih
                </Text>
              )}
            </View>
          )}
        />

        <Text className="text-lg font-bold mt-4 mb-2">Jalan dan Blok</Text>
        <View className="flex-row justify-between md:justify-start">
          <View>
            <Controller
              control={control}
              name="street"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <View className="border border-gray-300 rounded-md">
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    className={
                      errors.street
                        ? "border-red-500 bg-red-200 border w-full h-12 rounded-md px-4 outline-none"
                        : "border-gray-500 bg-gray-200 border w-full h-12 rounded-md px-4 outline-none"
                    }
                  >
                    <Picker.Item label="Pilih Salah Satu" value="" />
                    <Picker.Item label="Jalan Mawar" value="Mawar" />
                    <Picker.Item label="Jalan Edelweis" value="Edelweis" />
                    <Picker.Item label="Jalan Pinus" value="Pinus" />
                  </Picker>
                </View>
              )}
            />
            {errors.street && (
              <Text className="text-red-500">Nama Jalan Wajib Dipilih</Text>
            )}
          </View>
          <View className="">
            <Controller
              control={control}
              name="blockAndNumber"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={
                    errors.blockAndNumber
                      ? "border-red-500 bg-red-200 border w-full h-12 rounded-md px-4 outline-none"
                      : "border-gray-500 bg-gray-200 border w-full h-12 rounded-md px-4 outline-none"
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Contoh: C28 No. 26"
                />
              )}
            />
            {errors.blockAndNumber && (
              <Text className="text-red-500">Nomor dan Blok Wajib Diisi</Text>
            )}
          </View>
        </View>
        {/* Detail of People in the house */}
        <View className="p-2 border border-white rounded-md mt-4 bg-slate-200 shadow-md">
          <View className="flex-row justify-center items-center space-x-4 mb-2">
            <Text className="text-lg font-bold">Total Penghuni</Text>
            <Controller
              control={control}
              name="totalPeople"
              rules={{ required: !isHouseEmpty }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="h-12 border border-gray-300 rounded-md px-2 w-14 text-center text-lg"
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  value={isHouseEmpty ? "0" : value?.toString()}
                  keyboardType="numeric"
                  editable={!isHouseEmpty}
                  style={{ backgroundColor: isHouseEmpty ? "#e5e7eb" : "#fff" }}
                />
              )}
            />
          </View>

          {/* Detail of people living in the house */}
          <Text className="text-md md:text-xs font-medium text-center outline outline-gray-300 rounded-sm outline-1 mb-1">
            Detail total penghuni
          </Text>

          <View className="flex-row justify-between">
            {/* Dewasa */}
            <View className="flex-1 border border-gray-300 bg-gray-100 px-2 pb-2 rounded-md">
              <Text className="text-md font-bold mt-2 mb-2 text-center">
                Dewasa
              </Text>
              <View className="flex-row justify-between space-x-2">
                <View className="flex-1">
                  <Text className="text-xs text-center">Pria</Text>
                  <Controller
                    control={control}
                    name="adultsMale"
                    rules={{ required: !isHouseEmpty }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        className="h-12 border border-gray-300 rounded-md px-4 text-center"
                        onChangeText={(text) => onChange(parseInt(text) || 0)}
                        value={isHouseEmpty ? "0" : value?.toString()}
                        keyboardType="numeric"
                        editable={!isHouseEmpty}
                        style={{
                          backgroundColor: isHouseEmpty ? "#e5e7eb" : "#fff",
                        }}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-center">Wanita</Text>
                  <Controller
                    control={control}
                    name="adultsFemale"
                    rules={{ required: !isHouseEmpty }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        className="h-12 border border-gray-300 rounded-md px-4 text-center"
                        onChangeText={(text) => onChange(parseInt(text) || 0)}
                        value={isHouseEmpty ? "0" : value?.toString()}
                        keyboardType="numeric"
                        editable={!isHouseEmpty}
                        style={{
                          backgroundColor: isHouseEmpty ? "#e5e7eb" : "#fff",
                        }}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
          {/* Anak-anak */}
          <View className="flex-1 border border-gray-300 bg-gray-100 px-2 pb-2 rounded-md">
            <Text className="text-md font-bold mt-2 mb-2 text-center">
              Anak-Anak
            </Text>
            <View className="flex-row justify-between space-x-2">
              <View className="flex-1">
                <Text className="text-xs text-center">Laki-laki</Text>
                <Controller
                  control={control}
                  name="kidsMale"
                  rules={{ required: !isHouseEmpty }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="h-12 border border-gray-300 rounded-md px-4 text-center"
                      onChangeText={(text) => onChange(parseInt(text) || 0)}
                      value={isHouseEmpty ? "0" : value?.toString()}
                      keyboardType="numeric"
                      editable={!isHouseEmpty}
                      style={{
                        backgroundColor: isHouseEmpty ? "#e5e7eb" : "#fff",
                      }}
                    />
                  )}
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-center">Perempuan</Text>
                <Controller
                  control={control}
                  name="kidsFemale"
                  rules={{ required: !isHouseEmpty }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="h-12 border border-gray-300 rounded-md px-4 text-center "
                      onChangeText={(text) => onChange(parseInt(text) || 0)}
                      value={isHouseEmpty ? "0" : value?.toString()}
                      keyboardType="numeric"
                      editable={!isHouseEmpty}
                      style={{
                        backgroundColor: isHouseEmpty ? "#e5e7eb" : "#fff",
                      }}
                    />
                  )}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Check for National ID requirement */}
        <View className="flex-row items-center space-x-2 mt-4 mb-2">
          <Text className="text-lg font-bold">
            Apakah KTP tercatat di Desa Gunung Sari ?
          </Text>
          <Controller
            control={control}
            name="isGunungSariResident"
            render={({ field: { onChange, value } }) => (
              <Switch onValueChange={onChange} value={value} />
            )}
          />
        </View>
      </View>

      <View className="mt-8">
        <Button
          title={loading ? "Menyimpan ..." : "Simpan Data"}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}
