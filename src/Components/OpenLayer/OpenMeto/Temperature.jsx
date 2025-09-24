import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultControls, FullScreen, ScaleLine } from "ol/control";
import { Feature } from "ol";
import { Circle as CircleGeom, Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Fill, Stroke, Icon } from "ol/style";
import Overlay from "ol/Overlay";
import axios from "axios";
import Swal from "sweetalert2";
import shp from "shpjs";
// === fixed imports for jspdf + autotable ===
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
// ==========================================

// ✅ API لجلب بيانات الطقس
const getWeatherData = async (lon, lat) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    const res = await axios.get(url);
    const current = res.data.current_weather;
    const daily = res.data.daily;

    return {
      currentTemp: current.temperature,
      windspeed: current.windspeed,
      winddirection: current.winddirection,
      maxTemp: daily.temperature_2m_max[0],
      minTemp: daily.temperature_2m_min[0],
      // precipitation: daily.precipitation_sum ? daily.precipitation_sum[0] : 0,
      time: current.time,
    };
  } catch (err) {
    console.error("API Error:", err);
    return null;
  }
};

export default function WeatherMap() {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const mapObjRef = useRef({ map: null, overlay: null });

  const [coordinates, setCoordinates] = useState("");
  const [file, setFile] = useState(null);
  const [weatherDataList, setWeatherDataList] = useState([]); // بيانات لجميع النقاط (للـ PDF)

  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(new VectorLayer({ source: vectorSourceRef.current }));

  // === عرض الطقس لنقطة مختارة (يبقى كما في كودك) ===
  const showWeatherOnMap = async (lon, lat) => {
    const { map, overlay } = mapObjRef.current;
    if (!map) return;

    Swal.fire({
      title: "Loading weather...",
      html: "Please wait",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const weather = await getWeatherData(lon, lat);
    Swal.close();

    if (!weather) {
      Swal.fire("Error", "Failed to fetch weather data", "error");
      return;
    }

    // امسح المضلعات القديمه (مهم للحفاظ على سلوكك الأصلي)
    vectorSourceRef.current.clear();

    const center3857 = fromLonLat([lon, lat]);
    const bufferFeature = new Feature({ geometry: new CircleGeom(center3857, 50000) });
    bufferFeature.setStyle(
      new Style({
        fill: new Fill({ color: "rgba(0, 123, 255, 0.25)" }),
        stroke: new Stroke({ color: "#007bff", width: 2 }),
      })
    );

    vectorSourceRef.current.addFeature(bufferFeature);
    map.getView().animate({ center: center3857, zoom: 8 });

popupRef.current.innerHTML = `
  <div class="bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 w-72 transition-all duration-300">
    <h4 class="text-xl font-semibold mb-3 text-indigo-800 flex items-center gap-2">
 
      Weather Info
    </h4>
    <div class="space-y-2 text-gray-700">
      <p class="flex justify-between">
        <span class="font-medium text-gray-500">Current Temperature:</span> 
        <span class="text-gray-800">${weather.currentTemp}°C</span>
      </p>
      <p class="flex justify-between">
        <span class="font-medium text-gray-500">Temperature Max:</span> 
        <span class="text-red-500">${weather.maxTemp}°C</span>
      </p>
      <p class="flex justify-between">
        <span class="font-medium text-gray-500">Temperature Min:</span> 
        <span class="text-blue-500">${weather.minTemp}°C</span>
      </p>
      <p class="flex justify-between">
        <span class="font-medium text-gray-500"> windspeed:</span> 
        <span class="text-gray-800">${weather.windspeed} km/h (${weather.winddirection}°)</span>
      </p>
      <p class="flex justify-between">
        <span class="font-medium text-gray-500"> Time:</span> 
        <span class="text-gray-800">${weather.time}</span>
      </p>
    </div>
  </div>
`;
    overlay.setPosition(center3857);
  };
  // <p><b>Precip:</b> ${weather.precipitation} mm</p>
  // === رفع ملف Shapefile (zip) ===
  const handleFileUpload = (e) => setFile(e.target.files[0]);

  // === معالجة Shapefile وجلب بيانات الطقس لكل نقطة ===
  const handleProcessFile = async () => {
    if (!file) {
      Swal.fire("Warning", "Please upload a Shapefile (.zip)", "warning");
      return;
    }

    try {
      Swal.fire({ title: "Processing Shapefile", didOpen: () => Swal.showLoading() });
      const arrayBuffer = await file.arrayBuffer();
      const geojson = await shp(arrayBuffer);

      const allData = [];

      for (const feature of geojson.features) {
        // دعم حالات: بعض shapefiles قد تكون بالصيغة [lon, lat] أو [x,y]
        const [lon, lat] = feature.geometry.coordinates;
        const weather = await getWeatherData(lon, lat);
        if (weather) {
          const obj = {
            name: feature.properties?.name || feature.properties?.NAME || "Location",
            lon,
            lat,
            ...weather,
          };
          allData.push(obj);

          // أضف النقطة للخريطة (مثل كودك الأصلي)
          const pointFeature = new Feature({
            geometry: new Point(fromLonLat([lon, lat])),
            ...obj,
          });
          pointFeature.setStyle(
            new Style({
              image: new Icon({
                src: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
                scale: 0.05,
              }),
            })
          );
          vectorSourceRef.current.addFeature(pointFeature);
        }
      }

      setWeatherDataList(allData);
      Swal.close();
      Swal.fire("Done", "Points loaded successfully", "success");
    } catch (err) {
      console.error(err);
      Swal.close();
      Swal.fire("Error", "Failed to process shapefile", "error");
    }
  };

  // === تنزيل تقرير PDF (مصحح لاستخدام autoTable بشكل صحيح) ===
 const handleDownloadPDF = () => {
  if (!weatherDataList || weatherDataList.length === 0) {
    Swal.fire("Warning", "No weather data available to download", "warning");
    return;
  }

  try {
    const doc = new jsPDF();

    // 🎨 إعدادات العنوان
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185); // لون أزرق احترافي

    // 📝 العنوان في منتصف الصفحة
    doc.text("Temperature Report", doc.internal.pageSize.getWidth() / 2, 15, {
      align: "center",
    });

    // ➖ خط تحت العنوان
    doc.setDrawColor(150, 150, 150); // رمادي فاتح
    doc.setLineWidth(0.5);
    doc.line(14, 20, doc.internal.pageSize.getWidth() - 14, 20);

    // 📌 ارجع اللون الأسود الافتراضي للنصوص العادية
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    const head = [
      [
        "Name",
        "Lon",
        "Lat",
        "Current Temperature (°C)",
        "Max Temperature (°C)",
        "Min Temperature (°C)",
        "Wind Speed (km/h)",
      ],
    ];

    const body = weatherDataList.map((item) => [
      item.name || "Point",
      item.lon != null ? Number(item.lon).toFixed(4) : "",
      item.lat != null ? Number(item.lat).toFixed(4) : "",
      item.currentTemp != null ? item.currentTemp : "",
      item.maxTemp != null ? item.maxTemp : "",
      item.minTemp != null ? item.minTemp : "",
      item.windspeed != null ? item.windspeed : "",
      item.precipitation != null ? item.precipitation : "",
    ]);

    // استدعاء autoTable
    autoTable(doc, {
      head,
      body,
      startY: 25,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [220, 220, 220],
        lineWidth: 0.2,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      theme: "grid",
    });

    // 💾 تحميل الملف
    doc.save("weather_report.pdf");

    // ✅ رسالة نجاح
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your report has been downloaded",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (err) {
    console.error("PDF Error:", err);
    Swal.fire("Error", "Failed to generate PDF", "error");
  }
};


  // === إعداد الخريطة و overlay و الأحداث ===
useEffect(() => {
  const overlay = new Overlay({ element: popupRef.current, positioning: "bottom-center" });

  const map = new Map({
    target: mapRef.current,
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        }),
      }),
      vectorLayerRef.current,
    ],
    view: new View({ center: fromLonLat([30, 25]), zoom: 2 }),
    controls: defaultControls().extend([new FullScreen(), new ScaleLine()]),
    overlays: [overlay],
  });

  // ✅ إغلاق البوب أب عند الضغط على أي مكان فارغ
  map.on("click", (e) => {
    const feature = map.forEachFeatureAtPixel(e.pixel, (f) => f);
    if (!feature) {
      overlay.setPosition(undefined);
        vectorSourceRef.current.clear(); // مسح كل البافر والمضلعات
      
    }

  });

  // ✅ فتح بوب أب عند الضغط على نقطة
// ✅ فتح بوب أب عند الضغط على نقطة
map.on("singleclick", (e) => {
  map.forEachFeatureAtPixel(e.pixel, (feature) => {
    const props = feature.getProperties();
    if (props.name) {
      popupRef.current.innerHTML = `
        <div class="bg-white p-4 rounded-xl shadow-lg text-gray-700 w-64">
          <b>${props.name}</b><br>
          Current: ${props.currentTemp}°C<br>
          Max: ${props.maxTemp}°C | Min: ${props.minTemp}°C<br>
          Wind: ${props.windspeed} km/h (${props.winddirection}°)<br>
        </div>`;

      // 👇 خلي الخريطة تزوم وتتحرك للنقطة اللي دوست عليها
      const geometry = feature.getGeometry();
      const coord = geometry.getCoordinates();

      overlay.setPosition(coord);

      map.getView().animate({
        center: coord,
        zoom: 10,   // ممكن تزود أو تقلل حسب ما تحب
        duration: 800,
      });
    }
  });
});


  map.on("dblclick", async (e) => {
    const [lon, lat] = toLonLat(e.coordinate);
    await showWeatherOnMap(lon, lat);
  });

  mapObjRef.current = { map, overlay };
  return () => map.setTarget(null);
}, []);


const handleShowWeather = async () => {
  if (!coordinates.trim()) {
    Swal.fire("Warning", "Please enter coordinates", "warning");
    return;
  }

  // 👇 نفصل بأي فاصل (مسافة أو فاصلة أو الاتنين)
  const parts = coordinates.split(/[\s,]+/).map((s) => Number(s.trim()));

  if (parts.length < 2 || parts.some(isNaN)) {
    Swal.fire("Error", "Enter valid coordinates (lon,lat)", "error");
    return;
  }

  let [first, second] = parts;

  // 👇 منطق التمييز بين lat/lon:
  // خطوط العرض (lat) لازم تكون ما بين -90 و +90
  // خطوط الطول (lon) لازم تكون ما بين -180 و +180
  let lat, lon;

  if (Math.abs(first) <= 90 && Math.abs(second) <= 180) {
    // يعني المستخدم دخل lat,lon
    lat = first;
    lon = second;
  } else {
    // العكس lon,lat
    lon = first;
    lat = second;
  }

  await showWeatherOnMap(lon, lat);
};

  return (
    <div className="relative w-full">
      {/* أدوات التحكم */}
<div className="absolute top-2 left-2 sm:left-10 z-10 bg-white shadow-lg rounded-2xl 
                p-2 sm:p-4 grid gap-2 sm:gap-3  max-w-[285px] sm:w-[290px] border border-gray-200">

  {/* إدخال الإحداثيات */}
  <div className="grid gap-1">
    <label className="text-xs sm:text-sm font-medium text-gray-600">Enter Coordinates</label>
    <input
      type="text"
      placeholder="lon,lat"
      value={coordinates}
      onChange={(e) => setCoordinates(e.target.value)}
      className="border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full text-xs sm:text-sm"
    />
  </div>

  {/* زر الطقس */}
  <button
    onClick={handleShowWeather}
    className="bg-blue-600 text-white font-medium py-1.5 sm:py-2.5 rounded-lg shadow-sm 
               hover:bg-blue-700 transition text-xs sm:text-sm"
  >
    Show Weather
  </button>

  <hr className="my-1 sm:my-2 border-gray-200" />

  {/* رفع ملف الشيب فايل */}
  <div className="grid gap-1 sm:gap-2">
    <input
      type="file"
      accept=".zip"
      onChange={handleFileUpload}
      className="text-xs sm:text-sm text-gray-600 file:mr-2 sm:file:mr-3 
                 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 
                 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 
                 hover:file:bg-blue-100"
    />
    <button
      onClick={handleProcessFile}
      className="bg-blue-500 text-white font-medium py-1.5 sm:py-2.5 rounded-lg shadow-sm 
                 hover:bg-blue-600 transition text-xs sm:text-sm"
    >
      Import Shapefile
    </button>
  </div>

  {/* تحميل PDF */}
  <button
    onClick={handleDownloadPDF}
    className="bg-indigo-900 text-white font-medium py-1.5 sm:py-2.5 rounded-lg shadow-sm 
               hover:bg-indigo-700 transition text-xs sm:text-sm"
  >
    Download PDF
  </button>
</div>




      {/* الخريطة */}
     
            <div
    ref={mapRef}
        style={{
          width: "100%",
          height: "93.2vh",
          margin: 0,
          padding: 0,
        }}
      ></div>

      {/* Popup */}
      <div ref={popupRef} className="absolute transform -translate-x-1/2 -translate-y-full"></div>
    </div>
  );
}




