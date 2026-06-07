import { fetchWeatherApi } from "openmeteo";

const fetchWeather = async (latitude1, longitude1) => {
    const params = {
        latitude: latitude1,
        longitude: longitude1,
        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "wind_speed_10m",
        ]
    }

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];

    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
        `\nCoordinates: ${latitude}\u00B0N ${longitude}\u00B0E`,
        `\nElevation: ${elevation}m asl`,
        `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
    )

    const current = response.current();

    const weatherData = {
        temperature: current.variables(0).value(),
        humidity: current.variables(1).value(),
        windspeed: current.variables(2).value(),
    }

    return weatherData;
}

export default fetchWeather;