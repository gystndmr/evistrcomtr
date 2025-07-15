import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IdCard, CreditCard, Download, Shield, Star, Crown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Turkish landmark images with gradient backgrounds
  const turkishLandmarks = [
    {
      name: "Hagia Sophia",
      location: "Istanbul",
      gradient: "from-blue-800 to-purple-900",
      description: "Historic Byzantine masterpiece"
    },
    {
      name: "Cappadocia",
      location: "Nevşehir",
      gradient: "from-orange-600 to-red-700",
      description: "Fairy chimneys and hot air balloons"
    },
    {
      name: "Pamukkale",
      location: "Denizli",
      gradient: "from-cyan-400 to-blue-600",
      description: "Natural thermal pools"
    },
    {
      name: "Ephesus",
      location: "İzmir",
      gradient: "from-amber-500 to-orange-600",
      description: "Ancient Greek city ruins"
    },
    {
      name: "Bosphorus",
      location: "Istanbul",
      gradient: "from-teal-600 to-blue-700",
      description: "Bridge between Europe and Asia"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % turkishLandmarks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % turkishLandmarks.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + turkishLandmarks.length) % turkishLandmarks.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Rotating Turkish Landmarks */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Background Slides */}
        <div className="absolute inset-0">
          {turkishLandmarks.map((landmark, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${landmark.gradient}`} />
              <div className="absolute inset-0 bg-black opacity-40" />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-8 shadow-2xl p-3">
              <img 
                src={turkeyFlag} 
                alt="Turkey Flag" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Republic of Türkiye
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 drop-shadow-md">
              e-Visa Services
            </h2>
            <p className="text-lg md:text-xl mb-6 opacity-90 drop-shadow-sm">
              Official Electronic Visa Application System
            </p>
            
            {/* Current Location Display */}
            <div className="mb-6 text-center">
              <p className="text-base opacity-80 mb-1">Discover Turkey</p>
              <div className="text-xl font-semibold">
                {turkishLandmarks[currentSlide].name}
              </div>
              <div className="text-base opacity-75">
                {turkishLandmarks[currentSlide].location} • {turkishLandmarks[currentSlide].description}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/application">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 text-xl font-semibold shadow-2xl border-2 border-red-600 hover:border-red-700">
                  <IdCard className="w-6 h-6 mr-3" />
                  Apply for e-Visa
                </Button>
              </Link>
              <Link href="/status">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-10 py-6 text-xl font-semibold bg-transparent shadow-2xl">
                  <Search className="w-6 h-6 mr-3" />
                  Check Application Status
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {turkishLandmarks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Application Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Simple 3-Step Process</h2>
            <p className="text-lg text-neutral-600">Get your Turkish e-visa in minutes</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Complete Application</h3>
              <p className="text-neutral-600">Fill out the visa application form with your correct information</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Make Payment</h3>
              <p className="text-neutral-600">Pay securely with your credit card or debit card</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Download E-Visa</h3>
              <p className="text-neutral-600">Download your e-visa when application is completed successfully</p>
            </div>
          </div>
        </div>
      </section>

      {/* Turkey Historical Sites */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Discover Turkey's Heritage</h2>
            <p className="text-lg text-neutral-600">Explore magnificent historical sites and cultural treasures</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative rounded-lg overflow-hidden shadow-lg h-64 group bg-gradient-to-br from-blue-600 to-blue-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24 text-white opacity-30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Hagia Sophia</h3>
                <p className="text-sm opacity-90">Iconic Byzantine masterpiece in Istanbul</p>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-lg h-64 group bg-gradient-to-br from-orange-500 to-red-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24 text-white opacity-30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Cappadocia</h3>
                <p className="text-sm opacity-90">Extraordinary rock formations and hot air balloons</p>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-lg h-64 group bg-gradient-to-br from-cyan-400 to-blue-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24 text-white opacity-30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Pamukkale</h3>
                <p className="text-sm opacity-90">Natural thermal pools and ancient ruins</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/insurance">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4">
                <Shield className="w-5 h-5 mr-2" />
                Get Travel Insurance for Turkey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
