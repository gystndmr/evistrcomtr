import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Calendar, Users, Star } from "lucide-react";

export default function HomeConsulting() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              Türkiye Seyahat Danışmanlığı
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-md">
              Türkiye'deki unutulmaz seyahatinizi planlayın
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                <Calendar className="w-5 h-5 mr-2" />
                Seyahat Planla
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold">
                <Phone className="w-5 h-5 mr-2" />
                Danışmanlık Al
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hizmetlerimiz
            </h2>
            <p className="text-lg text-gray-600">
              Türkiye seyahatinizin her aşamasında yanınızdayız
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seyahat Planlaması</h3>
              <p className="text-gray-600">
                Kişisel tercihlerinize göre özel seyahat rotaları ve aktivite önerileri
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Grup Turları</h3>
              <p className="text-gray-600">
                Arkadaşlarınızla veya ailenizle unutulmaz grup seyahatleri organize ediyoruz
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Kültürel Rehberlik</h3>
              <p className="text-gray-600">
                Türkiye'nin zengin kültürü ve tarihi hakkında detaylı bilgi ve rehberlik
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popüler Destinasyonlar
            </h2>
            <p className="text-lg text-gray-600">
              Türkiye'nin en güzel yerlerini keşfedin
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "İstanbul", description: "Tarihi yarımada ve modern yaşam" },
              { name: "Kapadokya", description: "Balon turu ve kaya şehirleri" },
              { name: "Antalya", description: "Deniz, güneş ve antik kalıntılar" },
              { name: "Pamukkale", description: "Beyaz travertenler ve termal su" },
              { name: "Efes", description: "Antik çağın izlerini sürmek" },
              { name: "Bodrum", description: "Ege'nin incisi ve gece hayatı" }
            ].map((dest, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{dest.name}</h3>
                <p className="text-gray-600 mb-4">{dest.description}</p>
                <Button variant="outline" size="sm">
                  Detaylı Bilgi
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Seyahat Danışmanlarımızla İletişime Geçin
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Uzman ekibimiz size en iyi seyahat deneyimini sunmak için hazır
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span>info@evisatr.xyz</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>+90 (212) 555-0123</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              <Mail className="w-5 h-5 mr-2" />
              Ücretsiz Danışmanlık
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="mb-2">© 2025 Türkiye Seyahat Danışmanlığı</p>
          <p className="text-gray-400">info@evisatr.xyz</p>
        </div>
      </footer>
    </div>
  );
}