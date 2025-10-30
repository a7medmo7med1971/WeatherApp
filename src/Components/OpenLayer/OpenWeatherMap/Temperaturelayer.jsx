import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls, FullScreen, ScaleLine } from "ol/control";

export default function TemperatureLayer() {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
            attributions: "© Esri, HERE, Garmin, FAO, NOAA, USGS",
          }),
        }),
        new TileLayer({
          source: new XYZ({
            url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=ac6f2241f10da37c9cc4eb103414dc9f`,
          }),
          opacity: 0.7,
        }),
      ],
      view: new View({
        center: fromLonLat([30, 25]), 
        zoom: 2,
      }),
      controls: defaultControls().extend([
        new FullScreen(),
        new ScaleLine(),
      ]),
    });

    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 shadow-2xl">
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl shadow-lg">
              <svg className="w-5 h-5 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-base sm:text-xl lg:text-2xl tracking-tight leading-tight">
                Temperature Layer
              </h1>
              <p className="text-orange-100 text-xs sm:text-sm hidden sm:block">Real-time Global Temperature Distribution</p>
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

      {/* Enhanced Legend - Responsive */}
      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 w-[220px] sm:w-[260px] lg:w-[300px]">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border-2 border-orange-100 overflow-hidden">
          {/* Legend Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-white font-bold text-xs sm:text-sm">Temperature Scale</h3>
            </div>
          </div>

          {/* Legend Content */}
          <div className="p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {/* Gradient Bar */}
              <div>
                <div className="h-5 sm:h-6 rounded-lg shadow-inner bg-gradient-to-r from-blue-600 via-cyan-400 via-green-400 via-yellow-400 via-orange-400 to-red-600 border border-gray-300" />
              </div>

              {/* Labels */}
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold text-gray-700">
                <span className="bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-blue-700">-40°C</span>
                <span className="bg-cyan-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-cyan-700 hidden sm:inline">0°C</span>
                <span className="bg-yellow-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-yellow-700">20°C</span>
                <span className="bg-red-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-red-700">40°C</span>
              </div>

              {/* Temperature Ranges Description */}
              <div className="pt-2 sm:pt-3 border-t border-gray-200">
                <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-600 border border-blue-700"></div>
                      <span className="text-gray-600">Freezing</span>
                    </div>
                    <span className="text-gray-500 font-medium"> -10°C</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-cyan-400 border border-cyan-500"></div>
                      <span className="text-gray-600">Cold</span>
                    </div>
                    <span className="text-gray-500 font-medium">-10 to 10°C</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-400 border border-green-500"></div>
                      <span className="text-gray-600">Mild</span>
                    </div>
                    <span className="text-gray-500 font-medium">10 to 20°C</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-yellow-400 border border-yellow-500"></div>
                      <span className="text-gray-600">Warm</span>
                    </div>
                    <span className="text-gray-500 font-medium">20 to 30°C</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-orange-500 border border-orange-600"></div>
                      <span className="text-gray-600">Hot</span>
                    </div>
                    <span className="text-gray-500 font-medium">30 to 40°C</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-600 border border-red-700"></div>
                      <span className="text-gray-600">Extreme</span>
                    </div>
                    <span className="text-gray-500 font-medium"> 40°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 px-3 sm:px-4 py-2 border-t border-gray-200">
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-gray-500">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-tight">Surface temperature in Celsius</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card - Desktop Only */}
      <div className="absolute top-20 sm:top-24 left-3 sm:left-4 z-10 hidden lg:block">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border-2 border-orange-100 p-3 sm:p-4 w-[240px] sm:w-[280px]">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 sm:p-2.5 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-1">Layer Information</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Real-time surface temperature data from OpenWeatherMap displayed over topographic maps.
              </p>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Worldwide Coverage</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Real-time Updates</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-gray-700">Celsius Scale</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <h5 className="font-semibold text-xs text-gray-700 mb-2">Temperature Ranges</h5>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-2 rounded-lg text-center">
                <div className="text-xs text-blue-700 font-semibold">Min</div>
                <div className="text-lg font-bold text-blue-800">-40°C</div>
              </div>
              <div className="bg-red-50 p-2 rounded-lg text-center">
                <div className="text-xs text-red-700 font-semibold">Max</div>
                <div className="text-lg font-bold text-red-800">+40°C</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Info */}
      <div className="absolute top-20 left-3 right-3 z-10 lg:hidden">
        <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-xl border-2 border-orange-100 p-3 flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-gray-800">Global Temperature</h4>
            <p className="text-xs text-gray-600">Surface temperature layer</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Range</div>
            <div className="text-sm font-bold text-gray-800">-40 to +40°C</div>
          </div>
        </div>
      </div>
    </div>
  );
}