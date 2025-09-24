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
        <div className="font-semibold mb-2">Cloud Coverage (%)</div>

        <div className="h-3 rounded mb-2 bg-[linear-gradient(to_right,#ffffff,#d9d9d9,#a6a6a6,#595959,#262626)]" />

        <div className="flex justify-between text-[11px] text-gray-700">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
