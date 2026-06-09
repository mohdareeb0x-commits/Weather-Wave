import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { envVar, getCache, saveCache } from "./cacheService";

const [refreshing, setRefreshing] = useState(false);
// const current_key = 

const loadData = async (isRefresh = false) => {
  try {
    if (isRefresh) {
        await Promise.all([
            AsyncStorage.removeItem(envVar.currentKey),
            AsyncStorage.removeItem(envVar.hourlyKey),
            AsyncStorage.removeItem(envVar.geocodeKey),
        ])
    }
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
  } catch (err) {}
};
