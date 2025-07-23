import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Cancellation and Refund Policy
          </h1>
          <p className="text-gray-600 mb-8">Last updated: July 2025</p>
          
          <div className="space-y-6 sm:space-y-8">
            <section className="bg-red-50 border border-red-200 p-4 sm:p-6 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold text-red-900 mb-4">
                ⚠️ Önemli Uyarı
              </h2>
              <p className="text-red-800 mb-4">
                Vize başvuru hizmetimiz, başvuru sürecinin başlatılması ile birlikte maliyetler oluşturan bir hizmettir. 
                Bu nedenle iptal ve iade koşulları kısıtlıdır.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                1. Genel İptal Koşulları
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">✅ İade Edilebilir Durumlar</h3>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Teknik arıza nedeniyle işlem tamamlanamama</li>
                    <li>• Hizmet sağlayıcı kaynaklı hatalar</li>
                    <li>• Çift ödeme durumları</li>
                    <li>• Yetkili makamlar tarafından hizmet durdurma</li>
                  </ul>
                </div>
                
                <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">❌ İade Edilemez Durumlar</h3>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• Vize başvurusu resmi makamlara iletildikten sonra</li>
                    <li>• Müşteri kaynaklı hatalı bilgi verme</li>
                    <li>• Eksik/hatalı belge teslimi</li>
                    <li>• Vize reddi durumları</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                2. Vize Başvuru İptal Koşulları
              </h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Başvuru Öncesi İptal (24 saat içinde)</h4>
                  <p className="text-gray-700 text-sm mt-2">
                    Başvuru formu doldurulup ödeme yapıldıktan sonra 24 saat içinde, 
                    başvuru henüz resmi makamlara iletilmemişse %80 iade yapılabilir.
                  </p>
                  <div className="bg-blue-50 p-3 rounded mt-2">
                    <p className="text-blue-800 text-xs">
                      <strong>İade Tutarı:</strong> Toplam ödenen tutarın %80'i (işlem masrafları düşülür)
                    </p>
                  </div>
                </div>
                
                <div className="border-l-4 border-orange-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Başvuru Sonrası İptal</h4>
                  <p className="text-gray-700 text-sm mt-2">
                    Başvuru resmi makamlara iletildikten sonra iptal mümkün değildir. 
                    Bu durumda sadece hizmet bedeli kısmen iade edilebilir.
                  </p>
                  <div className="bg-orange-50 p-3 rounded mt-2">
                    <p className="text-orange-800 text-xs">
                      <strong>İade Tutarı:</strong> Vize başvuru ücreti (69$) iade edilmez, sadece işlem ücreti değerlendirilir
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                3. Seyahat Sigortası İptal Koşulları
              </h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Sigorta Başlangıç Öncesi İptal</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Seyahat tarihi başlamadan 48 saat öncesine kadar: %90 iade</li>
                    <li>• Seyahat tarihi başlamadan 24 saat öncesine kadar: %70 iade</li>
                    <li>• Seyahat başladıktan sonra: İade yapılmaz</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Özel Durumlar</h4>
                  <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• Sağlık raporu ile belgelenmiş hastalık: %100 iade</li>
                    <li>• Vize reddi durumu: %100 iade</li>
                    <li>• Doğal afet/olağanüstü durumlar: %100 iade</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                4. İade Süreci ve Yöntemi
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">İade Başvuru Adımları</h4>
                  <ol className="list-decimal list-inside text-gray-700 text-sm space-y-2">
                    <li>info@getvisa.tr adresine e-posta gönderiniz</li>
                    <li>Başvuru numaranızı ve iptal nedeninizi belirtiniz</li>
                    <li>Gerekli belgeleri ekleyiniz</li>
                    <li>48 saat içinde geri dönüş alacaksınız</li>
                    <li>Onay sonrası 5-10 iş günü içinde iade yapılır</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">İade Yöntemleri</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• <strong>Kredi Kartı:</strong> Ödeme yapılan karta iade</li>
                    <li>• <strong>Banka Havalesi:</strong> IBAN bilgisi ile</li>
                    <li>• <strong>İşlem Süresi:</strong> 5-10 iş günü</li>
                    <li>• <strong>İade Ücreti:</strong> Bankacılık işlem masrafları düşülür</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                5. Gerekli Belgeler
              </h2>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">İade Başvurusu İçin Gerekli</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>✓ Başvuru numarası</li>
                    <li>✓ Kimlik belgesi</li>
                    <li>✓ Ödeme makbuzu/faturası</li>
                    <li>✓ İptal gerekçesi belgesi</li>
                  </ul>
                  
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>✓ IBAN bilgisi (havale için)</li>
                    <li>✓ İmzalı iade talep formu</li>
                    <li>✓ Sağlık raporu (hastalık durumunda)</li>
                    <li>✓ Vize red belgesi (varsa)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                6. İtiraz ve Şikayet Süreci
              </h2>
              
              <div className="space-y-4">
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">1. Seviye - Müşteri Hizmetleri</h4>
                  <p className="text-blue-800 text-sm">
                    İlk olarak info@getvisa.tr adresine itirazınızı iletin. 
                    48 saat içinde detaylı inceleme yapılır.
                  </p>
                </div>
                
                <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">2. Seviye - Üst Yönetim</h4>
                  <p className="text-green-800 text-sm">
                    Çözüm bulunamayan durumlar üst yönetime escalate edilir. 
                    7 iş günü içinde kesin karar verilir.
                  </p>
                </div>
                
                <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">3. Seviye - Tüketici Hakemliği</h4>
                  <p className="text-orange-800 text-sm">
                    Anlaşmazlık durumunda Tüketici Hakemlik Heyetleri'ne başvuru yapılabilir.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">
                İletişim ve Destek
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-800 text-sm mb-2">
                    <strong>E-posta:</strong> info@getvisa.tr
                  </p>
                  <p className="text-blue-800 text-sm mb-2">
                    <strong>Konu:</strong> "İade Talebi - [Başvuru Numaranız]"
                  </p>
                  <p className="text-blue-800 text-sm">
                    <strong>Çalışma Saatleri:</strong> 09:00-18:00 (Hafta içi)
                  </p>
                </div>
                
                <div>
                  <p className="text-blue-800 text-sm mb-2">
                    <strong>Acil Durumlar:</strong> 24 saat içinde yanıt
                  </p>
                  <p className="text-blue-800 text-sm mb-2">
                    <strong>Normal Talepler:</strong> 48 saat içinde yanıt
                  </p>
                  <p className="text-blue-800 text-sm">
                    <strong>İade İşlemi:</strong> 5-10 iş günü
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                💡 Önemli Hatırlatma
              </h3>
              <p className="text-yellow-800 text-sm">
                Bu politika Türk Tüketici Mevzuatı ve 6502 sayılı Tüketicinin Korunması Hakkında Kanun 
                çerçevesinde hazırlanmıştır. Tüketici haklarınız saklıdır.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}