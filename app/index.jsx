import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useEffect, useState } from "react";
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
  // const [locationReady, setLocationReady] = useState(true);
  // const [internetReady, setInternetReady] = useState(true);
  // const [fetchError, setFetchError] = useState(false);
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
      if (status !== "granted") return;

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch(error) {
        console.log(error)
        setReqError("location-error")
      }
    })();
  }, []);

  useEffect(() => {
    if (!location) return;
    const load = async () => {
      const hasInternet = await checkInternet();
      if (!hasInternet) {
        setReqError("internet-error");
        return;
      }

      try {
        const [currentData, hourlyData, geocode] = await Promise.all([
          fetchWeatherCurrent(
            location.coords.latitude,
            location.coords.longitude,
          ),
          fetchWeatherHourly(
            location.coords.latitude,
            location.coords.longitude,
          ),
          Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }),
        ]);
        setCurrentWeather(currentData);
        setHourlyWeather(hourlyData);
        setGeocode(geocode[0]);
        setLoading(false);
      } catch (error) {
        console.log("NEW ERROR", error);
        setReqError("fetch-error");
      }
    };
    load();
  }, [location]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!location) {
        setReqError("location-error");
      }
    }, 35 * 1000);
    return () => clearTimeout(timeout);
  }, [location]);

  if (loading && !requirementErrors) {
    return <LoadingScreen />;
  }

  if (requirementErrors == "internet-error") {
    return <ErrorScreen text="No internet connection" />;
  } else if (requirementErrors == "location-error") {
    return <ErrorScreen text="Please enable your location" />;
  } else if (requirementErrors == "fetch-error") {
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
