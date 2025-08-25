import { Link } from "wouter";
import { Phone, MapPin, Clock, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-orange-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <span className="text-3xl">🍯</span>
              <h3 className="text-xl font-bold text-orange-200">SEYYAR LOKMACI</h3>
            </div>
            <p className="text-orange-100 text-sm mb-4">
              Geleneksel tariflerimizle hazırlanan, taze ve sıcacık lokmalarımızın tadını çıkarın. 
              Her lokma, sevgiyle hazırlanır!
            </p>
            <div className="flex justify-center md:justify-start space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-orange-200 text-sm">%100 Doğal Malzemeler</span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-orange-200">Lokma Çeşitlerimiz</h3>
            <ul className="space-y-2 text-sm text-orange-100">
              <li>🍯 Klasik Ballı Lokma</li>
              <li>🍫 Çikolatalı Lokma</li>
              <li>🥥 Hindistan Cevizli Lokma</li>
              <li>🍓 Mevsim Özel Lokma</li>
              <li>🎂 Doğum Günü Özel Paket</li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-orange-200">İletişim Bilgileri</h3>
            <ul className="space-y-3 text-sm text-orange-100">
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="w-4 h-4 text-orange-300" />
                <span>0537 062 5550</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="w-4 h-4 text-orange-300" />
                <span>İstanbul - Mobil Servis</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Clock className="w-4 h-4 text-orange-300" />
                <span>14:00 - 22:00 (Her Gün)</span>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-orange-200">Bugün Neredeyiz?</h3>
            <div className="bg-orange-800 p-4 rounded-lg">
              <div className="text-orange-200 font-bold text-sm mb-2">📍 Ataşehir Bulvar</div>
              <div className="text-orange-100 text-xs mb-2">Carrefour Yanı</div>
              <div className="text-orange-100 text-xs mb-3">🕐 14:00 - 22:00</div>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">
                Sipariş Ver
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-orange-700 mt-8 pt-8">
          {/* Güven Rozeti */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <div className="flex items-center space-x-2 text-xs text-orange-200">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Hijyen Sertifikalı</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-orange-200">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span>Günlük Taze Üretim</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-orange-200">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">★</span>
              </div>
              <span>5 Yıldızlı Lezzet</span>
            </div>
          </div>
          
          {/* Ödeme Seçenekleri */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-xs text-orange-200 mr-2">Ödeme Seçenekleri:</div>
            <div className="flex items-center space-x-3 flex-wrap justify-center">
              {/* Nakit */}
              <div className="h-8 w-16 bg-green-700 rounded border flex items-center justify-center">
                <div className="text-white font-bold text-xs">NAKİT</div>
              </div>
              
              {/* Kart */}
              <div className="h-8 w-16 bg-blue-600 rounded border flex items-center justify-center">
                <div className="text-white font-bold text-xs">KART</div>
              </div>
              
              {/* QR */}
              <div className="h-8 w-16 bg-purple-600 rounded border flex items-center justify-center">
                <div className="text-white font-bold text-xs">QR</div>
              </div>
              
              {/* Transfer */}
              <div className="h-8 w-20 bg-orange-600 rounded border flex items-center justify-center">
                <div className="text-white font-bold text-xs">TRANSFER</div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-orange-200">
            {/* Lokma Emojileri */}
            <div className="flex items-center justify-center gap-4 mb-4 text-2xl">
              <span>🍯</span>
              <span>🍫</span>
              <span>🥥</span>
              <span>🍓</span>
              <span>🎂</span>
            </div>
            
            <p>&copy; 2025 Seyyar Lokmacı. Tüm hakları saklıdır.</p>
            <p className="mt-2 text-xs text-orange-300">Geleneksel lezzet, modern hizmet. Afiyet olsun!</p>
            
            <div className="mt-4 text-xs space-y-1 text-orange-300">
              <p><strong>İşletme Sahibi:</strong> Mehmet Usta - 25 Yıllık Tecrübe</p>
              <p><strong>Sipariş Hattı:</strong> 0537 062 5550 | WhatsApp: Aktif</p>
              <p><strong>Sosyal Medya:</strong> @seyyarlokmaci | Instagram & TikTok</p>
              <p><strong>Özel Günler:</strong> Doğum günü, düğün, özel etkinlik siparişleri alınır</p>
            </div>
            
            <p className="mt-4 text-xs text-orange-100 font-semibold">
              🍯 "Her lokma bir hikaye, her ısırık bir anı!" 🍯
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}