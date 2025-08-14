import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LokmaHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🧿</div>
              <h1 className="text-2xl font-bold text-orange-600">Seyyar Lokmacı</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#hakkimizda" className="text-gray-600 hover:text-orange-600">Hakkımızda</a>
              <a href="#hizmetler" className="text-gray-600 hover:text-orange-600">Hizmetler</a>
              <a href="#galeri" className="text-gray-600 hover:text-orange-600">Galeri</a>
              <a href="#iletisim" className="text-gray-600 hover:text-orange-600">İletişim</a>
            </nav>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Sipariş Ver
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200">
            ✨ Taze ve Geleneksel ✨
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            En Taze <span className="text-orange-600">Lokma</span><br />
            Kapınıza Kadar
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Geleneksel Türk lezzeti lokma, özel günlerinizi daha da özel kılmak için 
            profesyonel servis ile kapınızda. Düğün, doğum günü, şirket etkinlikleri için ideal!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8">
              🍯 Hemen Sipariş Ver
            </Button>
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50 text-lg px-8">
              📞 Bilgi Al
            </Button>
          </div>
        </div>
      </section>

      {/* Hizmetler */}
      <section id="hizmetler" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Hizmetlerimiz
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-2">🎉</div>
                <CardTitle className="text-orange-600">Etkinlik Catering</CardTitle>
                <CardDescription>
                  Düğün, nişan, doğum günü gibi özel günleriniz için profesyonel lokma servisi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 50-500 kişilik etkinlikler</li>
                  <li>• Profesyonel servis ekibi</li>
                  <li>• Dekoratif sunum</li>
                  <li>• Temizlik dahil</li>
                </ul>
                <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                  Fiyat Al
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-2">🏢</div>
                <CardTitle className="text-orange-600">Kurumsal Hizmet</CardTitle>
                <CardDescription>
                  Şirket etkinlikleri, ofis parti ve toplantıları için lezzetli ikramlar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Ofis teslimatı</li>
                  <li>• Toplantı ikramları</li>
                  <li>• Şirket partileri</li>
                  <li>• Fatura ile ödeme</li>
                </ul>
                <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                  Teklif İste
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-2">🏠</div>
                <CardTitle className="text-orange-600">Ev Servisi</CardTitle>
                <CardDescription>
                  Aile toplantıları ve küçük buluşmalar için taze lokma servisi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Minimum 10 porsiyon</li>
                  <li>• Aynı gün teslimat</li>
                  <li>• Çay servisi dahil</li>
                  <li>• Ev konforunda</li>
                </ul>
                <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                  Sipariş Ver
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Neden Biz */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Neden Seyyar Lokmacı?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🥇</div>
              <h3 className="font-semibold text-gray-800 mb-2">15 Yıl Tecrübe</h3>
              <p className="text-gray-600 text-sm">Geleneksel lezzeti modern sunum ile birleştiriyoruz</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Hızlı Servis</h3>
              <p className="text-gray-600 text-sm">Siparişiniz 2 saat içinde hazır ve teslim</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="font-semibold text-gray-800 mb-2">Taze Üretim</h3>
              <p className="text-gray-600 text-sm">Her lokma taze yapılır, hiç bayatlamaz</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-semibold text-gray-800 mb-2">Uygun Fiyat</h3>
              <p className="text-gray-600 text-sm">En iyi kaliteyi en uygun fiyata sunuyoruz</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fiyatlar */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Fiyat Listesi
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-orange-200">
              <CardHeader className="text-center">
                <CardTitle className="text-orange-600">Küçük Paket</CardTitle>
                <div className="text-3xl font-bold text-gray-800">₺299</div>
                <CardDescription>20-30 kişilik</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 5 kg taze lokma</li>
                  <li>• Şerbet dahil</li>
                  <li>• Servis malzemeleri</li>
                  <li>• Temel sunum</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-600 shadow-lg">
              <CardHeader className="text-center bg-orange-50">
                <Badge className="mb-2 bg-orange-600 text-white">En Popüler</Badge>
                <CardTitle className="text-orange-600">Orta Paket</CardTitle>
                <div className="text-3xl font-bold text-gray-800">₺549</div>
                <CardDescription>50-70 kişilik</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 10 kg taze lokma</li>
                  <li>• Özel şerbet çeşitleri</li>
                  <li>• Dekoratif sunum</li>
                  <li>• Servis personeli</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-200">
              <CardHeader className="text-center">
                <CardTitle className="text-orange-600">Büyük Paket</CardTitle>
                <div className="text-3xl font-bold text-gray-800">₺899</div>
                <CardDescription>100+ kişilik</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 18 kg taze lokma</li>
                  <li>• Premium şerbet</li>
                  <li>• Lüks sunum standı</li>
                  <li>• 2 servis personeli</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="py-16 px-4 bg-gray-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">İletişim</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl mb-2">📞</div>
              <h3 className="font-semibold mb-2">Telefon</h3>
              <p>0555 123 45 67</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-semibold mb-2">E-posta</h3>
              <p>siparis@seyyarlokmaci.com</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📍</div>
              <h3 className="font-semibold mb-2">Hizmet Alanı</h3>
              <p>İstanbul Avrupa Yakası</p>
            </div>
          </div>
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            WhatsApp ile Sipariş Ver
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="text-2xl">🧿</div>
            <span className="text-xl font-bold text-orange-400">Seyyar Lokmacı</span>
          </div>
          <p className="text-gray-400 mb-4">
            Geleneksel Türk lezzeti, modern hizmet anlayışı
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-400">
            <span>© 2025 Seyyar Lokmacı</span>
            <span>•</span>
            <span>Tüm hakları saklıdır</span>
          </div>
        </div>
      </footer>
    </div>
  );
}