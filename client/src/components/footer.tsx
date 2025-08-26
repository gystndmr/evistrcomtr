import { Link } from "wouter";
import { MapPin, Phone, Clock, Heart, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-800 to-amber-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* İşletme Bilgileri */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-2xl">🍯</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Seyyar Lokmacı</h3>
                <p className="text-orange-200 text-sm">Geleneksel Lezzet</p>
              </div>
            </div>
            <p className="text-orange-100 text-sm mb-4 leading-relaxed">
              2015'ten beri İstanbul'un çeşitli noktalarında, babadan kalma geleneksel tarifleriyle
              taze ve sıcacık lokmalar üretiyoruz. Her lokma, özenle seçilmiş malzemeler ve
              %100 doğal bal ile hazırlanır.
            </p>
            <div className="flex items-center justify-center md:justify-start text-sm text-orange-200 mb-2">
              <Heart className="w-4 h-4 mr-2 text-orange-400" />
              <span>9 yıldır aynı lezzet, aynı kalite</span>
            </div>
          </div>
          
          {/* Lokasyon ve Çalışma Saatleri */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-center md:justify-start">
              <MapPin className="w-5 h-5 mr-2" />
              Bugün Neredeyiz?
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-orange-700/50 p-4 rounded-lg">
                <div className="font-semibold text-orange-200 mb-1">📍 Günün Lokasyonu</div>
                <div className="text-white font-medium">Ataşehir Bulvar - Carrefour Yanı</div>
                <div className="text-orange-200 text-xs">Ataşehir Bulvarı No: 142, Ataşehir/İstanbul</div>
              </div>
              
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-200 text-sm">14:00 - 22:00</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center md:justify-start space-x-2 mt-3">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-white font-semibold">05370625550</span>
              </div>
            </div>
          </div>
          
          {/* Menü ve İletişim */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">🍯 Özel Lokmalarımız</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-orange-700/30 rounded">
                <span className="text-orange-100">Klasik Ballı Lokma</span>
                <span className="text-white font-bold">₺15</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-orange-700/30 rounded">
                <span className="text-orange-100">Çikolatalı Lokma</span>
                <span className="text-white font-bold">₺20</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-orange-700/30 rounded">
                <span className="text-orange-100">Hindistan Cevizli</span>
                <span className="text-white font-bold">₺18</span>
              </div>
              <div className="text-center mt-4 p-3 bg-amber-600/50 rounded-lg">
                <div className="text-xs text-amber-100 mb-1">🏆 MÜŞTERİ FAVORİSİ</div>
                <div className="font-semibold text-white">Çikolatalı Lokma</div>
                <div className="text-xs text-amber-200">⭐ 4.8/5 Müşteri Puanı</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alt Bilgi Çubuğu */}
        <div className="border-t border-orange-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kalite Belgeleri */}
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center space-x-2 bg-green-600/80 px-3 py-1 rounded-full">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-xs font-medium">Günlük Taze Üretim</span>
                </div>
                <div className="flex items-center space-x-2 bg-amber-600/80 px-3 py-1 rounded-full">
                  <span className="text-xs">🍯</span>
                  <span className="text-xs font-medium">%100 Doğal Bal</span>
                </div>
                <div className="flex items-center space-x-2 bg-red-600/80 px-3 py-1 rounded-full">
                  <Heart className="w-3 h-3" />
                  <span className="text-xs font-medium">Geleneksel Tarif</span>
                </div>
              </div>
            </div>
            
            {/* Sosyal Medya ve İletişim */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-4 mb-3">
                <a href="#" className="flex items-center space-x-1 text-orange-200 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                  <span className="text-sm">@seyyarlokmaci</span>
                </a>
                <a href="mailto:seyyarlokmaci@gmail.com" className="flex items-center space-x-1 text-orange-200 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">İletişim</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-orange-200 mt-6 pt-6 border-t border-orange-700">
            <p className="font-medium text-white mb-2">
              &copy; 2025 Seyyar Lokmacı - Tüm hakları saklıdır
            </p>
            <p className="text-xs mb-2">
              <strong>Sipariş & Bilgi:</strong> seyyarlokmaci@gmail.com | <strong>Telefon:</strong> 05370625550
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Pazartesi-Pazar: 14:00-22:00
              </span>
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Mobil Servis - İstanbul Geneli
              </span>
              <span>🚐 Her gün farklı lokasyon</span>
            </div>
            <p className="mt-3 text-xs font-medium text-orange-100">
              "Ağzınızda eriyen lezzet, kalbinizde kalan anılar..."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}