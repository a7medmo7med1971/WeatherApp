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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [weatherDataList, setWeatherDataList] = useState([]);

  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(new VectorLayer({ source: vectorSourceRef.current }));

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

    vectorSourceRef.current.clear();

    const center3857 = fromLonLat([lon, lat]);
    const bufferFeature = new Feature({ geometry: new CircleGeom(center3857, 50000) });
    bufferFeature.setStyle(
      new Style({
        fill: new Fill({ color: "rgba(99, 102, 241, 0.15)" }),
        stroke: new Stroke({ color: "#6366f1", width: 3 }),
      })
    );

    vectorSourceRef.current.addFeature(bufferFeature);
    map.getView().animate({ center: center3857, zoom: 8 });

    popupRef.current.innerHTML = `
      <div class="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-2xl border border-blue-100 w-80 backdrop-blur-xl">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Weather Info
          </h4>
          <div class="bg-green-100 px-3 py-1 rounded-full">
            <span class="text-green-700 text-xs font-semibold">LIVE</span>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl text-white">
            <p class="text-sm opacity-90 mb-1">Current Temperature</p>
            <p class="text-4xl font-bold">${weather.currentTemp}°C</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-red-50 p-3 rounded-xl border border-red-100">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span class="text-xs text-red-700 font-medium">Max</span>
              </div>
              <p class="text-2xl font-bold text-red-600">${weather.maxTemp}°C</p>
            </div>
            
            <div class="bg-blue-50 p-3 rounded-xl border border-blue-100">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <span class="text-xs text-blue-700 font-medium">Min</span>
              </div>
              <p class="text-2xl font-bold text-blue-600">${weather.minTemp}°C</p>
            </div>
          </div>
          
          <div class="bg-purple-50 p-3 rounded-xl border border-purple-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span class="text-sm text-purple-700 font-medium">Wind Speed</span>
              </div>
              <span class="text-lg font-bold text-purple-600">${weather.windspeed} km/h</span>
            </div>
            <div class="mt-2 text-xs text-purple-600">Direction: ${weather.winddirection}°</div>
          </div>
          
          <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-xs font-medium">Last Updated: ${new Date(weather.time).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    overlay.setPosition(center3857);
  };

  const handleFileUpload = (e) => setFile(e.target.files[0]);

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

  const handleDownloadPDF = () => {
    if (!weatherDataList || weatherDataList.length === 0) {
      Swal.fire("Warning", "No weather data available to download", "warning");
      return;
    }

    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(41, 128, 185);

      doc.text("Temperature Report", doc.internal.pageSize.getWidth() / 2, 15, {
        align: "center",
      });

      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.5);
      doc.line(14, 20, doc.internal.pageSize.getWidth() - 14, 20);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      const head = [
        [
          "Name",
          "Lon",
          "Lat",
          "Current Temp (°C)",
          "Max Temp (°C)",
          "Min Temp (°C)",
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
      ]);

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

      doc.save("weather_report.pdf");

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

    map.on("click", (e) => {
      const feature = map.forEachFeatureAtPixel(e.pixel, (f) => f);
      if (!feature) {
        overlay.setPosition(undefined);
        vectorSourceRef.current.clear();
      }
    });

    map.on("singleclick", (e) => {
      map.forEachFeatureAtPixel(e.pixel, (feature) => {
        const props = feature.getProperties();
        if (props.name) {
          popupRef.current.innerHTML = `
            <div class="bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 w-72">
              <div class="mb-3 pb-3 border-b border-gray-200">
                <h4 class="text-lg font-bold text-gray-800">${props.name}</h4>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Current:</span>
                  <span class="text-lg font-bold text-blue-600">${props.currentTemp}°C</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Max / Min:</span>
                  <span class="text-sm font-semibold text-gray-800">
                    <span class="text-red-500">${props.maxTemp}°C</span> / 
                    <span class="text-blue-500">${props.minTemp}°C</span>
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Wind:</span>
                  <span class="text-sm font-semibold text-gray-800">${props.windspeed} km/h (${props.winddirection}°)</span>
                </div>
              </div>
            </div>`;

          const geometry = feature.getGeometry();
          const coord = geometry.getCoordinates();

          overlay.setPosition(coord);

          map.getView().animate({
            center: coord,
            zoom: 10,
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

    const parts = coordinates.split(/[\s,]+/).map((s) => Number(s.trim()));

    if (parts.length < 2 || parts.some(isNaN)) {
      Swal.fire("Error", "Enter valid coordinates (lon,lat)", "error");
      return;
    }

    let [first, second] = parts;
    let lat, lon;

    if (Math.abs(first) <= 90 && Math.abs(second) <= 180) {
      lat = first;
      lon = second;
    } else {
      lon = first;
      lat = second;
    }

    await showWeatherOnMap(lon, lat);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-2xl">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl tracking-tight">Climate Intelligence Map</h1>
              <p className="text-blue-100 text-sm">Real-time Meteorological Analysis Platform</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-white text-sm font-semibold">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Control Panel */}
      <div className="absolute top-28 left-6 z-10 w-[360px]">
        <div className="bg-white/98 backdrop-blur-2xl shadow-2xl rounded-3xl border border-gray-200/50 overflow-hidden transform transition-all hover:shadow-3xl">
          {/* Panel Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5">
            <h2 className="text-white font-bold text-xl flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              Control Panel
            </h2>
            <p className="text-blue-100 text-xs mt-1">Manage your weather data analysis</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Coordinates Input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                Enter Coordinates
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="lon, lat (e.g., 31.2357, 30.0444)"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 
                           focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                           transition-all text-sm placeholder:text-gray-400 font-medium"
                />
              </div>
              <button
                onClick={handleShowWeather}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold 
                         py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] 
                         active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Show Weather Data
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Or Upload File</span>
              </div>
            </div>

            {/* Shapefile Upload */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <div className="bg-indigo-100 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                Import Shapefile (.zip)
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-indigo-400 transition-colors bg-gray-50">
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileUpload}
                  className="w-full text-sm text-gray-600 cursor-pointer
                           file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 
                           file:bg-gradient-to-r file:from-indigo-600 file:to-purple-600 
                           file:text-white file:font-bold file:cursor-pointer file:shadow-md
                           hover:file:shadow-lg file:transition-all file:duration-200"
                />
              </div>
              <button
                onClick={handleProcessFile}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold 
                         py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] 
                         active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Process Shapefile
              </button>
            </div>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold 
                       py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] 
                       active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Report
            </button>
          </div>
        </div>

        {/* Enhanced Info Tip */}
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-4 shadow-lg">
          <div className="flex gap-3">
            <div className="bg-blue-500 p-2 rounded-lg h-fit">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-900 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> Double-click anywhere on the map to instantly view detailed weather information for that location.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="absolute inset-0"
        style={{
          width: "100%",
          height: "100vh",
          margin: 0,
          padding: 0,
        }}
      ></div>

      {/* Popup */}
      <div ref={popupRef} className="absolute transform -translate-x-1/2 -translate-y-full"></div>
    </div>
  );
}