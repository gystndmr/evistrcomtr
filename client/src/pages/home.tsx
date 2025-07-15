import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IdCard, CreditCard, Download, Shield, Star, Crown, Search } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow-lg p-2">
              <img 
                src={turkeyFlag} 
                alt="Turkey Flag" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Turkey E-Visa Application</h1>
            <p className="text-xl md:text-2xl mb-2 opacity-90">Professional Visa Service</p>
            <p className="text-lg md:text-xl mb-8 opacity-80">Fast and Reliable Electronic Visa Application</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/application">
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg">
                  <IdCard className="w-5 h-5 mr-2" />
                  Apply for E-Visa
                </Button>
              </Link>
              <Link href="/status">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg font-semibold bg-transparent">
                  <Search className="w-5 h-5 mr-2" />
                  <span className="inline-block">Check Application Status</span>
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
