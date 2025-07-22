import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function KVKK() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni
          </h1>
          <p className="text-gray-600 mb-8">Son güncelleme: Temmuz 2025</p>
          
          <div className="space-y-6 sm:space-y-8">
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                1. Veri Sorumlusu
              </h2>
              <p className="text-gray-700 mb-4">
                evisatr.xyz olarak, kişisel verilerinizin işlenmesinde veri sorumlusu sıfatıyla hareket etmekteyiz.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>İletişim:</strong> info@evisatr.xyz<br/>
                  <strong>Web Sitesi:</strong> https://evisatr.xyz
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                2. İşlenen Kişisel Veriler
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Kimlik Bilgileri</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ad, soyad</li>
                    <li>• Doğum tarihi</li>
                    <li>• Doğum yeri</li>
                    <li>• Anne/baba adı</li>
                    <li>• Milliyet</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">İletişim Bilgileri</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• E-posta adresi</li>
                    <li>• Telefon numarası</li>
                    <li>• Adres bilgileri</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Pasaport Bilgileri</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Pasaport numarası</li>
                    <li>• Pasaport geçerlilik tarihi</li>
                    <li>• Veren makam</li>
                    <li>• Pasaport fotoğrafı</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">Seyahat Bilgileri</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Varış tarihi</li>
                    <li>• Seyahat amacı</li>
                    <li>• Kalacak yer bilgileri</li>
                    <li>• Sigorta bilgileri</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                3. Kişisel Verilerin İşlenme Amaçları
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="border-l-4 border-red-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Ana Amaçlar</h4>
                  <ul className="text-gray-700 mt-2 space-y-1">
                    <li>• Türkiye e-vize başvuru işlemlerinin gerçekleştirilmesi</li>
                    <li>• Seyahat sigortası başvuru işlemlerinin yürütülmesi</li>
                    <li>• Müşteri hizmetleri ve destek sağlanması</li>
                    <li>• Başvuru durumu hakkında bilgilendirme yapılması</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Yasal Yükümlülükler</h4>
                  <ul className="text-gray-700 mt-2 space-y-1">
                    <li>• Türk makamlarına başvuru bilgilerinin iletilmesi</li>
                    <li>• Mali mevzuat gereği kayıt tutma</li>
                    <li>• MASAK bildirimleri ve AML/CFT uyumu</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                4. Veri İşleme Hukuki Sebepleri
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-gray-700 space-y-2">
                  <li><strong>KVKK m.5/2-a:</strong> Açık rıza (pazarlama faaliyetleri için)</li>
                  <li><strong>KVKK m.5/2-c:</strong> Sözleşmenin kurulması ve ifası</li>
                  <li><strong>KVKK m.5/2-e:</strong> Yasal yükümlülüklerin yerine getirilmesi</li>
                  <li><strong>KVKK m.5/2-f:</strong> Meşru menfaatler (müşteri hizmetleri)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                5. Kişisel Verilerin Paylaşılması
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Resmi Makamlar</h4>
                  <p className="text-gray-700 text-sm">
                    Vize başvurunuzun işlenmesi amacıyla Türkiye Cumhuriyeti makamları ile paylaşılmaktadır.
                  </p>
                </div>
                
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Hizmet Sağlayıcılar</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Ödeme hizmet sağlayıcılar (GloDiPay)</li>
                    <li>• E-posta hizmet sağlayıcılar (SendGrid)</li>
                    <li>• Bulut hizmet sağlayıcılar (Güvenli veri saklama)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                6. Kişisel Veri Sahibinin Hakları
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Temel Haklar</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Bilgi talep etme</li>
                    <li>• Verilerin düzeltilmesini isteme</li>
                    <li>• Verilerin silinmesini isteme</li>
                    <li>• İşlemeye itiraz etme</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">İleri Haklar</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Veri taşınabilirliği</li>
                    <li>• Otomatik karar vermeye itiraz</li>
                    <li>• Şikâyet başvurusu</li>
                    <li>• Tazminat talep etme</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Başvuru Yolu:</strong> Haklarınızı kullanmak için info@evisatr.xyz adresine 
                  kimlik belgesi ile birlikte yazılı olarak başvurabilirsiniz.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                7. Veri Güvenliği
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">🔒</div>
                  <h4 className="font-semibold text-gray-900 mb-2">SSL/TLS Şifreleme</h4>
                  <p className="text-gray-700 text-sm">Tüm veri iletimi şifrelenir</p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">🛡️</div>
                  <h4 className="font-semibold text-gray-900 mb-2">PCI DSS Uyumu</h4>
                  <p className="text-gray-700 text-sm">Ödeme veri güvenliği standardı</p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">📋</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Düzenli Denetim</h4>
                  <p className="text-gray-700 text-sm">Güvenlik kontrolleri</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                8. Saklama Süreleri
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-gray-700 space-y-2">
                  <li><strong>Vize Başvuru Verileri:</strong> 5 yıl (Mali mevzuat gereği)</li>
                  <li><strong>Sigorta Başvuru Verileri:</strong> 10 yıl (Sigorta mevzuatı gereği)</li>
                  <li><strong>İletişim Kayıtları:</strong> 2 yıl</li>
                  <li><strong>Log Kayıtları:</strong> 1 yıl</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                9. Çerez Politikası
              </h2>
              <p className="text-gray-700 mb-4">
                Web sitemizde aşağıdaki amaçlarla çerezler kullanılmaktadır:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Zorunlu Çerezler</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Oturum yönetimi</li>
                    <li>• Güvenlik</li>
                    <li>• Tercih kaydetme</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Analitik Çerezler</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Site kullanım analizi</li>
                    <li>• Performans izleme</li>
                    <li>• Hata tespiti</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-red-900 mb-4">
                İletişim ve Başvuru
              </h2>
              <p className="text-red-800 mb-4">
                KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki bilgilerle iletişime geçebilirsiniz:
              </p>
              <div className="text-red-800 text-sm">
                <p><strong>E-posta:</strong> info@evisatr.xyz</p>
                <p><strong>Konu:</strong> "KVKK Başvurusu - [Adınız Soyadınız]"</p>
                <p><strong>Gerekli Belgeler:</strong> Kimlik belgesi fotokopisi, imzalı başvuru dilekçesi</p>
                <p><strong>Yanıt Süresi:</strong> En geç 30 gün içinde</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}