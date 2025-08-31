const svgIcons = {
  0: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/clear-day.svg",
  1: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/clear-day.svg",
  2: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/partly-cloudy-day.svg",
  3: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/overcast-day.svg",
  45: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/fog-day.svg",
  48: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/fog-day.svg",
  51: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/overcast-day-drizzle.svg",
  53: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/drizzle.svg",
  55: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/drizzle.svg",
  56: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/drizzle.svg",
  57: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/drizzle.svg",
  61: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/overcast-day-rain.svg",
  63: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/rain.svg",
  65: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/extreme-rain.svg",
  66: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/rain.svg",
  67: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/rain.svg",
  71: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/partly-cloudy-day-snow.svg",
  73: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/snow.svg",
  75: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/extreme-snow.svg",
  77: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/snow.svg",
  80: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/partly-cloudy-day-rain.svg",
  81: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/rain.svg",
  82: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/extreme-rain.svg",
  85: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/snow.svg",
  86: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/snow.svg",
  95: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/thunderstorms-day.svg",
  96: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/thunderstorms-day.svg",
  99: "https://andi4000.github.io/weather-icons/production/monochrome/svg-static/thunderstorms-day.svg",
};

const pngIcons = {
  0: "https://buechele.cc/weather-icons/sun.png",
  1: "https://buechele.cc/weather-icons/sun.png",
  2: "https://buechele.cc/weather-icons/cloud_sun.png",
  3: "https://buechele.cc/weather-icons/cloud.png",
  45: "https://buechele.cc/weather-icons/cloud_wind.png",
  48: "https://buechele.cc/weather-icons/cloud_wind.png",
  51: "https://buechele.cc/weather-icons/rain0.png",
  53: "https://buechele.cc/weather-icons/rain0.png",
  55: "https://buechele.cc/weather-icons/rain0.png",
  56: "https://buechele.cc/weather-icons/rain0.png",
  57: "https://buechele.cc/weather-icons/rain0.png",
  61: "https://buechele.cc/weather-icons/rain1.png",
  63: "https://buechele.cc/weather-icons/rain1.png",
  65: "https://buechele.cc/weather-icons/rain2.png",
  66: "https://buechele.cc/weather-icons/rain1.png",
  67: "https://buechele.cc/weather-icons/rain1.png",
  71: "https://buechele.cc/weather-icons/snou.png",
  73: "https://buechele.cc/weather-icons/snou.png",
  75: "https://buechele.cc/weather-icons/snou.png",
  77: "https://buechele.cc/weather-icons/snou.png",
  80: "https://buechele.cc/weather-icons/rain0_sun.png",
  81: "https://buechele.cc/weather-icons/rain1.png",
  82: "https://buechele.cc/weather-icons/rain2.png",
  85: "https://buechele.cc/weather-icons/snou.png",
  86: "https://buechele.cc/weather-icons/snou.png",
  95: "https://buechele.cc/weather-icons/lightning.png",
  96: "https://buechele.cc/weather-icons/lightning.png",
  99: "https://buechele.cc/weather-icons/lightning.png",
};

export type WeatherData = {
  temperature: string;
  weatherIconSvg: string | undefined;
  weatherSmallIcon: string | undefined;
};

export async function getWeatherData(): Promise<WeatherData[]> {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=48.114394&longitude=11.350518&daily=weather_code,temperature_2m_max&forecast_days=3",
  );
  const data: {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    daily_units: {
      time: string;
      weather_code: string;
      temperature_2m_max: string;
    };
    daily: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
    };
  } = await response.json();

  return data.daily.temperature_2m_max.map((temp, i) => ({
    temperature: temp.toFixed(0),
    weatherIconSvg: svgIcons[data.daily.weather_code[i]],
    weatherSmallIcon: pngIcons[data.daily.weather_code[i]],
  }));
}
