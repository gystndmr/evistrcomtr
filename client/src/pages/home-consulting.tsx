import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Code, Smartphone, Globe, Palette, Zap, Shield } from "lucide-react";

export default function HomeConsulting() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              DigiStudio - Web Tasarım & Yazılım
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-md">
              Modern ve kullanıcı dostu web siteleri ile dijital dünyadaki yerinizi alın
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                <Code className="w-5 h-5 mr-2" />
                Proje Başlat
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-6 text-lg font-semibold">
                <Smartphone className="w-5 h-5 mr-2" />
                Ücretsiz Analiz
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
              Dijital dünyada başarılı olmak için ihtiyacınız olan her şey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Web Tasarım</h3>
              <p className="text-gray-600">
                Modern, responsive ve kullanıcı dostu web siteleri tasarlıyoruz
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobil Uygulama</h3>
              <p className="text-gray-600">
                iOS ve Android platformları için mobil uygulamalar geliştiriyoruz
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Özel Yazılım</h3>
              <p className="text-gray-600">
                İşletmenizin ihtiyaçlarına özel yazılım çözümleri geliştiriyoruz
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kullandığımız Teknolojiler
            </h2>
            <p className="text-lg text-gray-600">
              En güncel teknolojilerle güçlü çözümler üretiyoruz
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "React", description: "Modern web uygulamaları" },
              { name: "Node.js", description: "Güçlü backend çözümleri" },
              { name: "Python", description: "AI ve veri analizi" },
              { name: "Flutter", description: "Cross-platform mobil" },
              { name: "AWS", description: "Bulut altyapı hizmetleri" },
              { name: "PostgreSQL", description: "Güvenli veri tabanı" },
              { name: "Docker", description: "Konteyner teknolojisi" },
              { name: "GraphQL", description: "Modern API çözümleri" }
            ].map((tech, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{tech.name}</h3>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Projenizi Konuşalım
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Dijital projelerinizi hayata geçirmek için hemen iletişime geçin
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <span>info@digistudio.com.tr</span>
            </div>
            <div className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              <span>+90 (212) 555-0178</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Palette className="w-8 h-8 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Tasarım Odaklı</h3>
              <p className="text-sm opacity-90">Kullanıcı deneyimini ön planda tutuyoruz</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Zap className="w-8 h-8 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Hızlı Teslimat</h3>
              <p className="text-sm opacity-90">Projelerinizi zamanında teslim ediyoruz</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Shield className="w-8 h-8 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Güvenli Kod</h3>
              <p className="text-sm opacity-90">En yüksek güvenlik standartları</p>
            </div>
          </div>
          
          <div className="mt-8">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              <Code className="w-5 h-5 mr-2" />
              Ücretsiz Proje Analizi
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DigiStudio</h3>
              <p className="text-gray-400 text-sm">Modern web tasarım ve yazılım geliştirme hizmetleri</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Hizmetler</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Web Tasarım</li>
                <li>Mobil Uygulama</li>
                <li>E-Ticaret</li>
                <li>SEO Optimizasyon</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Teknolojiler</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>React & Vue.js</li>
                <li>Node.js & Python</li>
                <li>Cloud Solutions</li>
                <li>AI Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">İletişim</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@digistudio.com.tr</li>
                <li>+90 (212) 555-0178</li>
                <li>İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 DigiStudio. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}