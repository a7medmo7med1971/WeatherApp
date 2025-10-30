import React from 'react'
import Navbar from './Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import BackToTopButton from '../BackToTopButton/BackToTopButton'
import WeatherChatbot from '../WeatherChatbot/WeatherChatbot'
// import DarkModeToggle from '../DarkMode/DarkMode'

export default function Layout() {
  return <>
  <Navbar></Navbar>
  <Outlet></Outlet>
  <BackToTopButton></BackToTopButton>
  {/* <DarkModeToggle></DarkModeToggle> */}
  <WeatherChatbot></WeatherChatbot>
  
  </>
}
