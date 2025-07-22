import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              🍪 Çerez Politikası ve Veri İşleme Aydınlatması
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 mb-2">
              Web sitemizde hizmet kalitesini artırmak ve deneyiminizi kişiselleştirmek amacıyla çerezler kullanıyoruz. 
              Kişisel verileriniz KVKK kapsamında işlenmektedir.
            </p>
            <div className="text-xs text-gray-600">
              <p className="mb-1">
                <strong>İşlenen Veriler:</strong> Kimlik (ad, soyad), iletişim (e-posta, telefon), seyahat bilgileri, pasaport verileri
              </p>
              <p className="mb-1">
                <strong>İşleme Amacı:</strong> Vize başvuru işlemleri, müşteri hizmetleri, yasal yükümlülükler
              </p>
              <p>
                <strong>Haklarınız:</strong> Bilgi talep etme, düzeltme, silme, işlemeye itiraz etme haklarınız bulunmaktadır.
                Detaylar için <a href="/privacy" className="text-red-600 underline">Gizlilik Politikası</a>'nı inceleyiniz.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button 
              onClick={acceptCookies}
              className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-4 py-2"
            >
              Kabul Et
            </Button>
            <Button 
              onClick={rejectCookies}
              variant="outline"
              className="text-xs sm:text-sm px-4 py-2"
            >
              Reddet
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="icon"
              className="self-end sm:self-center"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}