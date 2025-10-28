import React, { useEffect } from 'react'
import Footer from '../Layout/Footer/Footer'
import { Link } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Home() {
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    })
  }, [])

const climateArticles = [
  {
    title: "Temperature and Its Impact on Climate",
    excerpt: "An analysis of global temperature changes and their role in shaping weather and overall climate patterns.",
    category: "Temperature",
    readTime: "6 min read",
    gradient: "from-orange-400 to-red-600"
  },
  {
    title: "Rainfall and Its Role in Environmental Balance",
    excerpt: "An overview of how rainfall forms and distributes, and its impact on agriculture, groundwater, and ecosystems.",
    category: "Rainfall",
    readTime: "7 min read",
    gradient: "from-blue-400 to-cyan-600"
  },
  {
    title: "Winds as Indicators of Weather Changes",
    excerpt: "A study of wind patterns and their role in transferring heat, moisture, and shaping storms and weather systems.",
    category: "Wind",
    readTime: "6 min read",
    gradient: "from-sky-400 to-indigo-600"
  },
  {
    title: "Atmospheric Pressure and Its Relation to Weather",
    excerpt: "An explanation of how changes in air pressure affect weather conditions and the formation of low-pressure systems.",
    category: "Pressure",
    readTime: "5 min read",
    gradient: "from-gray-400 to-slate-600"
  },
  {
    title: "Humidity and Its Effect on Heat Perception",
    excerpt: "Understanding the relationship between humidity and temperature, and how it affects human comfort and weather.",
    category: "Humidity",
    readTime: "5 min read",
    gradient: "from-emerald-400 to-green-600"
  },
  {
    title: "Climate Analysis Through Weather Data",
    excerpt: "Using weather data such as temperature, wind, and pressure to understand long-term climate patterns.",
    category: "Climate",
    readTime: "8 min read",
    gradient: "from-purple-400 to-fuchsia-600"
  }
];


  const weatherCards = [
    {
      title: "Cloud Layer",
      route: "/Cloudlayer",
      description: "Real-time cloud coverage and atmospheric conditions monitoring",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      gradient: "from-blue-400 to-indigo-500",
      featured: true
    },
    {
      title: "Temperature Layer",
      route: "/Temperaturelayer",
      description: "Interactive temperature distribution maps and heat analysis",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-purple-400 to-pink-500",
      featured: true
    },
    {
      title: "Pressure Layer",
      route: "/Pressurelayer",
      description: "Atmospheric pressure systems and weather pattern tracking",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: "from-indigo-400 to-purple-500",
      featured: true
    },
    {
      title: "Wind Layer",
      route: "/Windlayer",
      description: "Wind speed, direction, and flow pattern visualization",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      ),
      gradient: "from-cyan-400 to-blue-500",
      featured: true
    },
    {
      title: "Temperature Analysis",
      route: "/Temperature",
      description: "Detailed temperature data analysis and forecasting",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      gradient: "from-blue-500 to-indigo-600",
      featured: false
    },
    {
      title: "Pressure Systems",
      route: "/Pressure",
      description: "High and low pressure system identification and tracking",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-600",
      featured: false
    },
    {
      title: "Rainfall Monitor",
      route: "/Rain",
      description: "Precipitation tracking and rainfall intensity mapping",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
      gradient: "from-indigo-500 to-blue-600",
      featured: false
    },
    {
      title: "Wind Dynamics",
      route: "/wind",
      description: "Advanced wind pattern analysis and velocity measurements",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: "from-cyan-500 to-teal-600",
      featured: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pb-16 pt-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center" data-aos="fade-down">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Real-time Weather Monitoring</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Climate Intelligence
              <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent mt-2">
                Dashboard
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Advanced meteorological data visualization and analysis platform for comprehensive weather insights
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl" data-aos="fade-up" data-aos-delay="100">
                <div className="text-3xl font-bold text-white">8+</div>
                <div className="text-blue-200 text-sm">Data Layers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl" data-aos="fade-up" data-aos-delay="200">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-200 text-sm">Live Updates</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl" data-aos="fade-up" data-aos-delay="300">
                <div className="text-3xl font-bold text-white">Global</div>
                <div className="text-blue-200 text-sm">Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        {/* Featured Cards */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8" data-aos="fade-right">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">Featured Layers</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weatherCards.filter(card => card.featured).map((card, index) => (
              <Link 
                key={card.route}
                to={card.route}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative p-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${card.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    {card.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed mb-4">
                    {card.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-blue-600 group-hover:text-white transition-colors duration-300 font-semibold">
                    Explore
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Analysis Tools */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8" data-aos="fade-right">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">Analysis Tools</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weatherCards.filter(card => !card.featured).map((card, index) => (
              <Link 
                key={card.route}
                to={card.route}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-transparent shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative p-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white mb-3 group-hover:scale-110 transition-transform duration-500`}>
                    {card.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {card.description}
                  </p>
                  
                  <div className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                    View Details
                    <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Climate Articles Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8" data-aos="fade-right">
            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">Climate Articles</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <div className="space-y-8">
              {climateArticles.map((article, index) => (
                <article 
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  className="pb-8 border-b border-gray-200 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <span className="text-4xl">{article.image}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${article.gradient} text-white`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {article.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors cursor-pointer" dir="rtl">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-4" dir="rtl">
                        {article.excerpt}
                      </p>
                      
                      <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors">
                        Readmore
                        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Cutting-edge technology meets intuitive design for the ultimate weather monitoring experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                title: "Real-time Data",
                desc: "Instant updates from global weather stations"
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: "Advanced Analytics",
                desc: "Comprehensive data visualization tools"
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: "Global Coverage",
                desc: "Worldwide weather monitoring network"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-blue-100">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}