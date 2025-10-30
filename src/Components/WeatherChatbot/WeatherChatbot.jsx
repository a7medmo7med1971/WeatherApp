import React, { useState } from "react";
import axios from "axios";

/**
 * 🤖 Chatbot عائم للطقس
 * يظهر كأيقونة في الزاوية السفلية اليمنى
 * يفتح ويغلق بالضغط على الزر
 * يدعم العربية والإنجليزية في أسماء المدن
 */
export default function FloatingWeatherChatbot() {
  // ✅ State للتحكم في فتح/إغلاق الشات
  const [isOpen, setIsOpen] = useState(false);
  
  // ✅ State لحفظ الرسائل (الافتراضي: رسالة ترحيب)
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "👋 مرحبًا! أنا مساعد المناخ الذكي.\n\nاسألني عن حالة الطقس في أي مدينة 🌍\n\nمثال:\n• الطقس في القاهرة\n• Weather in London\n• حالة الجو في الإسكندرية" 
    },
  ]);
  
  // ✅ State لحفظ النص الذي يكتبه المستخدم
  const [input, setInput] = useState("");
  
  // ✅ State للتحكم في حالة التحميل
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 🔄 دالة إرسال الرسالة وجلب بيانات الطقس
   */
  const handleSend = async () => {
    // ❌ إذا كان الحقل فارغ، لا نفعل شيء
    if (!input.trim()) return;

    // 📝 إضافة رسالة المستخدم للمحادثة
    const userMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // 🧹 تفريغ حقل الإدخال
    setInput("");
    
    // ⏳ تفعيل حالة التحميل
    setIsLoading(true);

    try {
      // 🔍 استخراج اسم المدينة من السؤال
      // يبحث عن الكلمات بعد "في" أو "في" باللغة العربية
      // أو بعد "in" باللغة الإنجليزية
      let city = "";
      
      // محاولة استخراج المدينة بالعربي
      const arabicMatch = input.match(/في\s+(.+)/i);
      if (arabicMatch) {
        city = arabicMatch[1].trim();
      }
      
      // محاولة استخراج المدينة بالإنجليزي
      const englishMatch = input.match(/in\s+(.+)/i);
      if (englishMatch) {
        city = englishMatch[1].trim();
      }
      
      // إذا لم يتم العثور على مدينة، نستخدم القاهرة كافتراضي
      if (!city) {
        // محاولة أخيرة: إذا كان السؤال يحتوي على كلمات معينة
        const weatherWords = ["طقس", "weather", "جو", "حالة"];
        const hasWeatherWord = weatherWords.some(word => input.toLowerCase().includes(word));
        
        if (hasWeatherWord) {
          // نأخذ آخر كلمة كاسم المدينة
          const words = input.trim().split(/\s+/);
          city = words[words.length - 1];
        } else {
          city = "القاهرة";
        }
      }

      // 🌍 Step 1: جلب إحداثيات المدينة من Geocoding API
      // هذا الـ API يحول اسم المدينة إلى إحداثيات (latitude, longitude)
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ar`
      );

      // ❌ إذا لم يتم العثور على المدينة
      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        setMessages([
          ...newMessages,
          { 
            sender: "bot", 
            text: `❌ عذرًا، لم أتمكن من العثور على المدينة "${city}"\n\nتأكد من كتابة الاسم بشكل صحيح وحاول مرة أخرى 🔍` 
          }
        ]);
        setIsLoading(false);
        return;
      }

      // ✅ استخراج بيانات المدينة
      const { latitude, longitude, name, country } = geoRes.data.results[0];

      // 🌤️ Step 2: جلب بيانات الطقس من Open-Meteo API
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`
      );

      // 📊 استخراج البيانات من الاستجابة
      const current = weatherRes.data.current_weather;
      const daily = weatherRes.data.daily;

      const temp = current.temperature; // الحرارة الحالية
      const wind = current.windspeed; // سرعة الرياح الحالية
      const windDirection = current.winddirection; // اتجاه الرياح
      const max = daily.temperature_2m_max[0]; // أعلى حرارة اليوم
      const min = daily.temperature_2m_min[0]; // أقل حرارة اليوم
      const rain = daily.precipitation_sum[0]; // كمية الأمطار المتوقعة
      const maxWind = daily.windspeed_10m_max[0]; // أقصى سرعة رياح

      // 🎨 تحديد emoji حسب حالة الطقس
      let weatherEmoji = "🌤️";
      if (rain > 5) weatherEmoji = "🌧️";
      else if (rain > 0) weatherEmoji = "🌦️";
      else if (temp > 35) weatherEmoji = "🌡️";
      else if (temp < 10) weatherEmoji = "❄️";

      // 📝 تكوين الرسالة النهائية
      const reply = `${weatherEmoji} الطقس في ${name}, ${country}

🌡️ **الحرارة:**
• الآن: ${temp}°C
• العظمى: ${max}°C
• الصغرى: ${min}°C

💨 **الرياح:**
• السرعة: ${wind} كم/س
• الاتجاه: ${windDirection}°
• الأقصى: ${maxWind} كم/س

☔ **الأمطار:**
• المتوقعة اليوم: ${rain} ملم

${rain > 0 ? "⚠️ لا تنسى المظلة!" : "☀️ يوم جميل!"}`;

      // ✅ إضافة رد البوت للمحادثة
      setMessages([...newMessages, { sender: "bot", text: reply }]);

    } catch (err) {
      // ❌ في حالة حدوث خطأ
      console.error("خطأ في جلب البيانات:", err);
      setMessages([
        ...newMessages,
        { 
          sender: "bot", 
          text: "⚠️ عذرًا، حدث خطأ أثناء جلب بيانات الطقس.\n\nحاول مرة أخرى بعد قليل 🔄" 
        }
      ]);
    } finally {
      // ✅ إيقاف حالة التحميل
      setIsLoading(false);
    }
  };

  /**
   * 🔄 دالة تبديل حالة فتح/إغلاق الشات
   */
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 💬 نافذة الشات - تظهر عند isOpen = true */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[90vw] sm:w-96 bg-white rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden animate-slideUp">
          {/* 🎨 رأس الشات */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">مساعد المناخ الذكي</h3>
                  <p className="text-xs text-blue-100">Online • جاهز للمساعدة</p>
                </div>
              </div>
              {/* ❌ زر الإغلاق */}
              <button
                onClick={toggleChat}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 💬 منطقة الرسائل */}
          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-50 to-white">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* ⏳ مؤشر التحميل */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ⌨️ منطقة الإدخال */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                placeholder="اكتب سؤالك هنا..."
                disabled={isLoading}
                className="flex-1 p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-all text-sm disabled:bg-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              اضغط Enter للإرسال
            </p>
          </div>
        </div>
      )}

      {/* 🔘 زر فتح الشات العائم */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 sm:right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-blue-500/50 group"
      >
        {isOpen ? (
          // ❌ أيقونة الإغلاق
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // 💬 أيقونة الشات
          <div className="relative">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {/* 🔴 نقطة الإشعار */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>

      {/* 🎨 CSS Animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}