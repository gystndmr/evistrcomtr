import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Code, Smartphone, Globe, Palette, Zap, Shield } from "lucide-react";

export default function HomeConsulting() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="text-xl font-bold text-gray-800">DigiStudio</div>
                  <div className="text-xs text-gray-600">Web Tasarım & Yazılım</div>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                Ana Sayfa
              </Link>
              <Link href="#services" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                Hizmetler
              </Link>
              <Link href="#contact" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                İletişim
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Proje Başlat
              </Button>
            </div>
          </div>
        </div>
      </header>

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
      <section id="services" className="py-16 bg-white">
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
      <section id="contact" className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Projenizi Konuşalım
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Hayalinizdeki dijital çözümü birlikte gerçekleştirelim
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              <Code className="w-5 h-5 mr-2" />
              Proje Başlat
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-6 text-lg font-semibold">
              <Smartphone className="w-5 h-5 mr-2" />
              Ücretsiz Konsültasyon
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">Hizmetler</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Web Tasarım</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Mobil Uygulama</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Özel Yazılım</Link></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">Teknolojiler</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-purple-400 transition-colors">React & Node.js</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Python & AI</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Cloud Solutions</Link></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:info@digistudio.com" className="hover:text-purple-400 transition-colors">info@digistudio.com</a></li>
                <li><a href="tel:+905551234567" className="hover:text-purple-400 transition-colors">+90 555 123 45 67</a></li>
                <li><span className="text-gray-400">İstanbul, Türkiye</span></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">DigiStudio</h3>
              <p className="text-sm text-gray-400 mb-4">
                Modern web tasarım ve yazılım çözümleri ile işletmenizi dijital dünyaya taşıyoruz.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 DigiStudio. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}