import { Link } from "wouter";
import { MapPin, Phone, Clock, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              🍯 Seyyar Lokmacı
            </h3>
            <p className="text-sm text-neutral-400 mb-4">
              Ağzınızda eriyen, ballı lokmaların tadına doyamayacaksınız! 
              Her gün farklı lokasyonlarda taze ve sıcacık lokmalarımızla hizmetinizdeyiz.
            </p>
            <div className="flex items-center text-sm text-neutral-400 mb-2">
              <Heart className="w-4 h-4 mr-2 text-orange-500" />
              <span>2015'ten beri lezzet dolu hizmet</span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">📍 Bugün Neredeyiz?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-semibold">Ataşehir Bulvar</div>
                  <div className="text-neutral-400">Carrefour Yanı, Ataşehir/İstanbul</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-neutral-400">14:00 - 22:00</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="text-neutral-400">0532 XXX XX XX</span>
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">🍯 Özel Menümüz</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>• Klasik Ballı Lokma - ₺15</li>
              <li>• Çikolatalı Lokma - ₺20</li>
              <li>• Hindistan Cevizli - ₺18</li>
              <li>• Tarçınlı Özel - ₺22</li>
              <li>• Fıstıklı Lokma - ₺25</li>
            </ul>
            <div className="mt-4 text-xs text-neutral-500">
              <p>🏆 En Popüler: Çikolatalı Lokma</p>
              <p>⭐ 4.8/5 Müşteri Memnuniyeti</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8">
          <div className="text-center text-sm text-neutral-400">
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-xs">Günlük Taze Üretim</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🍯</span>
                </div>
                <span className="text-xs">%100 Doğal Bal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs">Geleneksel Tarif</span>
              </div>
            </div>
            
            <p>&copy; 2025 Seyyar Lokmacı. Tüm hakları saklıdır.</p>
            <p className="mt-2 text-xs">
              <strong>İletişim:</strong> seyyarlokmaci@gmail.com | <strong>Sipariş Hattı:</strong> 0532 XXX XX XX
            </p>
            <p className="mt-2 text-xs">
              Her gün farklı lokasyonlarda, aynı lezzet ve kalite ile hizmetinizdeyiz!
            </p>
            <div className="mt-4 text-xs space-x-4">
              <span>🕐 Pazartesi-Pazar: 14:00-22:00</span>
              <span>📱 Instagram: @seyyarlokmaci</span>
              <span>🚐 Mobil Hizmet</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}