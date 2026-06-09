import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useEffect, useState } from "react";
import { saveCache, getCache } from "@/services/cacheService";
import * as Location from "expo-location";
import SmallCard from "@/components/SmallCard";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/ErrorScreen";
import MainCard from "@/components/MainCard";
import fetchWeatherCurrent, { fetchWeatherHourly } from "@/services/api";
import checkInternet from "@/services/checkInternet";
import { weatherIconsDay, weatherIconsNight } from "@/constants/weatherCode";

export default function Index() {
  const [location, setLocation] = useState(null);
  const [geocode, setGeocode] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requirementErrors, setReqError] = useState(false);

  const now = new Date();
  const currentHour = now.getHours();

  const iconPack = currentWeather?.isDay ? weatherIconsDay : weatherIconsNight;
  const wCode = currentWeather?.weatherCode;
  const weatherIcon = iconPack[wCode] ?? {
    label: "Clear Sky",
    icon: "clearDay",
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setReqError("location-error");
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (error) {
        console.log(error);
        setReqError("location-error");
      }
    })();
  }, []);

  useEffect(() => {
    if (!location) return;
    const load = async () => {
      try {
        const [cachedCurrent, cachedHourly, cachedGeocode] = await Promise.all([
          getCache("currentWeather"),
          getCache("hourlyWeather"),
          getCache("geocode"),
        ]);

        const hasInternet = await checkInternet();
        if (!hasInternet) {
          setReqError("internet-error");
          return;
        }

        const [freshCurrent, freshHourly, freshGeocode] = await Promise.all([
          cachedCurrent
            ? null
            : fetchWeatherCurrent(
                location.coords.latitude,
                location.coords.longitude,
              ),
          cachedHourly
            ? null
            : fetchWeatherHourly(
                location.coords.latitude,
                location.coords.longitude,
              ),
          cachedGeocode
            ? null
            : Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }),
        ]);

        try {
          if (freshCurrent) saveCache("currentWeather", freshCurrent);
          if (freshHourly) saveCache("hourlyWeather", freshHourly);
          if (freshGeocode) saveCache("geocode", freshGeocode[0]);
        } catch (error) {
          console.log("NEW CACHE ERROR");
        }

        setCurrentWeather(cachedCurrent ?? freshCurrent);
        setHourlyWeather(cachedHourly ?? freshHourly);
        setGeocode(cachedGeocode ?? freshGeocode[0]);
        setLoading(false);
      } catch (error) {
        console.log("NEW ERROR", error);
        setReqError("fetch-error");
      }
    };
    load();
  }, [location]);

  if (loading && !requirementErrors) {
    return <LoadingScreen />;
  }

  if (requirementErrors === "internet-error") {
    return <ErrorScreen text="No internet connection" />;
  } else if (requirementErrors === "location-error") {
    return <ErrorScreen text="Please enable your location" />;
  } else if (requirementErrors === "fetch-error") {
    return <ErrorScreen text="Internal server error" />;
  }

  let uv = "";
  if (currentWeather?.uv <= 2) {
    uv = "Very Weak";
  } else if (currentWeather?.uv >= 3 && currentWeather?.uv <= 6) {
    uv = "Weak";
  } else if (currentWeather?.uv >= 7 && currentWeather?.uv <= 10) {
    uv = "Strong";
  } else if (currentWeather?.uv >= 11) {
    uv = "Very Strong";
  }

  return (
    <SafeAreaView className="flex-1 items-center bg-black">
      <Image
        source={images.bg}
        resizeMode="cover"
        className="absolute w-full h-full z-0"
      />
      <ScrollView className="w-full">
        <MainCard
          weather={currentWeather}
          geocode={geocode}
          icon={icons[weatherIcon.icon]}
          label={weatherIcon.label}
        />
        <View className="flex-row self-center justify-between w-10/12">
          <SmallCard
            icon={icons.uv}
            value={Math.round(currentWeather?.uv)}
            unit={uv}
            size="size-6"
            text="UV"
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
            icon={icons.humidity}
            value={Math.round(currentWeather?.humidity)}
            unit="%"
            size="size-6"
            text="Humidity"
          />
          <SmallCard
            icon={icons.wind}
            value={Math.round(currentWeather?.windspeed)}
            unit="kph"
            size="size-5 w-7"
            text="Wind Speed"
          />
        </View>
        <View className="flex-row self-center justify-between w-10/12">
          <SmallCard
            icon={icons.air}
            value={Math.round(currentWeather?.airPressure)}
            unit="hPa"
            size="size-6 w-9"
            text="Air Pressure"
          />
          <SmallCard
            icon={icons.visibility}
            value={Math.round(hourlyWeather?.visibility[currentHour] / 1000)}
            unit="km"
            size="size-6"
            text="Visibility"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
