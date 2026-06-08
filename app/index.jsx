import { Image, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import SmallCard from "@/components/SmallCard";
import LoadingScreen from "@/components/LoadingScreen";
import MainCard from "@/components/MainCard";
import fetchWeatherCurrent, { fetchWeatherHourly } from "@/services/api";
import { weatherIconsDay, weatherIconsNight } from "@/services/wetherCode"

export default function Index() {
  const [location, setLocation] = useState(null);
  const [geocode, setGeocode] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const now = new Date();
  const currentHour = now.getHours();
  const iconPack = currentWeather?.isDay ? weatherIconsDay : weatherIconsNight;
  const wCode = currentWeather?.weatherCode;
  const weatherIcon = iconPack[wCode] ?? {label: "Clear Sky", icon: "clearDay"};
  console.log("weather icon ", weatherIcon)

  console.log("current hour:", currentHour)

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
    fetchWeatherCurrent(location.coords.latitude, location.coords.longitude).then(
      (data) => setCurrentWeather(data),
    );
  }, [location]);

  useEffect(() => {
    if (!location) return;
    fetchWeatherHourly(location.coords.latitude, location.coords.longitude).then(
      (data) => setHourlyWeather(data),
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
      <LoadingScreen />
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
        <MainCard weather={currentWeather} geocode={geocode} icon={icons[weatherIcon.icon]} />
        <View className="flex-row self-center justify-between w-10/12">
          <SmallCard
            icon={icons.wind}
            value={Math.round(currentWeather?.windspeed)}
            unit="kph"
            size="size-5 w-7"
            text="Wind Speed"
          />
          <SmallCard
            icon={icons.humidity}
            value={Math.round(currentWeather?.humidity)}
            unit="%"
            size="size-6"
            text="Humidity"
          />
        </View>
        <View className="flex-row self-center justify-between w-10/12">
          <SmallCard
            icon={icons.visibility}
            value={Math.round((hourlyWeather?.visibility[currentHour])/1000)}
            unit="km"
            size="size-6"
            text="Visibility"
          />
          <SmallCard
            icon={icons.thermometer}
            value={Math.round(currentWeather?.apparentTemp)}
            unit={`\u00B0`}
            size="size-6"
            text="Feels Like"
          />
        </View>
        <View className="flex-row self-center justify-between w-10/12">
          <SmallCard
            icon={icons.uv}
            value={Math.round(currentWeather?.uv)}
            unit="Weak"
            size="size-6"
            text="UV"
          />
          <SmallCard
            icon={icons.air}
            value={Math.round(currentWeather?.airPressure)}
            unit="hPa"
            size="size-6 w-9"
            text="Air Pressure"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
