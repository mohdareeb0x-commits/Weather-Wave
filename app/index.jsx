import { Image, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import fetchWeather from "@/services/api";
import SmallCard from "@/components/SmallCard"

export default function Index() {
  const [location, setLocation] = useState(null);
  const [geocode, setGeocode] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      console.log(loc);
      setLocation(loc);
    })();
  }, []);

  useEffect(() => {
    if (!location) return;
    fetchWeather(location.coords.latitude, location.coords.longitude).then(
      (data) => setWeather(data),
    );
  }, [location]);

  useEffect(() => {
    if (!location) return;
    (async () => {
      const result = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log(result[0]);
      setGeocode(result[0]);
      setLoading(false);
    })();
  }, [location]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center bg-black">
        <Image
          source={images.bg}
          resizeMode="cover"
          className="absolute w-full h-full z-0"
        />
        <ActivityIndicator
          size="large"
          color="white"
          className="mt-20 self-center"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center bg-black">
      <Image
        source={images.bg}
        resizeMode="cover"
        className="absolute w-full h-full z-0"
      />
      <ScrollView className="w-full">
        <View className="h-auto w-10/12 bg-white/20 self-center items-center pt-4 mt-5 border-4 border-t-0 border-b-8 border-black/20 rounded-3xl">
          <View className="flex-row justify-center items-center">
            <Image
              source={icons.location}
              className="size-4 mr-1"
              tintColor="white"
            />
            <Text className="text-xl color-white font-poppins">
              {geocode?.city}
            </Text>
          </View>
          <View className="items-center">
            <Image source={icons.clearNight} className="size-32 w-44 h-42" />
            <Text className="text-6xl color-white font-poppins mb-5">
              {Math.round(weather?.temperature)}
              {`\u00B0`}
            </Text>
          </View>
        </View>
        <View className="flex-row self-center justify-between w-10/12">
          <SmallCard icon={icons.wind} />
          <SmallCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
