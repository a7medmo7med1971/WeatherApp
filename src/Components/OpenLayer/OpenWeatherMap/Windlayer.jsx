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
        new FullScreen(), // زر Fullscreen
        new ScaleLine(),  // مقياس الرسم
      ]),
    });

    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <div className="relative w-full h-[90.3vh]">
         <div
    ref={mapRef}
        style={{
          width: "100%",
          height: "93.2vh",
          margin: 0,
          padding: 0,
        }}
      ></div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-white/90 p-3 rounded-lg shadow-md w-56 text-xs font-sans">
        <div className="font-semibold mb-2">Wind Speed (m/s)</div>

        {/* التدرج اللوني */}
        <div className="h-3 rounded mb-2 bg-[linear-gradient(to_right,#a6f0ff,#5ec8f2,#3d9be9,#6a65d8,#a64ca6,#d240d2)]" />

        {/* القيم */}
        <div className="flex justify-between text-[11px] text-gray-700">
          <span>0</span>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
          <span>25+</span>
        </div>
      </div>
    </div>
  );
}
