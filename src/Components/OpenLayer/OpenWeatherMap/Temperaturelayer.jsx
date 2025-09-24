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
          opacity:3,
        }),
      ],
      view: new View({
        center: fromLonLat([30, 25]), 
        zoom: 2,
      }),
         controls: defaultControls().extend([
        new FullScreen(), // زر Fullscreen
        new ScaleLine(),  // مقياس الرسم
      ]),
      
    });
    

    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "92.9vh" }}>
      <div
    ref={mapRef}
        style={{
          width: "100%",
          height: "93.2vh",
          margin: 0,
          padding: 0,
        }}
      ></div>

      {/*  Legend */}
    <div className="absolute bottom-3 right-3 bg-white/90 p-3 rounded-lg shadow-md w-56 text-xs font-sans">
      <div className="font-semibold mb-2">Temperature(°C)</div>

      {/* شريط التدرج اللوني */}
      <div className="h-3 rounded mb-2 bg-[linear-gradient(to_right,#0000FF,#00FFFF,#00FF00,#FFFF00,#FFA500,#FF0000)]" />
      <div className="flex justify-between text-[11px] text-gray-700">
        <span>-40</span>
        <span>0</span>
        <span>10</span>
        <span>20</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>

    </div>
  );
}
