import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, Rocket, Shield, Brain, Globe, Sparkles,
  ArrowRight, CheckCircle, Star, Play, Users,
  Phone, Mail, MapPin, Trophy, Target, Heart
} from "lucide-react";
import { Header } from "@/components/header";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const services = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Yapay zeka çözümleri ile işletmenizi geleceğe taşıyın",
      price: "5.000₺'den başlayan fiyatlar",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Rocket,
      title: "Startup Acceleration",
      description: "Girişiminizi hızla büyütme stratejileri ve mentörlük",
      price: "Ücretsiz değerlendirme",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Global Expansion",
      description: "Uluslararası pazarlara açılma ve global büyüme",
      price: "Özel fiyatlandırma",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Process Automation",
      description: "İş süreçlerinizi otomatize edin, verimliliği artırın",
      price: "10.000₺'den başlayan fiyatlar",
      color: "from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      company: "TechVision",
      text: "6 ayda %400 büyüme elde ettik. İnanılmaz sonuçlar!",
      avatar: "SC",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      company: "InnovateNow",
      text: "AI entegrasyonu ile operasyon maliyetlerimizi %60 azalttık.",
      avatar: "MJ",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      company: "FutureScale",
      text: "Global pazara açılmamızda rehberlik ettiler. Mükemmel!",
      avatar: "ER",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      
      {/* Mouse Follower Effect */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transition: 'all 0.1s ease-out'
        }}
      />

      {/* Hero Section with Glassmorphism */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Glassmorphism Card */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 shadow-2xl">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Next-Gen Business Solutions</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              FUTURE
              <span className="block text-5xl md:text-7xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                IS NOW
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Yapay zeka, otomasyon ve global stratejilerle işletmenizi yarının dünyasına hazırlıyoruz
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                <Rocket className="w-5 h-5 mr-2" />
                Ücretsiz Analiz Al
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm">
                <Play className="w-5 h-5 mr-2" />
                Demo İzle
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">500+</div>
                <div className="text-gray-400 text-sm">Başarılı Proje</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">%400</div>
                <div className="text-gray-400 text-sm">Ortalama Büyüme</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">24/7</div>
                <div className="text-gray-400 text-sm">Destek</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg rotate-12 opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-5 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg rotate-45 opacity-25 animate-spin-slow"></div>
      </section>

      {/* Services Section - Card Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              HİZMETLERİMİZ
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Gelecek teknolojileri ile işletmenizi dönüştürün
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group bg-white/5 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 cursor-pointer">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                        {service.price}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section - Timeline */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-20 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            ÇALIŞMA SÜRECİ
          </h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500"></div>
            
            {[
              { step: "01", title: "Analiz", desc: "Mevcut durumunuzu detaylı analiz ediyoruz" },
              { step: "02", title: "Strateji", desc: "Size özel çözüm stratejisi geliştiriyoruz" },
              { step: "03", title: "Uygulama", desc: "Planları hayata geçiriyoruz" },
              { step: "04", title: "Optimizasyon", desc: "Sürekli iyileştirme sağlıyoruz" }
            ].map((item, index) => (
              <div key={index} className={`flex items-center mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.desc}</p>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                  {item.step}
                </div>
                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Carousel Style */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-20 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            MÜŞTERİ HİKAYELERİ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-white/20 hover:border-white/30 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold & Modern */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              HAZIR MISINIZ?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              İşletmenizi geleceğe taşımak için bugün harekete geçin
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-4 text-xl font-bold rounded-full shadow-lg">
                <Phone className="w-5 h-5 mr-2" />
                0212 555 0123
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-4 text-xl font-bold rounded-full shadow-lg">
                <Mail className="w-5 h-5 mr-2" />
                Toplantı Planla
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-4">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">%100 Başarı</h4>
                <p className="text-gray-400 text-sm">Garantili sonuçlar</p>
              </div>
              <div className="p-4">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">Özel Çözümler</h4>
                <p className="text-gray-400 text-sm">Size özel stratejiler</p>
              </div>
              <div className="p-4">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">Güvenilir</h4>
                <p className="text-gray-400 text-sm">15+ yıl deneyim</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}