import AsyncStorage from "@react-native-async-storage/async-storage";

export const envVar = {
  currentKey: process.env.EXPO_PUBLIC_CACHE_CURRENT_WEATHER_KEY,
  hourlyKey: process.env.EXPO_PUBLIC_CACHE_HOURLY_WEATHER_KEY,
  geocodeKey: process.env.EXPO_PUBLIC_CACHE_GEOCODE_KEY,
};

const CACHE_CONFIG = {
  currentWeather: {
    key: envVar.currentKey,
    duration: process.env.EXPO_PUBLIC_CACHE_CURRENT_WEATHER_DURATION,
  },
  hourlyWeather: {
    key: envVar.hourlyKey,
    duration: process.env.EXPO_PUBLIC_CACHE_HOURLY_WEATHER_DURATION,
  },
  geocode: {
    key: envVar.geocodeKey,
    duration: process.env.EXPO_PUBLIC_CACHE_GEOCODE_DURATION,
  },
};

export const saveCache = async (type, data) => {
  try {
    const { key } = CACHE_CONFIG[type];
    const payload = { timestamp: Date.now(), data };
    await AsyncStorage.setItem(key, JSON.stringify(payload));
  } catch {
    return null;
  }
};

export const getCache = async (type) => {
  try {
    const { key, duration } = CACHE_CONFIG[type];
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp > duration) return null;
    console.log("duration", Date.now() - timestamp);

    return data;
  } catch {
    return null;
  }
};
