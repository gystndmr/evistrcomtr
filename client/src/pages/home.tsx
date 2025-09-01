import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Users, Award, Clock, Star, CheckCircle,
  ArrowRight, Phone, Mail, MapPin, Play, Download,
  GraduationCap, Badge as BadgeIcon, Target, Globe
} from "lucide-react";
import { Header } from "@/components/header";

export default function Home() {
  const courses = [
    {
      title: "Dijital Pazarlama Temel Eğitimi",
      description: "Dijital pazarlama stratejileri, sosyal medya yönetimi ve online reklam teknikleri",
      duration: "8 Hafta",
      level: "Başlangıç",
      price: "299₺",
      rating: 4.8,
      students: 1250
    },
    {
      title: "Web Tasarım ve Geliştirme",
      description: "HTML, CSS, JavaScript ile modern web siteleri tasarlama ve geliştirme",
      duration: "12 Hafta", 
      level: "Orta",
      price: "499₺",
      rating: 4.9,
      students: 890
    },
    {
      title: "Grafik Tasarım Fundamentals",
      description: "Adobe Photoshop, Illustrator ile profesyonel grafik tasarım teknikleri",
      duration: "10 Hafta",
      level: "Başlangıç",
      price: "399₺",
      rating: 4.7,
      students: 1520
    },
    {
      title: "Proje Yönetimi Sertifikası",
      description: "Agile, Scrum metodolojileri ile etkin proje yönetimi becerileri",
      duration: "6 Hafta",
      level: "İleri",
      price: "599₺",
      rating: 4.9,
      students: 650
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Kapsamlı Müfredat",
      description: "Sektör uzmanları tarafından hazırlanan güncel eğitim içerikleri"
    },
    {
      icon: Users,
      title: "Uzman Eğitmenler",
      description: "Alanında deneyimli, sertifikalı eğitmenlerden öğrenme fırsatı"
    },
    {
      icon: BadgeIcon,
      title: "Sertifika Programı",
      description: "Tamamlanan kurslar için geçerli sertifika ve diploma belgesi"
    },
    {
      icon: Clock,
      title: "Esnek Öğrenme",
      description: "Kendi hızınızda, istediğiniz zaman öğrenme imkanı"
    }
  ];

  const testimonials = [
    {
      name: "Ayşe Kaya",
      course: "Dijital Pazarlama",
      text: "Kurs sayesinde kariyerimde büyük ilerleme kaydettim. Eğitmenler çok deneyimli ve içerik çok kaliteli.",
      rating: 5
    },
    {
      name: "Mehmet Özkan",
      course: "Web Geliştirme",
      text: "Sıfırdan başladım ve artık freelance web developer olarak çalışıyorum. Harika bir deneyimdi.",
      rating: 5
    },
    {
      name: "Zeynep Yılmaz",
      course: "Grafik Tasarım",
      text: "Hobimden mesleğime dönüştürdüğüm alan. EduLearn'de aldığım eğitim çok faydalıydı.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Geleceğinizi Şekillendirin
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Uzman eğitmenlerden öğrenin, sertifikalı kurslarla kariyerinizi ileriye taşıyın
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Kurslara Göz At
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Tanıtım Videosunu İzle
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold">5000+</div>
                <div className="text-blue-200">Başarılı Öğrenci</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-200">Uzman Eğitmen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-blue-200">Aktif Kurs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Neden EduLearn?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern eğitim teknolojileri ile kariyerinizi ileriye taşıyın
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popüler Kurslar</h2>
            <p className="text-xl text-gray-600">En çok tercih edilen eğitim programlarımız</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{course.level}</Badge>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">{course.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {course.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {course.students} öğrenci
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Kayıt Ol
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Tüm Kursları Görüntüle
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Öğrenci Yorumları</h2>
            <p className="text-xl text-gray-600">Başarılı öğrencilerimizden gelen geri bildirimler</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-blue-600 text-sm">{testimonial.course} Kursu</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Eğitime Bugün Başlayın</h2>
          <p className="text-xl mb-10 text-blue-100">
            Uzman eğitmenlerden öğrenin, kariyerinizi ileriye taşıyın
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
              <Phone className="w-5 h-5 mr-2" />
              0212 444 0 555
            </Button>
            <Button size="lg" className="bg-blue-800 hover:bg-blue-900 px-8 py-3 text-lg">
              <Mail className="w-5 h-5 mr-2" />
              Bilgi Al
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-lg mb-2">İletişim</h4>
              <p className="text-blue-200">0212 444 0 555</p>
              <p className="text-blue-200">info@edulearn.com.tr</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Çalışma Saatleri</h4>
              <p className="text-blue-200">Pazartesi - Cuma</p>
              <p className="text-blue-200">09:00 - 18:00</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Adres</h4>
              <p className="text-blue-200">Levent Mah. Büyükdere Cad.</p>
              <p className="text-blue-200">İstanbul, Türkiye</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EduLearn</span>
              </div>
              <p className="text-gray-400 mb-4">
                Türkiye'nin önde gelen online eğitim platformu
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Kurslar</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses" className="hover:text-white">Dijital Pazarlama</Link></li>
                <li><Link href="/courses" className="hover:text-white">Web Geliştirme</Link></li>
                <li><Link href="/courses" className="hover:text-white">Grafik Tasarım</Link></li>
                <li><Link href="/courses" className="hover:text-white">Proje Yönetimi</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Kurumsal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">Hakkımızda</Link></li>
                <li><Link href="/about" className="hover:text-white">Eğitmenler</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">İletişim</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Yasal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Gizlilik Politikası</Link></li>
                <li><Link href="/terms" className="hover:text-white">Kullanım Şartları</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Çerez Politikası</Link></li>
                <li><Link href="/terms" className="hover:text-white">İade Politikası</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EduLearn. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}