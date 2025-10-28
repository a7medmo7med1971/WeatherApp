import React, { useState } from 'react';

export default function DashboardGovsEgypt() {
  const [selectedGov, setSelectedGov] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const egyptGovernorates = [
  { name: "Cairo", lat: 30.0444, lon: 31.2357 },
  { name: "Giza", lat: 30.0131, lon: 31.2089 },
  { name: "Alexandria", lat: 31.2001, lon: 29.9187 },
  { name: "Qalyubia", lat: 30.4167, lon: 31.2000 },
  { name: "Monufia", lat: 30.4650, lon: 30.9310 },
  { name: "Gharbia", lat: 30.8667, lon: 31.0000 },
  { name: "Dakahlia", lat: 31.0409, lon: 31.3785 },
  { name: "Kafr El Sheikh", lat: 31.1107, lon: 30.9396 },
  { name: "Sharqia", lat: 30.7323, lon: 31.7147 },
  { name: "Damietta", lat: 31.4165, lon: 31.8133 },
  { name: "Port Said", lat: 31.2565, lon: 32.2841 },
  { name: "Ismailia", lat: 30.5830, lon: 32.2654 },
  { name: "Suez", lat: 29.9668, lon: 32.5498 },
  { name: "Beni Suef", lat: 29.0661, lon: 31.0994 },
  { name: "Fayoum", lat: 29.3084, lon: 30.8428 },
  { name: "Minya", lat: 28.1099, lon: 30.7503 },
  { name: "Assiut", lat: 27.1800, lon: 31.1837 },
  { name: "Sohag", lat: 26.5590, lon: 31.6957 },
  { name: "Qena", lat: 26.1551, lon: 32.7160 },
  { name: "Luxor", lat: 25.6872, lon: 32.6396 },
  { name: "Aswan", lat: 24.0889, lon: 32.8998 },
  { name: "Red Sea", lat: 26.9845, lon: 33.9616 },
  { name: "New Valley", lat: 25.4448, lon: 28.5559 },
  { name: "Matrouh", lat: 31.3543, lon: 27.2373 },
  { name: "North Sinai", lat: 30.6060, lon: 33.6176 },
  { name: "South Sinai", lat: 28.2416, lon: 33.6176 },
  { name: "Beheira", lat: 30.8278, lon: 30.5256 },
];

  const fetchWeatherData = async (gov) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${gov.lat}&longitude=${gov.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&timezone=auto&forecast_days=16`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data.current_weather);
      setForecastData(data.daily);
      setSelectedGov(gov);
    } catch (err) {
      setError('فشل في جلب البيانات. حاول مرة أخرى.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '☁️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌨️';
    if (code <= 82) return '🌧️';
    if (code <= 86) return '🌨️';
    return '⛈️';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Weather forecasts - Egypt’s governorates</h1>
              <p className="text-blue-100 mt-1"> Live and updated data for all governorates </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Governorates Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
          Select Governorate
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {egyptGovernorates.map((gov) => (
              <button
                key={gov.name}
                onClick={() => fetchWeatherData(gov)}
                className={`p-4 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                  selectedGov?.name === gov.name
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 shadow-md'
                }`}
              >
                {gov.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent absolute top-0"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Weather Dashboard */}
        {!loading && weatherData && forecastData && (
          <div className="space-y-6">
            {/* Current Weather Card */}
            <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl shadow-2xl p-8 text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold mb-2">{selectedGov.name}</h2>
                  <p className="text-blue-100">Current Weather</p>
                </div>
                <div className="text-6xl">{getWeatherIcon(weatherData.weathercode)}</div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                  <p className="text-blue-100 text-sm mb-1">Temperature</p>
                  <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                  <p className="text-blue-100 text-sm mb-1">Wind Speed</p>
                  <p className="text-3xl font-bold">{weatherData.windspeed} km/h</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                  <p className="text-blue-100 text-sm mb-1">Wind Direction</p>
                  <p className="text-3xl font-bold">{weatherData.winddirection}°</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                  <p className="text-blue-100 text-sm mb-1">Time</p>
                  <p className="text-xl font-bold">{new Date(weatherData.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>

            {/* 16 Days Forecast */}
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
               Next 16 Days Forecast
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {forecastData.time.map((date, index) => (
                  <div
                    key={date}
                    className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      index === 0
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                        : 'bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50'
                    }`}
                  >
                    {index === 0 && (
                      <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                        Today
                      </div>
                    )}
                    
                    <div className="text-center">
                      <p className={`font-bold mb-2 ${index === 0 ? 'text-white' : 'text-gray-700'}`}>
                        {formatDate(date)}
                      </p>
                      
                      <div className="text-5xl my-3">
                        {getWeatherIcon(forecastData.weathercode[index])}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${index === 0 ? 'text-blue-100' : 'text-gray-600'}`}>
                            High
                          </span>
                          <span className={`font-bold text-lg ${index === 0 ? 'text-white' : 'text-red-600'}`}>
                            {Math.round(forecastData.temperature_2m_max[index])}°
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${index === 0 ? 'text-blue-100' : 'text-gray-600'}`}>
                            Low
                          </span>
                          <span className={`font-bold text-lg ${index === 0 ? 'text-white' : 'text-blue-600'}`}>
                            {Math.round(forecastData.temperature_2m_min[index])}°
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${index === 0 ? 'text-blue-100' : 'text-gray-600'}`}>
                            Rain
                          </span>
                          <span className={`font-bold ${index === 0 ? 'text-white' : 'text-gray-700'}`}>
                            {forecastData.precipitation_sum[index] || 0} mm
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${index === 0 ? 'text-blue-100' : 'text-gray-600'}`}>
                            Wind
                          </span>
                          <span className={`font-bold ${index === 0 ? 'text-white' : 'text-gray-700'}`}>
                            {Math.round(forecastData.windspeed_10m_max[index])} km/h
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-red-100 text-sm">Highest Expected Temperature</p>
                  <span className="text-3xl">🌡️</span>
                </div>
                <p className="text-4xl font-bold">
                  {Math.max(...forecastData.temperature_2m_max)}°C
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-100 text-sm">Lowest Expected Temperature</p>
                  <span className="text-3xl">❄️</span>
                </div>
                <p className="text-4xl font-bold">
                  {Math.min(...forecastData.temperature_2m_min)}°C
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-indigo-100 text-sm">Total Expected Rainfall</p>
                  <span className="text-3xl">🌧️</span>
                </div>
                <p className="text-4xl font-bold">
                  {forecastData.precipitation_sum.reduce((a, b) => a + (b || 0), 0).toFixed(1)} mm
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !weatherData && !error && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🌤️</div>
           <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Select a governorate to view the weather
          </h3>
          <p className="text-gray-600">
            Click on any governorate from the list above to see weather data and forecasts
          </p>
          </div>
        )}
      </div>
    </div>
  );
}