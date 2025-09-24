import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultControls, FullScreen, ScaleLine } from "ol/control";
import { Feature } from "ol";
import { Circle as CircleGeom } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Fill, Stroke } from "ol/style";
import Overlay from "ol/Overlay";
import axios from "axios";
import Swal from "sweetalert2";

const getWindData = async (lon, lat) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=windspeed_10m,winddirection_10m,windgusts_10m&timezone=auto`;
    const res = await axios.get(url);

    const current = res.data.current_weather;
    const timezone = res.data.timezone;
    
    // ✅ جلب أول قيمة من الهبات (لو متاحة)
    const windGust = res.data.hourly.windgusts_10m?.[0] ?? "N/A";

    return {
      windspeed: current.windspeed,
      winddirection: current.winddirection,
      time: current.time,
      timezone: timezone,
      windgust: windGust, // ✅ أضفنا الهبات
    };
  } catch (err) {
    console.error("API Error:", err);
    return null;
  }
};


export default function Wind() {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const mapObjRef = useRef({ map: null, overlay: null });

  const [coordinates, setCoordinates] = useState("");

  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(new VectorLayer({ source: vectorSourceRef.current }));

  // ✅ دالة عرض الرياح
  const showWindOnMap = async (lon, lat) => {
    const { map, overlay } = mapObjRef.current;
    if (!map) return;

    Swal.fire({
      title: "Loading data",
      html: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const wind = await getWindData(lon, lat);
    Swal.close();

    if (!wind) {
      Swal.fire({
        icon: "error",
        title: "Failed to load data",
        text: "Failed to retrieve wind data. Please try again.",
      });
      return;
    }

    vectorSourceRef.current.clear();
    const center3857 = fromLonLat([lon, lat]);

    const bufferFeature = new Feature({
      geometry: new CircleGeom(center3857, 50000),
    });

    bufferFeature.setStyle(
      new Style({
        fill: new Fill({ color: "rgba(255, 193, 7, 0.25)" }),
        stroke: new Stroke({ color: "#ffc107", width: 2 }),
      })
    );

    vectorSourceRef.current.addFeature(bufferFeature);
    map.getView().animate({ center: center3857, zoom: 8 });

    // ✅ تحديث البوب أب
popupRef.current.innerHTML = `
  <div class="bg-white p-4 rounded-xl shadow-lg text-gray-700 w-64">
    <h4 class="text-lg font-semibold mb-2">Wind Info</h4>
    <p><b>Coordinates:</b> ${lon.toFixed(4)}, ${lat.toFixed(4)}</p>
    <p><b>Wind Speed:</b> ${wind.windspeed} km/h</p>
    <p><b>Wind Direction:</b> ${wind.winddirection}°</p>
    <p><b>Wind Gusts:</b> ${wind.windgust} km/h</p>
    <p><b>Time:</b> ${wind.time}</p>
    <p><b>Timezone:</b> ${wind.timezone}</p>
  </div>`;
    overlay.setPosition(center3857);

    Swal.fire({
      icon: "success",
      title: "Successfully",
      text: `Successfully fetched wind data for the selected location.`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    const overlay = new Overlay({
      element: popupRef.current,
      positioning: "bottom-center",
      stopEvent: false,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url:
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
          }),
        }),
        vectorLayerRef.current,
      ],
      view: new View({
        center: fromLonLat([30, 25]),
        zoom: 2,
      }),
      controls: defaultControls().extend([new FullScreen(), new ScaleLine()]),
      overlays: [overlay],
    });

    map.on("click", () => {
      overlay.setPosition(undefined);
      vectorSourceRef.current.clear();
    });

    map.on("dblclick", async (e) => {
      const [lon, lat] = toLonLat(e.coordinate);
      await showWindOnMap(lon, lat);
    });

    mapObjRef.current = { map, overlay };

    return () => {
      map.setTarget(null);
    };
  }, []);

  const handleShowWind = async () => {
    if (!coordinates.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter the coordinates first",
      });
      return;
    }

    let [a, b] = coordinates.split(",").map((s) => Number(s.trim()));
    if (isNaN(a) || isNaN(b)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Enter valid coordinates (lon,lat or lat,lon).",
      });
      return;
    }

    const lon = Math.abs(a) > 90 ? a : b;
    const lat = Math.abs(a) > 90 ? b : a;

    await showWindOnMap(lon, lat);
  };

  return (
    <div className="relative w-full">
      <div className="absolute top-4 left-55 -translate-x-1/2 z-10 bg-white shadow-md rounded-xl p-4 flex flex-col gap-3 items-center w-[350px]">
        <label className="text-gray-700 font-semibold text-sm self-start">
          Enter Coordinates (lon, lat)
        </label>

        <input
          type="text"
          placeholder="X,Y:31.2, 29.9"
          value={coordinates}
          onChange={(e) => setCoordinates(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <button
          onClick={handleShowWind}
          className="bg-yellow-600 w-full text-white px-4 py-2 rounded-lg hover:bg-yellow-500 text-sm font-semibold transition duration-200"
        >
          Show Wind
        </button>
      </div>

           <div
    ref={mapRef}
        style={{
          width: "100%",
          height: "93.2vh",
          margin: 0,
          padding: 0,
        }}
      ></div>

      <div
        ref={popupRef}
        className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer"
      ></div>
    </div>
  );
}
