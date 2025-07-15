import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IdCard, CreditCard, Download, Shield, Star, Crown, Search } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Turkish landmark images with real photos
  const turkishLandmarks = [
    {
      name: "Hagia Sophia",
      location: "Istanbul",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "Historic Byzantine masterpiece"
    },
    {
      name: "Cappadocia",
      location: "Nevşehir",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6930311?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "Fairy chimneys and hot air balloons"
    },
    {
      name: "Pamukkale",
      location: "Denizli",
      image: "https://images.unsplash.com/photo-1565214950140-7fa6b7b2a5a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "Natural thermal pools"
    },
    {
      name: "Ephesus",
      location: "İzmir",
      image: "https://images.unsplash.com/photo-1580500804811-48b6248e4df7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "Ancient Greek city ruins"
    },
    {
      name: "Bosphorus",
      location: "Istanbul",
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "Bridge between Europe and Asia"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % turkishLandmarks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);



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
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${landmark.image})` }}
              />
              <div className="absolute inset-0 bg-black opacity-50" />
            </div>
          ))}
        </div>



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
