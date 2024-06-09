const { useState, useEffect } = React;

const WeatherModule = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
  
    useEffect(() => {
      const fetchWeatherData = async () => {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=48.1486&longitude=17.1077&current_weather=true&hourly=temperature_2m,weathercode,winddirection_10m,windspeed_10m,pressure_msl`
          );
          const data = await response.json();
          setWeatherData(data.current_weather);
          setForecastData(data.hourly);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };
  
      fetchWeatherData();
      const intervalId = setInterval(fetchWeatherData, 60000); // fetch every minute
      return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, []);
  
    const weatherCodeToIcon = (code, isNight) => {
      const iconMap = {
        0: isNight ? 'https://img.icons8.com/ios-filled/50/FFFFFF/moon.png' : 'https://img.icons8.com/ios-filled/50/FFFFFF/sun.png', // Clear sky
        1: isNight ? 'https://img.icons8.com/ios-filled/50/FFFFFF/moon.png' : 'https://img.icons8.com/ios-filled/50/FFFFFF/sun.png', // Mainly clear
        2: isNight ? 'https://img.icons8.com/ios-filled/50/FFFFFF/partly-cloudy-night.png' : 'https://img.icons8.com/ios-filled/50/FFFFFF/partly-cloudy-day.png', // Partly cloudy
        3: 'https://img.icons8.com/ios-filled/50/FFFFFF/cloud.png', // Overcast
        45: isNight ? 'https://img.icons8.com/ios-filled/50/FFFFFF/fog-night.png' : 'https://img.icons8.com/ios-filled/50/FFFFFF/fog-day.png', // Fog
        48: isNight ? 'https://img.icons8.com/ios-filled/50/FFFFFF/fog-night.png' : 'https://img.icons8.com/ios-filled/50/FFFFFF/fog-day.png', // Depositing rime fog
        51: 'https://img.icons8.com/ios-filled/50/FFFFFF/rain.png', // Drizzle: Light
        53: 'https://img.icons8.com/ios-filled/50/FFFFFF/rain.png', // Drizzle: Moderate
        55: 'https://img.icons8.com/ios-filled/50/FFFFFF/rain.png', // Drizzle: Dense intensity
        61: 'https://img.icons8.com/ios-filled/50/FFFFFF/rain.png', // Rain: Slight
        63: 'https://img.icons8.com/ios-filled/50/FFFFFF/rain.png', // Rain: Moderate
        65: 'https://img.icons8.com/ios-filled/50/FFFFFF/rain.png', // Rain: Heavy intensity
        80: 'https://img.icons8.com/ios-filled/50/FFFFFF/rain.png', // Showers: Slight
        81: 'https://img.icons8.com/ios-filled/50/FFFFFF/rain.png', // Showers: Moderate
        82: 'https://img.icons8.com/ios-filled/50/FFFFFF/rain.png', // Showers: Violent
        95: 'https://img.icons8.com/ios-filled/50/FFFFFF/storm.png', // Thunderstorm: Slight or moderate
        96: 'https://img.icons8.com/ios-filled/50/FFFFFF/storm.png', // Thunderstorm: With slight hail
        99: 'https://img.icons8.com/ios-filled/50/FFFFFF/storm.png', // Thunderstorm: With heavy hail
      };
      return iconMap[code] || 'https://img.icons8.com/ios-filled/50/FFFFFF/cloud.png'; // Default to cloud if code not found
    };
  
    const weatherCodeToDescription = (code) => {
      const descriptionMap = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        80: 'Slight showers',
        81: 'Moderate showers',
        82: 'Violent showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm / slight hail',
        99: 'Thunderstorm / heavy hail',
      };
      return descriptionMap[code] || 'Unknown';
    };
  
    if (!weatherData || !forecastData) {
      return <div>Loading...</div>;
    }
  
    const getDailyForecast = () => {
    const dailyData = [];
    const forecastTimes = forecastData.time.map(time => new Date(time));
  
    // Iterate over each day
    for (let i = 1; i <= 6; i++) {
      // Find the index for 12:00 PM of each day
      const middayIndex = forecastTimes.findIndex(time => 
        time.getDate() === new Date().getDate() + i && time.getHours() === 12
      );
  
      // Add the daily forecast data
      if (middayIndex !== -1) {
        dailyData.push({
          temperature: forecastData.temperature_2m[middayIndex],
          weathercode: forecastData.weathercode[middayIndex],
          date: forecastTimes[middayIndex]
        });
      }
    }
  
    return dailyData;
  };
  
  
    const getHourlyForecast = () => {
      const hourlyData = [];
      const currentHour = new Date().getHours();
      // Find the index of the next full hour
      const startHourIndex = forecastData.time.findIndex(time => new Date(time).getHours() > currentHour);
  
      // Get the next 8 hours of forecast data
      for (let i = startHourIndex; i < startHourIndex + 8; i++) {
        hourlyData.push({
          temperature: forecastData.temperature_2m[i],
          weathercode: forecastData.weathercode[i],
          time: new Date(forecastData.time[i])
        });
      }
      return hourlyData;
    };
  
    // Determine if it is currently night
    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour > 18;
    const currentPressureIndex = forecastData.time.findIndex(time => new Date(time).getHours() === currentHour);
    const currentPressure = forecastData.pressure_msl[currentPressureIndex];
  
    return (
      <div className="bg-gray-800 p-4 rounded-md">
        <h3 className="text-2xl mb-2">Bratislava, Slovakia</h3>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl">{Math.round(weatherData.temperature)}°</h2>
            <p className="flex items-center">
              <img src={weatherCodeToIcon(weatherData.weathercode, isNight)} alt="Weather Icon" className="w-6 h-6 mr-1" /> 
              {weatherCodeToDescription(weatherData.weathercode)}
            </p>
          </div>
          <div className="flex items-center">
            <img src="https://img.icons8.com/ios-filled/50/FFFFFF/windsock.png" alt="Wind" className="w-6 h-6 mr-1" />
            <p>{weatherData.winddirection}°/</p>
            <p>{Math.round(weatherData.windspeed * 1.94384)} kt</p>
          </div>
          <div className="flex items-center">
            <img src="https://img.icons8.com/ios-filled/50/FFFFFF/pressure.png" alt="Pressure" className="w-6 h-6 mr-1" />
            <p>{Math.round(currentPressure)} hPa</p>
          </div>
        </div>
  
        <div className="mt-4">
          <h3 className="text-xl">Forecast for next 8 hours</h3>
          <div className="grid grid-cols-8 gap-2">
            {getHourlyForecast().map((entry, index) => (
              <div key={index} className="text-center">
                <p>{entry.time.toLocaleTimeString("en-GB", { hour: "2-digit" })}</p>
                <img src={weatherCodeToIcon(entry.weathercode, entry.time.getHours() < 6 || entry.time.getHours() > 18)} alt="Weather Icon" className="w-6 h-6 mx-auto" />
                <p>{Math.round(entry.temperature)}°</p>
              </div>
            ))}
          </div>
        </div>
  
        <div className="mt-4">
          <h3 className="text-xl">Forecast for next 6 days</h3>
          <div className="grid grid-cols-6 gap-2">
            {getDailyForecast().map((entry, index) => (
              <div key={index} className="text-center">
                <p>{entry.date.toLocaleDateString("en-GB", { weekday: "short" })}</p>
                <img src={weatherCodeToIcon(entry.weathercode, false)} alt="Weather Icon" className="w-6 h-6 mx-auto" />
                <p>{Math.round(entry.temperature)}°</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    );
  };