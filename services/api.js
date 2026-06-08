import { fetchWeatherApi } from "openmeteo";

const fetchWeatherCurrent = async (latitude1, longitude1) => {
    const params = {
        latitude: latitude1,
        longitude: longitude1,
        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "wind_speed_10m",
            "apparent_temperature",
            "weather_code",
            "surface_pressure",
            "uv_index",
        ],
    }

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];

    const current = response.current();

    const weatherData = {
        temperature: current.variables(0).value(),
        humidity: current.variables(1).value(),
        windspeed: current.variables(2).value(),
        apparentTemp: current.variables(3).value(),
        weatherCode: current.variables(4).value(),
        airPressure: current.variables(5).value(),
        uv: current.variables(6).value(),
    }
    console.log(weatherData)
    return weatherData;

}
const fetchWeatherHourly = async (latitude1, longitude1) => {
    const params = {
        latitude: latitude1,
        longitude: longitude1,
        hourly: [
            "visibility"
        ],
        forecast_days: 1,
    }

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];

    const hourly = response.hourly();

    const weatherData = {
        visibility: hourly.variables(0).valuesArray(),
    }
    console.log(weatherData)
    return weatherData;
}

export default fetchWeatherCurrent;
export {fetchWeatherHourly};