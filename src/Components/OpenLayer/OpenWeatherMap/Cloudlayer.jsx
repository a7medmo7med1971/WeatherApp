import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls, FullScreen, ScaleLine } from "ol/control";

export default function CloudLayer() {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attributions: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          }),
        }),
        new TileLayer({
          source: new XYZ({
            url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=ac6f2241f10da37c9cc4eb103414dc9f`,
          }),
          opacity: 1,
        }),
      ],
      view: new View({
        center: fromLonLat([30, 25]), 
        zoom: 3,
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
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 shadow-2xl">
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl shadow-lg">
              <svg className="w-5 h-5 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-base sm:text-xl lg:text-2xl tracking-tight leading-tight">
                Cloud Coverage Layer
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">Real-time Global Cloud Monitoring</p>
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
      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 w-[200px] sm:w-[240px] lg:w-[280px]">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden">
          {/* Legend Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <h3 className="text-white font-bold text-xs sm:text-sm">Cloud Coverage</h3>
            </div>
          </div>

          {/* Legend Content */}
          <div className="p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {/* Gradient Bar */}
              <div>
                <div className="h-4 sm:h-5 rounded-lg shadow-inner bg-gradient-to-r from-white via-gray-300 to-gray-900 border border-gray-300" />
              </div>

              {/* Labels */}
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold text-gray-700">
                <span className="bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">0%</span>
                <span className="bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hidden sm:inline">25%</span>
                <span className="bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">50%</span>
                <span className="bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hidden sm:inline">75%</span>
                <span className="bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">100%</span>
              </div>

              {/* Description */}
              <div className="pt-2 sm:pt-3 border-t border-gray-200">
                <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-white border-2 border-gray-300"></div>
                    <span className="text-gray-600">Clear Sky (0-25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-300 border-2 border-gray-400"></div>
                    <span className="text-gray-600">Partly Cloudy (25-50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-500 border-2 border-gray-600"></div>
                    <span className="text-gray-600">Mostly Cloudy (50-75%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-800 border-2 border-gray-900"></div>
                    <span className="text-gray-600">Overcast (75-100%)</span>
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
              <span className="leading-tight">Data updates every 10 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card - Mobile Bottom / Desktop Top Left */}
      <div className="absolute top-20 sm:top-24 left-3 sm:left-4 z-10 hidden lg:block">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border-2 border-cyan-100 p-3 sm:p-4 w-[240px] sm:w-[280px]">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 sm:p-2.5 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-1">Layer Information</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Real-time cloud coverage data from OpenWeatherMap displayed over satellite imagery.
              </p>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Global Coverage</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Live Updates</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-gray-700">High Resolution</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Info */}
      <div className="absolute top-20 left-3 right-3 z-10 lg:hidden">
        <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-xl border-2 border-cyan-100 p-3 flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-gray-800">Global Cloud Layer</h4>
            <p className="text-xs text-gray-600">Real-time satellite data</p>
          </div>
        </div>
      </div>
    </div>
  );
}