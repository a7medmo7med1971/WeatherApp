import React from 'react';
import './App.css'
import Home from './Components/Home/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Pressure from './Components/OpenLayer/OpenMeto/Pressure';
import Rain from './Components/OpenLayer/OpenMeto/Rain';
import Temperature from './Components/OpenLayer/OpenMeto/Temperature';

import Cloudlayer from './Components/OpenLayer/OpenWeatherMap/Cloudlayer';
import Pressurelayer from './Components/OpenLayer/OpenWeatherMap/Pressurelayer';
import Windlayer from './Components/OpenLayer/OpenWeatherMap/Windlayer';
import Temperaturelayer from './Components/OpenLayer/OpenWeatherMap/Temperaturelayer';
import Wind from './Components/OpenLayer/OpenMeto/Wind';

function App() {

  const router = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> }, //  Default page
        { path: 'Pressure', element: <Pressure /> },
        { path: 'Rain', element: <Rain /> },
        { path: 'Temperature', element: <Temperature /> },
        { path: 'wind', element: <Wind /> },
        { path: 'Cloudlayer', element: <Cloudlayer /> },
        { path: 'Temperaturelayer', element: <Temperaturelayer /> },
        { path: 'Pressurelayer', element: <Pressurelayer /> },
        { path: 'Windlayer', element: <Windlayer /> }
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
