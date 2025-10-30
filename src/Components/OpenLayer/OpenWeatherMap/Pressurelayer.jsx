import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls, FullScreen, ScaleLine } from "ol/control";
import { Link } from "react-router-dom";

export default function Pressurelayer() {
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
            url: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=ac6f2241f10da37c9cc4eb103414dc9f`,
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
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-2.5 rounded-xl shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg sm:text-2xl tracking-tight">Atmospheric Pressure Layer</h1>
              <p className="text-purple-100 text-xs sm:text-sm hidden sm:block">Global Pressure Distribution Map</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* <Link to="/">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30">
                ← Home
              </button>
            </Link> */}
            <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-white text-xs sm:text-sm font-semibold">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="absolute inset-0 pt-16 sm:pt-20"
        style={{
          width: "100%",
          height: "100vh",
          margin: 0,
          padding: 0,
        }}
      ></div>

      {/* Enhanced Legend Card */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-10 w-[280px] sm:w-80">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden transform transition-all hover:scale-105">
          {/* Legend Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-5 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-sm sm:text-base">Pressure Scale</h3>
            </div>
          </div>

          {/* Legend Content */}
          <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
            {/* Gradient Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 font-medium mb-1">
                <span>Atmospheric Pressure</span>
                <span className="text-purple-600 font-bold">hPa</span>
              </div>
              <div className="relative">
                <div className="h-4 sm:h-5 rounded-xl shadow-inner bg-gradient-to-r from-[#00008B] via-[#1E90FF] via-[#00FF00] via-[#FFFF00] via-[#FFA500] to-[#FF0000]" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>

            {/* Values */}
            <div className="flex justify-between text-[10px] sm:text-xs font-bold text-gray-700">
              <span className="bg-blue-100 px-2 py-1 rounded-lg text-blue-700">950</span>
              <span className="bg-cyan-100 px-2 py-1 rounded-lg text-cyan-700">980</span>
              <span className="bg-green-100 px-2 py-1 rounded-lg text-green-700">1013</span>
              <span className="bg-yellow-100 px-2 py-1 rounded-lg text-yellow-700">1020</span>
              <span className="bg-orange-100 px-2 py-1 rounded-lg text-orange-700">1040</span>
              <span className="bg-red-100 px-2 py-1 rounded-lg text-red-700">1050</span>
            </div>

            {/* Pressure Indicators */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-2 sm:p-3 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-[10px] sm:text-xs font-bold text-blue-700">Low Pressure</span>
                </div>
                <p className="text-[10px] text-blue-600">Storm Systems</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-2 sm:p-3 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-[10px] sm:text-xs font-bold text-red-700">High Pressure</span>
                </div>
                <p className="text-[10px] text-red-600">Clear Weather</p>
              </div>
            </div>

            {/* Standard Pressure Info */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-2 sm:p-3 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-bold text-purple-700">Standard Pressure</span>
                </div>
                <span className="text-sm sm:text-base font-bold text-purple-600">1013 hPa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card - Top Left */}
      <div className="absolute top-20 sm:top-24 left-4 sm:left-6 z-10 hidden lg:block">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-4 w-72">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-sm mb-1">About This Map</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Real-time atmospheric pressure visualization showing high and low pressure systems across the globe. Colors indicate pressure levels in hectopascals (hPa).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}