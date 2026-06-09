import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_CONFIG = {
  currentWeather: { key: "cache_current_weather", duration: 10 * 60 * 1000 },
  hourlyWeather: { key: "cache_hourly_weather", duration: 60 * 60 * 1000 },
  geocode: { key: "cache_geocode", duration: 30 * 60 * 1000 },
};

export const saveCache = async (type, data) => {
  try {
    const { key } = CACHE_CONFIG[type];
    const payload = { timestamp: Date.now(), data };
    await AsyncStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
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
  } catch (error) {
    return null;
  }
};
