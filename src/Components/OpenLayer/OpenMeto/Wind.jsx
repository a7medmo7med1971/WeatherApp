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

const getWindData = async (lon, lat) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=windspeed_10m,winddirection_10m,windgusts_10m&daily=windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&timezone=auto`;
    const res = await axios.get(url);
    const current = res.data.current;
    const daily = res.data.daily;

    // Calculate averages from daily data (next 7 days)
    const avgMaxWindSpeed = (daily.windspeed_10m_max.slice(0, 7).reduce((a, b) => a + b, 0) / 7).toFixed(1);
    const avgMaxWindGusts = (daily.windgusts_10m_max.slice(0, 7).reduce((a, b) => a + b, 0) / 7).toFixed(1);
    const dominantDirection = daily.winddirection_10m_dominant[0];

    // Determine wind intensity (Beaufort scale simplified)
    let windIntensity = "Calm";
    let windColor = "gray";
    const speed = current.windspeed_10m;
    
    if (speed < 1) {
      windIntensity = "Calm";
      windColor = "gray";
    } else if (speed < 12) {
      windIntensity = "Light Breeze";
      windColor = "blue";
    } else if (speed < 20) {
      windIntensity = "Moderate Breeze";
      windColor = "cyan";
    } else if (speed < 29) {
      windIntensity = "Fresh Breeze";
      windColor = "green";
    } else if (speed < 39) {
      windIntensity = "Strong Breeze";
      windColor = "yellow";
    } else if (speed < 50) {
      windIntensity = "Gale";
      windColor = "orange";
    } else {
      windIntensity = "Storm";
      windColor = "red";
    }

    // Get cardinal direction
    const getCardinalDirection = (deg) => {
      const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(deg / 22.5) % 16;
      return dirs[index];
    };

    return {
      currentWindSpeed: current.windspeed_10m || 0,
      currentWindDirection: current.winddirection_10m || 0,
      currentWindGusts: current.windgusts_10m || 0,
      cardinalDirection: getCardinalDirection(current.winddirection_10m || 0),
      avgMaxWindSpeed,
      avgMaxWindGusts,
      dominantDirection,
      windIntensity,
      windColor,
      time: current.time,
    };
  } catch (err) {
    console.error("API Error:", err);
    return null;
  }
};

export default function WindMap() {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const mapObjRef = useRef({ map: null, overlay: null });

  const [coordinates, setCoordinates] = useState("");
  const [file, setFile] = useState(null);
  const [windDataList, setWindDataList] = useState([]);

  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(new VectorLayer({ source: vectorSourceRef.current }));

  const showWindOnMap = async (lon, lat) => {
    const { map, overlay } = mapObjRef.current;
    if (!map) return;

    Swal.fire({
      title: "Loading wind data...",
      html: "Please wait",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const wind = await getWindData(lon, lat);
    Swal.close();

    if (!wind) {
      Swal.fire("Error", "Failed to fetch wind data", "error");
      return;
    }

    vectorSourceRef.current.clear();

    const center3857 = fromLonLat([lon, lat]);
    const bufferFeature = new Feature({ geometry: new CircleGeom(center3857, 50000) });
    
    let fillColor = "rgba(156, 163, 175, 0.15)"; // gray
    let strokeColor = "#9ca3af";
    
    if (wind.windColor === "blue") {
      fillColor = "rgba(59, 130, 246, 0.15)";
      strokeColor = "#3b82f6";
    } else if (wind.windColor === "cyan") {
      fillColor = "rgba(6, 182, 212, 0.15)";
      strokeColor = "#06b6d4";
    } else if (wind.windColor === "green") {
      fillColor = "rgba(34, 197, 94, 0.15)";
      strokeColor = "#22c55e";
    } else if (wind.windColor === "yellow") {
      fillColor = "rgba(234, 179, 8, 0.15)";
      strokeColor = "#eab308";
    } else if (wind.windColor === "orange") {
      fillColor = "rgba(249, 115, 22, 0.15)";
      strokeColor = "#f97316";
    } else if (wind.windColor === "red") {
      fillColor = "rgba(239, 68, 68, 0.15)";
      strokeColor = "#ef4444";
    }
    
    bufferFeature.setStyle(
      new Style({
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: strokeColor, width: 3 }),
      })
    );

    vectorSourceRef.current.addFeature(bufferFeature);
    map.getView().animate({ center: center3857, zoom: 8 });

   popupRef.current.innerHTML = `
  <div class="bg-gradient-to-br from-white to-${wind.windColor}-50 p-4 sm:p-6 rounded-2xl shadow-2xl border border-${wind.windColor}-100 w-[280px] sm:w-80 backdrop-blur-xl max-w-[90vw]">
    <div class="flex items-center justify-between mb-3 sm:mb-4">
      <h4 class="text-base sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-${wind.windColor}-600 to-cyan-600 flex items-center gap-1.5 sm:gap-2">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-${wind.windColor}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        Wind Info
      </h4>
      <div class="bg-green-100 px-2 sm:px-3 py-1 rounded-full">
        <span class="text-green-700 text-[10px] sm:text-xs font-semibold">LIVE</span>
      </div>
    </div>
    
    <div class="space-y-2.5 sm:space-y-3">
      <div class="bg-gradient-to-r from-${wind.windColor}-500 to-cyan-600 p-3 sm:p-4 rounded-xl text-white">
        <p class="text-xs sm:text-sm opacity-90 mb-1">Wind Intensity</p>
        <p class="text-2xl sm:text-3xl font-bold">${wind.windIntensity}</p>
      </div>
      
      <div class="grid grid-cols-2 gap-2 sm:gap-3">
        <div class="bg-blue-50 p-2.5 sm:p-3 rounded-xl border border-blue-100">
          <div class="flex items-center gap-1.5 sm:gap-2 mb-1">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span class="text-[10px] sm:text-xs text-blue-700 font-medium">Speed</span>
          </div>
          <p class="text-base sm:text-xl font-bold text-blue-600">${wind.currentWindSpeed} km/h</p>
        </div>
        
        <div class="bg-cyan-50 p-2.5 sm:p-3 rounded-xl border border-cyan-100">
          <div class="flex items-center gap-1.5 sm:gap-2 mb-1">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="text-[10px] sm:text-xs text-cyan-700 font-medium">Gusts</span>
          </div>
          <p class="text-base sm:text-xl font-bold text-cyan-600">${wind.currentWindGusts} km/h</p>
        </div>
      </div>
      
      <div class="bg-indigo-50 p-2.5 sm:p-3 rounded-xl border border-indigo-100">
        <div class="flex items-center justify-between flex-wrap gap-1">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" style="transform: rotate(${wind.currentWindDirection}deg)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span class="text-xs sm:text-sm text-indigo-700 font-medium">Direction</span>
          </div>
          <div class="text-right">
            <span class="text-base sm:text-lg font-bold text-indigo-600">${wind.cardinalDirection}</span>
            <span class="text-xs text-indigo-500 ml-1">(${wind.currentWindDirection}°)</span>
          </div>
        </div>
      </div>
      
      <div class="bg-purple-50 p-2.5 sm:p-3 rounded-xl border border-purple-100">
        <div class="flex items-center justify-between flex-wrap gap-1 mb-2">
          <span class="text-xs sm:text-sm text-purple-700 font-medium">7-Day Avg Max Speed</span>
          <span class="text-base sm:text-lg font-bold text-purple-600">${wind.avgMaxWindSpeed} km/h</span>
        </div>
        <div class="flex items-center justify-between flex-wrap gap-1">
          <span class="text-xs sm:text-sm text-purple-700 font-medium">7-Day Avg Max Gusts</span>
          <span class="text-base sm:text-lg font-bold text-purple-600">${wind.avgMaxWindGusts} km/h</span>
        </div>
      </div>
      
      <div class="bg-gray-50 p-2.5 sm:p-3 rounded-xl border border-gray-100">
        <div class="flex items-start gap-2 text-gray-600">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-[10px] sm:text-xs font-medium leading-tight">Last Updated: ${new Date(wind.time).toLocaleString()}</span>
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
        const wind = await getWindData(lon, lat);
        if (wind) {
          const obj = {
            name: feature.properties?.name || feature.properties?.NAME || "Location",
            lon,
            lat,
            ...wind,
          };
          allData.push(obj);

          const pointFeature = new Feature({
            geometry: new Point(fromLonLat([lon, lat])),
            ...obj,
          });
          pointFeature.setStyle(
            new Style({
              image: new Icon({
                src: "https://cdn-icons-png.flaticon.com/512/1146/1146869.png",
                scale: 0.05,
              }),
            })
          );
          vectorSourceRef.current.addFeature(pointFeature);
        }
      }

      setWindDataList(allData);
      Swal.close();
      Swal.fire("Done", "Points loaded successfully", "success");
    } catch (err) {
      console.error(err);
      Swal.close();
      Swal.fire("Error", "Failed to process shapefile", "error");
    }
  };

  const handleDownloadPDF = () => {
    if (!windDataList || windDataList.length === 0) {
      Swal.fire("Warning", "No wind data available to download", "warning");
      return;
    }

    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 197, 94);

      doc.text("Wind Analysis Report", doc.internal.pageSize.getWidth() / 2, 15, {
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
          "Speed (km/h)",
          "Direction",
          "Gusts (km/h)",
          "Intensity",
          "Avg Max Speed",
        ],
      ];

      const body = windDataList.map((item) => [
        item.name || "Point",
        item.lon != null ? Number(item.lon).toFixed(4) : "",
        item.lat != null ? Number(item.lat).toFixed(4) : "",
        item.currentWindSpeed != null ? item.currentWindSpeed : "",
        item.cardinalDirection || "",
        item.currentWindGusts != null ? item.currentWindGusts : "",
        item.windIntensity || "",
        item.avgMaxWindSpeed || "",
      ]);

      autoTable(doc, {
        head,
        body,
        startY: 25,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineColor: [220, 220, 220],
          lineWidth: 0.2,
          halign: "center",
          valign: "middle",
        },
        headStyles: {
          fillColor: [34, 197, 94],
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

      doc.save("wind_report.pdf");

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
                  <span class="text-sm text-gray-600">Intensity:</span>
                  <span class="text-lg font-bold text-${props.windColor}-600">${props.windIntensity}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Speed:</span>
                  <span class="text-sm font-semibold text-gray-800">${props.currentWindSpeed} km/h</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Direction:</span>
                  <span class="text-sm font-semibold text-gray-800">${props.cardinalDirection} (${props.currentWindDirection}°)</span>
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
      await showWindOnMap(lon, lat);
    });

    mapObjRef.current = { map, overlay };
    return () => map.setTarget(null);
  }, []);

  const handleShowWind = async () => {
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

    await showWindOnMap(lon, lat);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 shadow-2xl">
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl shadow-lg">
              <svg className="w-5 h-5 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-base sm:text-xl lg:text-2xl tracking-tight leading-tight">
                Wind Monitoring Map
              </h1>
              <p className="text-green-100 text-xs sm:text-sm hidden sm:block">Real-time Wind Analysis</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-white text-xs sm:text-sm font-semibold">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Control Panel */}
      <div className="absolute top-16 sm:top-24 lg:top-28 left-2 sm:left-4 lg:left-6 z-10 w-[280px] sm:w-[340px] lg:w-[360px] max-h-[calc(100vh-5rem)] overflow-y-auto">
        <div className="bg-white/98 backdrop-blur-2xl shadow-2xl rounded-xl sm:rounded-3xl border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-3 sm:px-6 py-2.5 sm:py-5">
            <h2 className="text-white font-bold text-sm sm:text-xl flex items-center gap-2">
              <div className="bg-white/20 p-1 sm:p-2 rounded-md sm:rounded-lg">
                <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <span className="hidden sm:inline">Control Panel</span>
              <span className="sm:hidden">Controls</span>
            </h2>
            <p className="text-green-100 text-xs mt-0.5 sm:mt-1 hidden sm:block">Manage your wind data analysis</p>
          </div>

          <div className="p-3 sm:p-6 space-y-3 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-3">
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-800">
                <div className="bg-green-100 p-1 sm:p-1.5 rounded-md sm:rounded-lg">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <span className="hidden sm:inline">Enter Coordinates</span>
                <span className="sm:hidden">Coordinates</span>
              </label>
              <input
                type="text"
                placeholder="31.24, 30.04"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-2 sm:py-3.5 
                         focus:outline-none focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 
                         transition-all text-xs sm:text-sm placeholder:text-gray-400 font-medium"
              />
              <button
                onClick={handleShowWind}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold 
                         py-2 sm:py-3.5 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl hover:scale-[1.02] 
                         active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">Show Wind Data</span>
                <span className="sm:hidden">Show Wind</span>
              </button>
            </div>

            <div className="relative py-1 sm:py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 sm:px-4 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Or</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-3">
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-800">
                <div className="bg-emerald-100 p-1 sm:p-1.5 rounded-md sm:rounded-lg">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="hidden sm:inline">Import Shapefile</span>
                <span className="sm:hidden">Shapefile</span>
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-2 sm:p-4 hover:border-emerald-400 transition-colors bg-gray-50">
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileUpload}
                  className="w-full text-[10px] sm:text-sm text-gray-600 cursor-pointer
                           file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-3 file:px-2 sm:file:px-5 
                           file:rounded-md sm:file:rounded-xl file:border-0 
                           file:bg-gradient-to-r file:from-green-600 file:to-emerald-600 
                           file:text-white file:font-bold file:cursor-pointer file:shadow-md
                           hover:file:shadow-lg file:transition-all file:duration-200 file:text-[10px] sm:file:text-sm"
                />
              </div>
              <button
                onClick={handleProcessFile}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold 
                         py-2 sm:py-3.5 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl hover:scale-[1.02] 
                         active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">Process Shapefile</span>
                <span className="sm:hidden">Process</span>
              </button>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold 
                       py-2 sm:py-3.5 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl hover:scale-[1.02] 
                       active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Download PDF Report</span>
              <span className="sm:hidden">Download PDF</span>
            </button>
          </div>
        </div>

        <div className="hidden sm:block mt-3 sm:mt-4 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm border-2 border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg">
          <div className="flex gap-2 sm:gap-3">
            <div className="bg-green-500 p-1.5 sm:p-2 rounded-lg h-fit">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-green-900 leading-relaxed font-medium">
                <span className="font-bold">Tip:</span> Double-click on the map to view wind info for that location. Colors indicate wind intensity based on the Beaufort scale.
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