import React, { useEffect, useState } from "react";
import "./App.css";
import Home from "./Components/Home/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Pressure from "./Components/OpenLayer/OpenMeto/Pressure";
import Rain from "./Components/OpenLayer/OpenMeto/Rain";
import Temperature from "./Components/OpenLayer/OpenMeto/Temperature";
import Cloudlayer from "./Components/OpenLayer/OpenWeatherMap/Cloudlayer";
import Pressurelayer from "./Components/OpenLayer/OpenWeatherMap/Pressurelayer";
import Windlayer from "./Components/OpenLayer/OpenWeatherMap/Windlayer";
import Temperaturelayer from "./Components/OpenLayer/OpenWeatherMap/Temperaturelayer";
import Wind from "./Components/OpenLayer/OpenMeto/Wind";
import WeatherDashboard from "./Components/Dashboard/Dashboard";
import DashboardGovsEgypt from "./Components/Dashboard/DashboardGovsEgypt";
import Swal from "sweetalert2";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      Swal.fire({
  title: "No Internet Connection",
  text: "Please check your network connection.",
  icon: "warning",
  confirmButtonText: "OK",
});

    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
       
        { path: "dashboard", element: <WeatherDashboard /> },
        { path: "DashboardGovsEgypt", element: <DashboardGovsEgypt /> },
        
        
        
      ],
    },
    { path: "Windlayer", element: <Windlayer /> },
    { path: "Pressurelayer", element: <Pressurelayer /> },
    { path: "Temperaturelayer", element: <Temperaturelayer /> },
    { path: "Cloudlayer", element: <Cloudlayer /> },
    { path: "Temperature", element: <Temperature /> },
    { path: "Pressure", element: <Pressure /> },
    { path: "Rain", element: <Rain /> },
    { path: "wind", element: <Wind /> },
  ]);

 return (
  <>
    {isOnline ? (
      <RouterProvider router={router} />
    ) : (
      <div className="flex h-screen items-center justify-center bg-gray-100 text-gray-700">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
             No Internet Connection
          </h2>
          <p>Please check your network and try again.</p>
        </div>
      </div>
    )}
  </>
);

}

export default App;
