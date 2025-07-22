import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Security() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Security and Compliance Information
          </h1>
          <p className="text-gray-600 mb-8">Last updated: July 2025</p>
          
          <div className="space-y-6 sm:space-y-8">
            <section className="bg-green-50 border border-green-200 p-4 sm:p-6 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold text-green-900 mb-4">
                🛡️ Uluslararası Güvenlik Standartları
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">PCI DSS v4.0 Uyumu</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Kredi kartı veri güvenliği standardı</li>
                    <li>• 256-bit SSL/TLS şifreleme</li>
                    <li>• Güvenli ödeme işleme</li>
                    <li>• Düzenli güvenlik testleri</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">ISO 27001 Standartları</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Bilgi güvenliği yönetimi</li>
                    <li>• Risk değerlendirme süreçleri</li>
                    <li>• Sürekli izleme ve iyileştirme</li>
                    <li>• Güvenlik politikaları</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Türkiye Mevzuat Uyumu
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">KVKK Uyumu</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• 6698 sayılı KVKK kanunu</li>
                    <li>• Kişisel veri koruma</li>
                    <li>• Aydınlatma metni</li>
                    <li>• Veri güvenliği</li>
                  </ul>
                </div>
                
                <div className="border border-purple-200 bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Bankacılık Mevzuatı</h4>
                  <ul className="text-purple-800 text-sm space-y-1">
                    <li>• BDDK düzenlemeleri</li>
                    <li>• Sanal POS uyumu</li>
                    <li>• Ödeme hizmetleri</li>
                    <li>• KYC/AML prosedürleri</li>
                  </ul>
                </div>
                
                <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Tüketici Koruma</h4>
                  <ul className="text-orange-800 text-sm space-y-1">
                    <li>• 6502 sayılı kanun</li>
                    <li>• Mesafeli satış sözleşmesi</li>
                    <li>• İptal ve iade hakları</li>
                    <li>• Şeffaf fiyatlandırma</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Ödeme Güvenliği
              </h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-600 pl-4">
                  <h4 className="font-semibold text-gray-900">SSL/TLS Şifreleme</h4>
                  <p className="text-gray-700 text-sm mt-2">
                    Tüm veri transferleri 256-bit SSL/TLS şifreleme ile korunmaktadır. 
                    Bu, kredi kartı bilgilerinizin güvenli bir şekilde işlenmesini sağlar.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Güvenli Ödeme Altyapısı</h4>
                  <p className="text-gray-700 text-sm mt-2">
                    GloDiPay sanal POS sistemi ile entegre olarak, uluslararası güvenlik standartlarında 
                    ödeme işlemleri gerçekleştirilmektedir.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-600 pl-4">
                  <h4 className="font-semibold text-gray-900">3D Secure Doğrulama</h4>
                  <p className="text-gray-700 text-sm mt-2">
                    Kredi kartı işlemlerinde 3D Secure teknolojisi kullanılarak 
                    ek güvenlik katmanı sağlanmaktadır.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Veri Koruma Tedbirleri
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Teknik Güvenlik</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• <strong>Şifreleme:</strong> AES-256 veri şifreleme</li>
                    <li>• <strong>Erişim Kontrolü:</strong> Çok faktörlü kimlik doğrulama</li>
                    <li>• <strong>Güvenlik Duvarı:</strong> WAF ve DDoS koruması</li>
                    <li>• <strong>İzleme:</strong> 7/24 güvenlik izleme</li>
                    <li>• <strong>Yedekleme:</strong> Otomatik veri yedekleme</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">İdari Güvenlik</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• <strong>Personel Eğitimi:</strong> Güvenlik farkındalığı</li>
                    <li>• <strong>Erişim Yetkileri:</strong> En az yetki prensibi</li>
                    <li>• <strong>Güvenlik Politikaları:</strong> Yazılı prosedürler</li>
                    <li>• <strong>Olay Müdahale:</strong> Acil durum planları</li>
                    <li>• <strong>Denetim:</strong> Düzenli güvenlik denetimleri</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                AML/CFT Uyumu
              </h2>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-3">
                  Kara Para Aklamayla Mücadele (AML)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• MASAK bildirimleri</li>
                    <li>• Müşteri kimlik doğrulama (KYC)</li>
                    <li>• Şüpheli işlem tespiti</li>
                    <li>• İşlem kayıt tutma</li>
                  </ul>
                  
                  <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• Risk değerlendirme</li>
                    <li>• Sürekli izleme</li>
                    <li>• Eğitim ve farkındalık</li>
                    <li>• İç kontrol sistemleri</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Sanal POS Uyumluluk
              </h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Teknik Gereksinimler</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-gray-700 text-sm">SSL Sertifikası</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-gray-700 text-sm">PCI DSS Uyumu</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-gray-700 text-sm">KVKK Uyumu</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Yasal Gereksinimler</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-gray-700 text-sm">Şirket Bilgileri</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-gray-700 text-sm">İletişim Bilgileri</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-gray-700 text-sm">Hizmet Şartları</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Kullanıcı Deneyimi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-gray-700 text-sm">Mobil Uyumluluk</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-gray-700 text-sm">Şeffaf Fiyatlandırma</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-gray-700 text-sm">İptal/İade Politikası</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">
                Sertifikalar ve Denetimler
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Aktif Sertifikalar</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• SSL/TLS Sertifikası: Let's Encrypt</li>
                    <li>• PCI DSS Compliance: Level 1</li>
                    <li>• KVKK Uyum Belgesi</li>
                    <li>• ISO 27001 Bilgi Güvenliği</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Düzenli Denetimler</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Aylık güvenlik taraması</li>
                    <li>• Üç aylık penetrasyon testi</li>
                    <li>• Yıllık uyumluluk denetimi</li>
                    <li>• Sürekli izleme ve raporlama</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-100 border border-gray-300 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                🔒 Güvenlik İletişimi
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                Güvenlik endişeleriniz veya bildirmek istediğiniz güvenlik açıkları için:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>E-posta:</strong> security@evisatr.xyz</p>
                  <p><strong>Acil Durum:</strong> 24 saat yanıt süresi</p>
                </div>
                <div>
                  <p><strong>KVKK Başvuru:</strong> privacy@evisatr.xyz</p>
                  <p><strong>Normal Talepler:</strong> 72 saat yanıt süresi</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}