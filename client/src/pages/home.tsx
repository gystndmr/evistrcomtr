import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IdCard, CreditCard, Download, Shield, Star, Crown, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";
import turkeySymbolRed from "@/assets/turkey-symbol-red.png";
import cappadociaImg from "../../../attached_assets/pexels-musaortac-14186574_1752590100661.jpg";
import ephesusImg from "../../../attached_assets/pexels-hilal-tosun-54875889-33011223_1752590240668.jpg";
import antalyaImg from "../../../attached_assets/pexels-mikhail-nilov-8322807_1752590250012.jpg";
import bosphorusImg from "../../../attached_assets/pexels-ugur-kahraman-1765266160-29649889_1752590268560.jpg";
import pamukkaleImg from "../../../attached_assets/pexels-fromsalih-27829278_1752590288989.jpg";
import hagiaSophiaImg from "../../../attached_assets/pexels-mustafa-eker-649114924-17634093_1752590829229.jpg";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  // Turkish landmark images 
  const turkishLandmarks = [
    { image: cappadociaImg },
    { image: ephesusImg }, 
    { image: antalyaImg },
    { image: bosphorusImg },
    { image: pamukkaleImg }
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
            <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
              <img 
                src={turkeySymbolRed} 
                alt="Turkey Symbol" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg tracking-wider">
              {t('header.title')}
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-3 drop-shadow-md border-b-2 border-white/30 pb-1 inline-block">
              {t('home.hero.title')}
            </h2>
            <p className="text-base md:text-lg mb-6 opacity-90 drop-shadow-sm font-medium">
              {t('home.hero.subtitle')}
            </p>
            


            {/* Transparent Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/application">
                <div className="bg-red-600/80 hover:bg-red-600/90 text-white px-12 py-4 text-xl font-semibold transition-all duration-200 cursor-pointer">
                  Apply Now
                </div>
              </Link>
              <Link href="/status">
                <div className="bg-blue-600/80 hover:bg-blue-600/90 text-white px-12 py-4 text-xl font-semibold transition-all duration-200 cursor-pointer">
                  Check Application Status
                </div>
              </Link>
            </div>
          </div>
        </div>


      </section>

      {/* Application Process Steps */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-4">{t('home.hero.steps')}</h2>
            <p className="text-base sm:text-lg text-neutral-600">{t('home.hero.subtitle')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-start gap-6 sm:gap-8 lg:gap-12">
            <div className="text-center sm:flex-1 max-w-xs mx-auto sm:mx-0">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-2">{t('home.steps.complete')}</h3>
              <p className="text-sm sm:text-base text-neutral-600 px-2">{t('home.steps.complete.desc')}</p>
            </div>
            
            <div className="text-center sm:flex-1 max-w-xs mx-auto sm:mx-0">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-2">{t('home.steps.payment')}</h3>
              <p className="text-sm sm:text-base text-neutral-600 px-2">{t('home.steps.payment.desc')}</p>
            </div>
            
            <div className="text-center sm:flex-1 max-w-xs mx-auto sm:mx-0">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-2">{t('home.steps.download')}</h3>
              <p className="text-sm sm:text-base text-neutral-600 px-2">{t('home.steps.download.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Insurance Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link href="/insurance">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4">
                <Shield className="w-5 h-5 mr-2" />
                {t('home.insurance.button')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
