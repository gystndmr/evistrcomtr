import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Calendar, Users, Star } from "lucide-react";

export default function HomeConsulting() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-br from-orange-600 via-red-600 to-yellow-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              Seyyar Lokmacı Hasan Usta
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-md">
              30 yıllık deneyimle en lezzetli lokmaları kapınıza getiriyoruz
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg font-semibold">
                <Calendar className="w-5 h-5 mr-2" />
                Sipariş Ver
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-6 text-lg font-semibold">
                <Phone className="w-5 h-5 mr-2" />
                Hemen Ara
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <span className="text-4xl mr-3">🍯</span>
              <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-4">
                Lokma Çeşitlerimiz
              </h2>
              <span className="text-4xl ml-3">🍯</span>
            </div>
            <p className="text-lg text-gray-600">
              Geleneksel tariflerle hazırlanan nefis lokma çeşitlerimiz
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-white hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl border-2 border-orange-100">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🍯</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-orange-800">Klasik Lokma</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Geleneksel tarifle hazırlanan, şerbetli ve yumuşacık klasik lokma. 
                Osmanlı saray mutfağından günümüze gelen lezzet.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-white hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl border-2 border-orange-100">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🍫</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-orange-800">Çikolatalı Lokma</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Çikolata soslu özel lokma çeşidimiz. Çocukların ve gençlerin favorisi,
                modern lezzet ile geleneksel tatların buluşması.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-white hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl border-2 border-orange-100">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-orange-800">Özel Günler</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Düğün, mevlid, açılış ve özel günleriniz için toplu lokma dağıtımı.
                Sevincin paylaşılması için geleneksel hizmet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <span className="text-4xl mr-3">🚚</span>
              <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-4">
                Hizmet Bölgelerimiz
              </h2>
              <span className="text-4xl ml-3">🚚</span>
            </div>
            <p className="text-lg text-gray-600">
              İstanbul'un her yerine sıcak lokma servisimiz
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Fatih", description: "Tarihi yarımada bölgesi - 30 dk teslimat" },
              { name: "Beyoğlu", description: "Galata ve Taksim civarı - 25 dk teslimat" },
              { name: "Kadıköy", description: "Anadolu yakası merkez - 35 dk teslimat" },
              { name: "Beşiktaş", description: "Boğaz civarı bölgeler - 20 dk teslimat" },
              { name: "Üsküdar", description: "Anadolu yakası sahil - 30 dk teslimat" },
              { name: "Bakırköy", description: "Avrupa yakası sahil - 40 dk teslimat" }
            ].map((dest, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-orange-200">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🚚</span>
                  <h3 className="text-xl font-bold text-orange-800">{dest.name}</h3>
                </div>
                <p className="text-gray-700 mb-4 text-sm">{dest.description}</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                  Sipariş Ver
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hasan Usta ile İletişime Geçin
          </h2>
          <p className="text-xl mb-8 opacity-90">
            30 yıllık tecrübeli ustamız size en taze ve lezzetli lokmaları sunmaya hazır
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span>hasanusta@lokma.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>+90 (532) 123-4567</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg font-semibold shadow-lg">
              <span className="text-2xl mr-2">📞</span>
              Hemen Sipariş Ver
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gradient-to-r from-amber-800 to-orange-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="mb-2">© 2025 Seyyar Lokmacı Hasan Usta</p>
          <p className="text-gray-400">30 yıllık deneyimle geleneksel lokma üretimi</p>
        </div>
      </footer>
    </div>
  );
}