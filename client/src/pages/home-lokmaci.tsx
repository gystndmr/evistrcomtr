import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, Star, Utensils, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LokmacıHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  // Lokma görselleri (placeholder olarak genel yemek resimleri)
  const lokmaImages = [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23D2691E'/%3E%3Ccircle cx='200' cy='150' r='30' fill='%23CD853F'/%3E%3Ccircle cx='300' cy='180' r='25' fill='%23CD853F'/%3E%3Ccircle cx='400' cy='160' r='28' fill='%23CD853F'/%3E%3Ccircle cx='500' cy='140' r='32' fill='%23CD853F'/%3E%3Ccircle cx='600' cy='170' r='26' fill='%23CD853F'/%3E%3Ctext x='400' y='350' text-anchor='middle' font-family='Arial' font-size='48' fill='white'%3ETaze Lokma%3C/text%3E%3Ctext x='400' y='400' text-anchor='middle' font-family='Arial' font-size='24' fill='white'%3ESıcacık & Tatlı%3C/text%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23B8860B'/%3E%3Ccircle cx='150' cy='200' r='35' fill='%23DAA520'/%3E%3Ccircle cx='250' cy='160' r='30' fill='%23DAA520'/%3E%3Ccircle cx='350' cy='190' r='33' fill='%23DAA520'/%3E%3Ccircle cx='450' cy='170' r='28' fill='%23DAA520'/%3E%3Ccircle cx='550' cy='200' r='31' fill='%23DAA520'/%3E%3Ccircle cx='650' cy='160' r='29' fill='%23DAA520'/%3E%3Ctext x='400' y='350' text-anchor='middle' font-family='Arial' font-size='44' fill='white'%3EBallı Lokma%3C/text%3E%3Ctext x='400' y='400' text-anchor='middle' font-family='Arial' font-size='22' fill='white'%3E100%25 Doğal Bal%3C/text%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23A0522D'/%3E%3Ccircle cx='180' cy='180' r='32' fill='%23D2B48C'/%3E%3Ccircle cx='280' cy='150' r='27' fill='%23D2B48C'/%3E%3Ccircle cx='380' cy='175' r='30' fill='%23D2B48C'/%3E%3Ccircle cx='480' cy='160' r='29' fill='%23D2B48C'/%3E%3Ccircle cx='580' cy='185' r='31' fill='%23D2B48C'/%3E%3Ctext x='400' y='350' text-anchor='middle' font-family='Arial' font-size='42' fill='white'%3EÇikolatalı Lokma%3C/text%3E%3Ctext x='400' y='400' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3EÖzel Tarifimiz%3C/text%3E%3C/svg%3E"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % lokmaImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Background Slides */}
        <div className="absolute inset-0">
          {lokmaImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image}
                alt={`Lokma ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-40" />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              🍯 SEYYAR LOKMACI 🍯
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 drop-shadow-md">
              Taze • Sıcak • Lezzetli
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 drop-shadow-sm">
              Ağzınızda eriyen, ballı lokmaların tadına doyamayacaksınız!<br/>
              📍 Her gün farklı lokasyonlarda hizmetinizdeyiz
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
                <MapPin className="mr-2 h-5 w-5" />
                Bugün Neredeyiz?
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg">
                <Phone className="mr-2 h-5 w-5" />
                Sipariş Ver: 05370625550
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Özel Menümüz */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-yellow-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🍯 Özel Lokma Menümüz 🍯
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Geleneksel tariflerimizle hazırlanan, taze ve sıcacık lokmalarımız
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-600">🍯 Klasik Lokma</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Geleneksel ballı lokma, ağzınızda eriyen lezzet</p>
                <div className="text-2xl font-bold text-orange-600 mb-2">₺15</div>
                <div className="text-sm text-gray-500">10 adet</div>
                <div className="flex justify-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow duration-300 border-orange-200">
              <CardHeader>
                <Badge className="bg-orange-100 text-orange-800 mb-2">EN POPÜLER</Badge>
                <CardTitle className="text-2xl text-orange-600">🍫 Çikolatalı Lokma</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Özel çikolata soslu, çocukların favorisi</p>
                <div className="text-2xl font-bold text-orange-600 mb-2">₺20</div>
                <div className="text-sm text-gray-500">10 adet</div>
                <div className="flex justify-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-600">🥥 Hindistan Cevizli</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Hindistan cevizi serpiştirilmiş özel lokma</p>
                <div className="text-2xl font-bold text-orange-600 mb-2">₺18</div>
                <div className="text-sm text-gray-500">10 adet</div>
                <div className="flex justify-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bugün Neredeyiz */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            📍 Bugün Neredeyiz?
          </h2>
          
          <Card className="bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-600 mr-2" />
                <span className="text-lg font-semibold text-gray-800">25 Ağustos 2025 - Pazar</span>
              </div>
              
              <div className="text-2xl font-bold text-orange-600 mb-2">
                🎯 Ataşehir Bulvar - Carrefour Yanı
              </div>
              
              <p className="text-gray-700 mb-4">
                📍 Ataşehir Bulvarı No: 142, Ataşehir/İstanbul<br/>
                🕐 Saatler: 14:00 - 22:00
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Phone className="mr-2 h-4 w-4" />
                  Sipariş Ver: 05370625550
                </Button>
                <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                  <MapPin className="mr-2 h-4 w-4" />
                  Haritada Gör
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Müşteri Yorumları */}
      <section className="py-16 bg-gradient-to-b from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            💬 Müşterilerimiz Ne Diyor?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Gerçekten muhteşem! Çocuklarım bayılıyor, haftada en az 2 kez geliyoruz."</p>
                <div className="font-semibold text-gray-800">- Ayşe Hanım</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Ballı lokma favorim! Hem taze hem de çok lezzetli. Kesinlikle tavsiye ederim."</p>
                <div className="font-semibold text-gray-800">- Mehmet Bey</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Çikolatalı lokma harika! Fiyatları da çok uygun. Ellerinize sağlık."</p>
                <div className="font-semibold text-gray-800">- Fatma Hanım</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}