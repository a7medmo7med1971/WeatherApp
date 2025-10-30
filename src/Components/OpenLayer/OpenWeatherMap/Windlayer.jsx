import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls, FullScreen, ScaleLine } from "ol/control";

export default function Windlayer() {
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
            url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=ac6f2241f10da37c9cc4eb103414dc9f`,
          }),
          opacity: 1.2,
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
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50">
      {/* Modern Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 shadow-2xl">
        <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm sm:text-lg md:text-2xl tracking-tight leading-tight">
                Wind Speed Layer
              </h1>
              <p className="text-cyan-100 text-[10px] sm:text-xs md:text-sm hidden sm:block">Global Wind Flow Patterns</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* <button 
              onClick={() => window.history.back()}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-2.5 sm:px-3 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
            >
              <span className="hidden sm:inline">← Home</span>
              <span className="sm:hidden">←</span>
            </button> */}
            <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-white/20">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-white text-[10px] sm:text-xs md:text-sm font-semibold">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="absolute inset-0 pt-12 sm:pt-14 md:pt-20"
        style={{
          width: "100%",
          height: "100vh",
          margin: 0,
          padding: 0,
        }}
      ></div>

      {/* Enhanced Legend Card - Fully Responsive */}
      <div className="absolute bottom-2 sm:bottom-3 md:bottom-6 right-2 sm:right-3 md:right-6 z-10 w-[260px] sm:w-[280px] md:w-[320px] lg:w-80">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200/50 overflow-hidden transform transition-all hover:scale-105">
          {/* Legend Header */}
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-4">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="bg-white/20 p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-xs sm:text-sm md:text-base">Wind Speed Scale</h3>
            </div>
          </div>

          {/* Legend Content */}
          <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 md:space-y-4">
            {/* Gradient Bar */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium mb-1">
                <span>Wind Speed</span>
                <span className="text-cyan-600 font-bold">m/s</span>
              </div>
              <div className="relative">
                <div className="h-3 sm:h-4 md:h-5 rounded-lg sm:rounded-xl shadow-inner bg-gradient-to-r from-[#a6f0ff] via-[#5ec8f2] via-[#3d9be9] via-[#6a65d8] via-[#a64ca6] to-[#d240d2]" />
                <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>

            {/* Values - Responsive Grid */}
            <div className="grid grid-cols-6 gap-1 sm:gap-1.5 md:gap-2 text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-700">
              <span className="bg-cyan-100 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-cyan-700 text-center">0</span>
              <span className="bg-blue-100 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-blue-700 text-center">5</span>
              <span className="bg-indigo-100 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-indigo-700 text-center">10</span>
              <span className="bg-purple-100 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-purple-700 text-center">15</span>
              <span className="bg-pink-100 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-pink-700 text-center">20</span>
              <span className="bg-fuchsia-100 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-fuchsia-700 text-center">25+</span>
            </div>

            {/* Wind Categories - Stack on Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3 pt-1.5 sm:pt-2 md:pt-3 border-t border-gray-200">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border border-cyan-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold text-cyan-700">Light Wind</span>
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-cyan-600">0-5 m/s</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border border-blue-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold text-blue-700">Moderate</span>
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-blue-600">5-15 m/s</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border border-purple-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold text-purple-700">Strong Wind</span>
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-purple-600">15-20 m/s</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-fuchsia-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border border-pink-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold text-pink-700">Storm Force</span>
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-pink-600">20+ m/s</p>
              </div>
            </div>

            {/* Conversion Info */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border border-cyan-200">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold text-cyan-700">Conversion</span>
                </div>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-cyan-600">1 m/s ≈ 3.6 km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card - Hide on Small Mobile, Show on Tablet+ */}
      <div className="absolute top-14 sm:top-16 md:top-24 left-2 sm:left-3 md:left-6 z-10 hidden md:block">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 p-3 sm:p-4 w-60 sm:w-64 md:w-72">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 text-xs sm:text-sm mb-1">Wind Patterns</h4>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                Real-time wind speed visualization showing wind flow patterns and intensity across the globe in meters per second.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Info Badge */}
      <div className="absolute top-14 left-2 z-10 md:hidden">
        <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 px-2.5 py-1.5 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-semibold text-gray-700">Wind Flow Map</span>
        </div>
      </div>
    </div>
  );
}