import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, MapPin, Clock, Star, Phone, Instagram, 
  ArrowRight, CheckCircle, Utensils, Truck, Award,
  Users, Heart, Coffee, Cake
} from "lucide-react";
import { Header } from "@/components/header";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Seyyar Lokmacımız",
      subtitle: "Taze ve Lezzetli Lokma",
      description: "Geleneksel tariflerle hazırlanan, taze ve sıcak lokmalarımızla şehrin her yerindeyiz!"
    },
    {
      title: "Özel Etkinlikler", 
      subtitle: "Düğün & Organizasyon",
      description: "Düğünleriniz, doğum günleriniz ve özel etkinlikleriniz için lokma ikramı hizmeti veriyoruz."
    },
    {
      title: "Günlük Taze Üretim",
      subtitle: "Sabahtan Hazır",
      description: "Her gün taze hazırlanan lokmalarımız, geleneksel lezzeti modern sunumla buluşturuyor."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      icon: Truck,
      title: "Seyyar Satış",
      description: "Şehrin çeşitli noktalarında, taze ve sıcak lokmalarımızı sunuyoruz.",
      features: ["Günlük Rotalar", "Taze Lokma", "Hızlı Servis", "Hijyenik Üretim"]
    },
    {
      icon: Users,
      title: "Etkinlik Catering",
      description: "Düğün, nişan, doğum günü ve özel etkinlikleriniz için lokma ikramı.",
      features: ["Düğün Paketi", "Doğum Günü", "Kurumsal Etkinlik", "Özel Organizasyon"]
    },
    {
      icon: Heart,
      title: "Geleneksel Lezzet",
      description: "Dededen kalma tariflerle, özenle hazırlanan geleneksel lokmalar.",
      features: ["Ev Yapımı", "Doğal Malzeme", "Geleneksel Tarif", "El Emeği"]
    },
    {
      icon: Clock,
      title: "Hızlı Teslimat",
      description: "Siparişlerinizi en kısa sürede taze ve sıcak olarak teslim ediyoruz.",
      features: ["30 Dk Teslimat", "Sıcak Servis", "Hijyenik Paket", "GPS Takip"]
    }
  ];

  const achievements = [
    { number: "5000+", label: "Mutlu Müşteri" },
    { number: "15000+", label: "Lokma Satışı" },
    { number: "50+", label: "Etkinlik" },
    { number: "3+", label: "Yıllık Deneyim" }
  ];

  const menu = [
    {
      name: "Klasik Lokma",
      description: "Geleneksel tarif ile hazırlanan, şerbet dökümlü lokma",
      price: "100₺",
      portion: "1 kg"
    },
    {
      name: "Özel Lokma",
      description: "Fıstık, hindistan cevizi ve özel soslarla süslenmiş lokma",
      price: "150₺", 
      portion: "1 kg"
    },
    {
      name: "Mini Lokma",
      description: "Çocuklar için özel hazırlanmış mini boy lokmalar",
      price: "80₺",
      portion: "1 kg"
    },
    {
      name: "Etkinlik Paketi",
      description: "100+ kişilik etkinlikler için özel hazırlanan büyük paket",
      price: "800₺",
      portion: "10 kg"
    }
  ];

  const testimonials = [
    {
      name: "Ayşe Hanım",
      event: "Düğün",
      text: "Düğünümüzde lokma ikramı harika oldu! Misafirlerimiz çok beğendi, teşekkürler!"
    },
    {
      name: "Mehmet Bey", 
      event: "Doğum Günü",
      text: "Oğlumun doğum günü için sipariş verdik. Lokma çok taze ve lezzetliydi!"
    },
    {
      name: "Fatma Hanım",
      event: "Nişan",
      text: "Nişanımızda lokma ikramı mükemmeldi. Herkese tavsiye ederim!"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] bg-gradient-to-br from-orange-600 via-red-600 to-yellow-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-6xl mx-auto">
            <div className="transition-all duration-1000 ease-in-out">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-orange-200 drop-shadow-md">
                {slides[currentSlide].subtitle}
              </h2>
              <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-4xl mx-auto leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-6 text-xl font-semibold">
                <ShoppingCart className="w-6 h-6 mr-2" />
                Sipariş Ver
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600 px-10 py-6 text-xl font-semibold">
                <MapPin className="w-6 h-6 mr-2" />
                Konumlarımız
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-800 mb-6">Hizmetlerimiz</h2>
            <p className="text-xl text-orange-600 max-w-3xl mx-auto">
              Geleneksel lezzeti modern hizmet anlayışıyla sunuyoruz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white">
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-orange-800">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-orange-600 mb-6 leading-relaxed text-lg">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-center text-sm text-orange-500">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-800 mb-6">Menümüz</h2>
            <p className="text-xl text-orange-600">Taze malzemelerle hazırlanan özel lokmalarımız</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {menu.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-orange-800">{item.name}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{item.price}</div>
                      <div className="text-sm text-orange-500">{item.portion}</div>
                    </div>
                  </div>
                  <p className="text-orange-600 mb-6 leading-relaxed">{item.description}</p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Sipariş Ver
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Başarılarımız</h2>
            <p className="text-xl text-orange-200">Müşteri memnuniyeti ile büyüyoruz</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-8">
                <div className="text-5xl font-bold mb-3 text-white">
                  {achievement.number}
                </div>
                <div className="text-orange-200 text-lg">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-800 mb-6">Müşteri Yorumları</h2>
            <p className="text-xl text-orange-600">Mutlu müşterilerimizden gelen gerçek yorumlar</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-orange-600 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-orange-800">{testimonial.name}</p>
                    <p className="text-orange-500 text-sm">{testimonial.event}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-r from-red-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Lokma Siparişi Ver</h2>
          <p className="text-xl mb-10 opacity-90">
            Taze ve lezzetli lokmalarımızı denemek için hemen sipariş verin!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 px-10 py-6 text-xl font-semibold">
              <Phone className="w-6 h-6 mr-2" />
              Hemen Ara: 0532 123 4567
            </Button>
            <Button size="lg" className="bg-orange-800 hover:bg-orange-900 px-10 py-6 text-xl font-semibold">
              <Instagram className="w-6 h-6 mr-2" />
              Instagram'dan Takip Et
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-xl mb-2">İletişim</h4>
              <p className="text-orange-200">0532 123 4567</p>
              <p className="text-orange-200">@seyyarlokma</p>
            </div>
            <div>
              <h4 className="font-semibold text-xl mb-2">Çalışma Saatleri</h4>
              <p className="text-orange-200">Hafta İçi: 09:00 - 22:00</p>
              <p className="text-orange-200">Hafta Sonu: 10:00 - 23:00</p>
            </div>
            <div>
              <h4 className="font-semibold text-xl mb-2">Lokasyonlar</h4>
              <p className="text-orange-200">Kadıköy, Beşiktaş</p>
              <p className="text-orange-200">Şişli, Bakırköy</p>
            </div>
          </div>

          {/* Special Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Utensils className="w-8 h-8 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Hijyenik Üretim</h4>
              <p className="text-orange-200 text-sm">Sağlık Bakanlığı onaylı hijyen standartları</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Award className="w-8 h-8 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Kalite Garantisi</h4>
              <p className="text-orange-200 text-sm">100% müşteri memnuniyeti garantisi</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Heart className="w-8 h-8 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">El Emeği</h4>
              <p className="text-orange-200 text-sm">Geleneksel yöntemlerle el yapımı</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}