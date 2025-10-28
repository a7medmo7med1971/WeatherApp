import React, { useState, useEffect } from 'react';
import { 
  Cloud, CloudRain, Wind, Droplets, Thermometer, Calendar, 
  MapPin, RefreshCw, Sun, CloudSnow, Loader 
} from 'lucide-react';

export default function WeatherDashboard() {
  // الحالة العامة للبيانات
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // الموقع الافتراضي (القاهرة)
  const [location, setLocation] = useState({ 
    lat: 31.231966249866918, 
    lon: 30.041802113997814 
  });

  // دالة لجلب بيانات الطقس من API
  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      // طلب من API لتوقع الطقس لمدة 16 يوم
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=16&timezone=auto`
      );
      
      if (!response.ok) throw new Error('Failed to fetch weather data');
      
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // جلب الموقع الجغرافي للمستخدم أول ما الصفحة تفتح
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchWeatherData(latitude, longitude);
        },
        () => {
          // لو المستخدم رفض تحديد الموقع، نستخدم القاهرة
          fetchWeatherData(location.lat, location.lon);
        }
      );
    } else {
      fetchWeatherData(location.lat, location.lon);
    }
  }, []);

  // تحديث البيانات يدويًا بزر "Refresh"
  const handleRefresh = () => {
    fetchWeatherData(location.lat, location.lon);
  };

  // تحديد شكل الأيقونة حسب حالة الطقس
  const getWeatherIcon = (weatherCode) => {
    if (weatherCode === 0) return <Sun className="w-12 h-12 text-yellow-400" />;
    if (weatherCode <= 3) return <Cloud className="w-12 h-12 text-gray-400" />;
    if (weatherCode <= 67) return <CloudRain className="w-12 h-12 text-blue-400" />;
    if (weatherCode <= 77) return <CloudSnow className="w-12 h-12 text-blue-300" />;
    return <Cloud className="w-12 h-12 text-gray-400" />;
  };

  // تنسيق التاريخ بطريقة بسيطة (مثلاً: Fri, Oct 28)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // لو البيانات لسه بتحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading weather data...</p>
        </div>
      </div>
    );
  }

  // لو حصل خطأ أثناء تحميل البيانات
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-center">
            <Cloud className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // بيانات الطقس الحالية واليومية
  const currentWeather = weatherData?.current_weather;
  const dailyData = weatherData?.daily;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* الهيدر */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather Dashboard</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Latitude: {location.lat.toFixed(4)}, Longitude: {location.lon.toFixed(4)}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* كارت الطقس الحالي */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                {getWeatherIcon(currentWeather.weathercode)}
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Current Temperature</p>
                <h2 className="text-6xl font-bold">{currentWeather.temperature}°C</h2>
                <p className="text-white/90 mt-2">Feels like {currentWeather.temperature}°C</p>
              </div>
            </div>
            
            {/* سرعة واتجاه الرياح */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-5 h-5" />
                  <span className="text-sm text-white/80">Wind Speed</span>
                </div>
                <p className="text-2xl font-bold">{currentWeather.windspeed} km/h</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-5 h-5" />
                  <span className="text-sm text-white/80">Wind Direction</span>
                </div>
                <p className="text-2xl font-bold">{currentWeather.winddirection}°</p>
              </div>
            </div>
          </div>
        </div>

        {/* البطاقات الإحصائية لليوم */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's High</h3>
              <div className="bg-red-100 p-3 rounded-lg">
                <Thermometer className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800">{dailyData.temperature_2m_max[0]}°C</p>
            <p className="text-gray-500 text-sm mt-2">Maximum temperature</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's Low</h3>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Thermometer className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800">{dailyData.temperature_2m_min[0]}°C</p>
            <p className="text-gray-500 text-sm mt-2">Minimum temperature</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Precipitation</h3>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Droplets className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800">{dailyData.precipitation_sum[0]} mm</p>
            <p className="text-gray-500 text-sm mt-2">Total rainfall today</p>
          </div>
        </div>

        {/* توقعات الطقس لمدة 16 يوم */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            16-Day Forecast
          </h2>

          {/* شبكة الأيام */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
            {dailyData.time.map((date, index) => (
              <div
                key={date}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105"
              >
                <p className="text-sm font-semibold text-gray-600 mb-2 text-center">
                  {formatDate(date)}
                </p>
                <div className="flex justify-center mb-3">
                  <Cloud className="w-8 h-8 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">High</span>
                    <span className="text-sm font-bold text-red-600">
                      {dailyData.temperature_2m_max[index]}°C
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Low</span>
                    <span className="text-sm font-bold text-blue-600">
                      {dailyData.temperature_2m_min[index]}°C
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Rain</span>
                    <span className="text-sm font-bold text-purple-600">
                      {dailyData.precipitation_sum[index]} mm
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
