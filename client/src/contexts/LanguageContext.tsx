import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Auto-detect browser language with Turkish as primary, English as fallback
const detectBrowserLanguage = (): Language => {
  try {
    // Get browser language from navigator
    const browserLang = navigator.language.toLowerCase();
    const languageCode = browserLang.split('-')[0]; // Get primary language code
    
    console.log('Browser language detected:', browserLang, 'Code:', languageCode);
    
    // Check if we support this language
    const supportedLanguage = languages.find(lang => lang.code === languageCode);
    if (supportedLanguage) {
      console.log('Using supported language:', supportedLanguage.name);
      return supportedLanguage;
    }
    
    // If Turkish browser but no specific match, use Turkish
    if (browserLang.includes('tr')) {
      const turkishLang = languages.find(lang => lang.code === 'tr')!;
      console.log('Using Turkish for Turkish browser');
      return turkishLang;
    }
    
    // Default fallback to English
    console.log('Using English as fallback language');
    return languages.find(lang => lang.code === 'en')!;
  } catch (error) {
    console.warn('Error detecting browser language, using Turkish:', error);
    return languages.find(lang => lang.code === 'tr')!;
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Try to get from localStorage first, then auto-detect, finally fallback to Turkish
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      const saved = languages.find(lang => lang.code === savedLanguage);
      if (saved) return saved;
    }
    
    // Auto-detect browser language if no saved preference
    const detected = detectBrowserLanguage();
    // If detection fails, fallback to Turkish as primary language
    return detected || languages.find(lang => lang.code === 'tr')!;
  });

  // Update document language attribute when language changes
  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language.code);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    // Header
    'header.title': 'REPUBLIC OF TURKEY',
    'header.subtitle': 'Ministry of Interior',
    'header.department': 'General Directorate of Security',
    'header.application': 'Application',
    'header.status': 'Check Status',
    'header.insurance': 'Insurance',
    
    // Homepage
    'home.hero.title': 'Turkey E-Visa Application',
    'home.hero.subtitle': 'Apply for your Turkey e-visa online in minutes',
    'home.hero.steps': 'Your visa ready in 3 steps',
    'home.hero.step1': 'Apply Online',
    'home.hero.step2': 'Pay Securely', 
    'home.hero.step3': 'Get E-Visa',
    'home.buttons.apply': 'Apply for e-Visa',
    'home.buttons.check': 'Check Application Status',
    'home.steps.complete': 'Complete Application',
    'home.steps.complete.desc': 'Fill out the visa application form with your correct information',
    'home.steps.payment': 'Make Payment',
    'home.steps.payment.desc': 'Pay securely with your credit card or debit card',
    'home.steps.download': 'Download E-Visa',
    'home.steps.download.desc': 'Download your e-visa when application is completed successfully',
    'home.heritage.title': 'Discover Turkey\'s Heritage',
    'home.heritage.subtitle': 'Explore magnificent historical sites and cultural treasures',
    'home.heritage.hagia': 'Iconic Byzantine masterpiece in Istanbul',
    'home.heritage.cappadocia': 'Extraordinary rock formations and hot air balloons',
    'home.heritage.pamukkale': 'Natural thermal pools and ancient ruins',
    'home.insurance.title': 'Get Travel Insurance for Turkey',
    'home.insurance.subtitle': 'Secure your journey with officially approved insurance plans',
    'home.insurance.button': 'Get Travel Insurance for Turkey',
    
    // Application Form
    'app.title': 'E-Visa Application',
    'app.subtitle': 'Complete your Turkey e-visa application in simple steps',
    'app.form.title': 'New E-Visa Application',
    'app.step1': 'Choice of Nationality',
    'app.step2': 'Supporting Document Check',
    'app.step3': 'Arrival Information',
    'app.step4': 'Personal Information',
    'app.step4.prerequisites': 'Prerequisites',
    'app.step5': 'Payment',
    'app.step1.title': 'Step 1: Country/Region Selection',
    'app.step2.title': 'Step 2: Supporting Document Check',
    'app.step3.title': 'Step 3: Travel Information',
    'app.step4.title': 'Step 4: Personal Information',
    'app.step4.prerequisites.title': 'Step 4: Prerequisites',
    'app.step5.title': 'Step 5: Payment',
    'app.step6.title': 'Step 6: Payment',
    
    // Insurance
    'insurance.title': 'Travel Insurance Services',
    'insurance.subtitle': 'Official Travel Insurance for Turkish Visit',
    'insurance.plans.title': 'Official Travel Insurance Plans',
    'insurance.plans.subtitle': 'Select your coverage duration for travel to Turkey',
    'insurance.government.approved': 'Government Approved Insurance',
    'insurance.available.plans': 'Available Insurance Plans',
    'insurance.total.premium': 'Total Premium',
    
    // Status Page
    'status.title': 'Check Application Status',
    'status.subtitle': 'Enter your application number to check your visa or insurance application status',
    'status.search.title': 'Search Application',
    'status.visa.application': 'Visa Application',
    'status.insurance.application': 'Insurance Application',
    'status.application.number': 'Application Number',
    'status.application.number.placeholder': 'Enter your application number (e.g., TRMD57H74SN6WWYA)',
    'status.searching': 'Searching...',
    'status.search.button': 'Search Application',
    'status.error.enter.number': 'Please enter your application number',
    'status.error.number.length': 'Application number must be at least 6 characters long',
    'status.error.not.found': 'Application not found. Please check your application number and try again.',
    'status.details': 'Application Details',
    'status.message.approved': 'Your application has been approved! You can download your e-visa.',
    'status.message.pending': 'Your application is being reviewed. Please wait for further updates.',
    'status.message.rejected': 'Your application has been rejected. Please contact support for more information.',
    'status.message.processing': 'Your application is currently being processed.',
    'status.message.default': 'Application status is being updated.',
    'status.download.evisa': 'Download E-Visa',

    // Payment Pages
    'payment.success.title': 'Payment Successful!',
    'payment.success.test.title': 'Test Payment Successful!',
    'payment.success.message': 'Your payment has been processed successfully.',
    'payment.success.transaction.id': 'Transaction ID',
    'payment.cancel.title': 'Payment Cancelled',
    'payment.cancel.message': 'Your payment was cancelled. You can return to the application form to try again.',
    'payment.return.application': 'Return to Application',
    'payment.go.home': 'Go to Home',
    'payment.error.title': 'Payment Error',
    'payment.error.message': 'An error occurred during payment processing.',
    'payment.system.status': 'System Status',
    'payment.gateway': 'Payment Gateway',
    'payment.merchant.id': 'Merchant ID',
    'payment.environment': 'Environment',

    // FAQ Page
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to common questions about Turkey e-visa applications',

    // Requirements Page
    'requirements.title': 'E-Visa Requirements',
    'requirements.subtitle': 'Complete guide to Turkey e-visa application requirements',
    'requirements.general': 'General Requirements',
    'requirements.supporting.docs': 'Supporting Documents',

    // Form Validation
    'form.error.first.name': 'First Name Required',
    'form.error.first.name.desc': 'Please enter your first name',
    'form.error.last.name': 'Last Name Required',
    'form.error.last.name.desc': 'Please enter your last name',
    'form.error.email': 'Email Required',
    'form.error.email.desc': 'Please enter your email address',
    'form.error.email.invalid': 'Invalid Email Format',
    'form.error.email.invalid.desc': 'Please enter a valid email address',
    'form.error.phone': 'Phone Number Required',
    'form.error.phone.desc': 'Please enter your phone number',
    'form.error.passport': 'Passport Number Required',
    'form.error.passport.desc': 'Please enter your passport number',
    'form.error.birth.date': 'Date of Birth Required',
    'form.error.birth.date.desc': 'Please enter your date of birth',
    'form.error.passport.issue': 'Passport Issue Date Required',
    'form.error.passport.issue.desc': 'Please enter your passport issue date',
    'form.error.passport.expiry': 'Passport Expiry Date Required',
    'form.error.passport.expiry.desc': 'Please enter your passport expiry date',
    'form.error.place.birth': 'Place of Birth Required',
    'form.error.place.birth.desc': 'Please enter your place of birth (minimum 2 characters)',
    'form.error.mother.name': 'Mother\'s Name Required',
    'form.error.mother.name.desc': 'Please enter your mother\'s full name (minimum 2 characters)',
    'form.error.father.name': 'Father\'s Name Required',
    'form.error.father.name.desc': 'Please enter your father\'s full name (minimum 2 characters)',
    'form.error.address': 'Address Required',
    'form.error.address.desc': 'Please enter your complete address (minimum 10 characters)',
    'form.error.passport.expired': 'Passport Expired',
    'form.error.prerequisites': 'Prerequisites Required',
    'form.error.prerequisites.desc': 'Please confirm all prerequisites before proceeding',

    // Footer
    'footer.application': 'Application',
    'footer.new.application': 'New Application',
    'footer.check.status': 'Check Status',
    'footer.download.evisa': 'Download E-Visa',
    'footer.information': 'Information',
    'footer.faq': 'FAQ',
    'footer.requirements': 'Requirements',
    'footer.processing.times': 'Processing Times',
    'footer.support': 'Support',
    'footer.contact.us': 'Contact Us',
    'footer.live.chat': 'Live Chat',
    'footer.help.center': 'Help Center',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.refund': 'Refund Policy',
    'footer.ssl.secured': 'SSL Secured',
    'footer.encryption': '256-bit Encryption',
    'footer.government.approved': 'Government Approved',
    'footer.we.accept': 'We Accept:',
    'footer.service.name': 'Turkey E-Visa Service',
    'footer.copyright': '© 2024 Turkey E-Visa Application Service. All rights reserved.',
    'footer.professional': 'Professional Visa Application Service',
    'footer.reliable': 'Fast, reliable and secure visa processing',
  },
  tr: {
    // Header
    'header.title': 'TÜRKİYE CUMHURİYETİ',
    'header.subtitle': 'İçişleri Bakanlığı',
    'header.department': 'Emniyet Genel Müdürlüğü',
    'header.application': 'Başvuru',
    'header.status': 'Durum Sorgula',
    'header.insurance': 'Sigorta',
    
    // Homepage
    'home.hero.title': 'Türkiye E-Vize Başvurusu',
    'home.hero.subtitle': 'Türkiye e-vizenizi dakikalar içinde online olarak alın',
    'home.hero.steps': 'Vizeniz 3 adımda hazır',
    'home.hero.step1': 'Online Başvuru',
    'home.hero.step2': 'Güvenli Ödeme',
    'home.hero.step3': 'E-Vize Alın',
    'home.buttons.apply': 'E-Vize Başvurusu Yap',
    'home.buttons.check': 'Başvuru Durumunu Kontrol Et',
    'home.steps.complete': 'Başvuruyu Tamamla',
    'home.steps.complete.desc': 'Vize başvuru formunu doğru bilgilerinizle doldurun',
    'home.steps.payment': 'Ödeme Yap',
    'home.steps.payment.desc': 'Kredi kartınız veya banka kartınızla güvenli ödeme yapın',
    'home.steps.download': 'E-Vize İndir',
    'home.steps.download.desc': 'Başvurunuz başarıyla tamamlandığında e-vizenizi indirin',
    'home.heritage.title': 'Türkiye\'nin Mirasını Keşfedin',
    'home.heritage.subtitle': 'Muhteşem tarihi alanları ve kültürel hazineleri keşfedin',
    'home.heritage.hagia': 'İstanbul\'daki ikonik Bizans şaheseri',
    'home.heritage.cappadocia': 'Olağanüstü kaya oluşumları ve sıcak hava balonları',
    'home.heritage.pamukkale': 'Doğal termal havuzlar ve antik kalıntılar',
    'home.insurance.title': 'Türkiye için Seyahat Sigortası Alın',
    'home.insurance.subtitle': 'Seyahatinizi resmi onaylı sigorta planları ile güvence altına alın',
    'home.insurance.button': 'Türkiye Seyahat Sigortası Alın',
    
    // Application Form
    'app.title': 'E-Vize Başvurusu',
    'app.subtitle': 'Türkiye e-vize başvurunuzu basit adımlarla tamamlayın',
    'app.form.title': 'Yeni E-Vize Başvurusu',
    'app.step1': 'Uyruk Seçimi',
    'app.step2': 'Destekleyici Belge Kontrolü',
    'app.step3': 'Varış Bilgileri',
    'app.step4': 'Kişisel Bilgiler',
    'app.step4.prerequisites': 'Önkoşullar',
    'app.step5': 'Ödeme',
    'app.step1.title': 'Adım 1: Ülke/Bölge Seçimi',
    'app.step2.title': 'Adım 2: Destekleyici Belge Kontrolü',
    'app.step3.title': 'Adım 3: Seyahat Bilgileri',
    'app.step4.title': 'Adım 4: Kişisel Bilgiler',
    'app.step4.prerequisites.title': 'Adım 4: Önkoşullar',
    'app.step5.title': 'Adım 5: Ödeme',
    'app.step6.title': 'Adım 6: Ödeme',
    
    // Insurance
    'insurance.title': 'Seyahat Sigortası Hizmetleri',
    'insurance.subtitle': 'Türkiye Ziyareti için Resmi Seyahat Sigortası',
    'insurance.plans.title': 'Resmi Seyahat Sigortası Planları',
    'insurance.plans.subtitle': 'Türkiye seyahatiniz için kapsam süresini seçin',
    'insurance.government.approved': 'Devlet Onaylı Sigorta',
    'insurance.available.plans': 'Mevcut Sigorta Planları',
    'insurance.total.premium': 'Toplam Prim',
    
    // Status Page
    'status.title': 'Başvuru Durumu Sorgula',
    'status.subtitle': 'Vize veya sigorta başvuru durumunuzu kontrol etmek için başvuru numaranızı girin',
    'status.search.title': 'Başvuru Ara',
    'status.visa.application': 'Vize Başvurusu',
    'status.insurance.application': 'Sigorta Başvurusu',
    'status.application.number': 'Başvuru Numarası',
    'status.application.number.placeholder': 'Başvuru numaranızı girin (örn: TRMD57H74SN6WWYA)',
    'status.searching': 'Aranıyor...',
    'status.search.button': 'Başvuru Ara',
    'status.error.enter.number': 'Lütfen başvuru numaranızı girin',
    'status.error.number.length': 'Başvuru numarası en az 6 karakter olmalıdır',
    'status.error.not.found': 'Başvuru bulunamadı. Başvuru numaranızı kontrol edip tekrar deneyin.',
    'status.details': 'Başvuru Detayları',
    'status.message.approved': 'Başvurunuz onaylandı! E-vizenizi indirebilirsiniz.',
    'status.message.pending': 'Başvurunuz inceleniyor. Lütfen güncelleme için bekleyin.',
    'status.message.rejected': 'Başvurunuz reddedildi. Daha fazla bilgi için destek ile iletişime geçin.',
    'status.message.processing': 'Başvurunuz şu anda işleniyor.',
    'status.message.default': 'Başvuru durumu güncelleniyor.',
    'status.download.evisa': 'E-Vize İndir',

    // Payment Pages
    'payment.success.title': 'Ödeme Başarılı!',
    'payment.success.test.title': 'Test Ödemesi Başarılı!',
    'payment.success.message': 'Ödemeniz başarıyla işlendi.',
    'payment.success.transaction.id': 'İşlem Numarası',
    'payment.cancel.title': 'Ödeme İptal Edildi',
    'payment.cancel.message': 'Ödemeniz iptal edildi. Başvuru formuna dönerek tekrar deneyebilirsiniz.',
    'payment.return.application': 'Başvuruya Dön',
    'payment.go.home': 'Ana Sayfaya Git',
    'payment.error.title': 'Ödeme Hatası',
    'payment.error.message': 'Ödeme işlemi sırasında bir hata oluştu.',
    'payment.system.status': 'Sistem Durumu',
    'payment.gateway': 'Ödeme Geçidi',
    'payment.merchant.id': 'Satıcı Kimliği',
    'payment.environment': 'Ortam',

    // FAQ Page
    'faq.title': 'Sık Sorulan Sorular',
    'faq.subtitle': 'Türkiye e-vize başvuruları hakkında yaygın soruların cevaplarını bulun',

    // Requirements Page
    'requirements.title': 'E-Vize Gereksinimleri',
    'requirements.subtitle': 'Türkiye e-vize başvuru gereksinimlerine tam rehber',
    'requirements.general': 'Genel Gereksinimler',
    'requirements.supporting.docs': 'Destekleyici Belgeler',

    // Form Validation
    'form.error.first.name': 'Ad Gerekli',
    'form.error.first.name.desc': 'Lütfen adınızı girin',
    'form.error.last.name': 'Soyad Gerekli',
    'form.error.last.name.desc': 'Lütfen soyadınızı girin',
    'form.error.email': 'E-posta Gerekli',
    'form.error.email.desc': 'Lütfen e-posta adresinizi girin',
    'form.error.email.invalid': 'Geçersiz E-posta Formatı',
    'form.error.email.invalid.desc': 'Lütfen geçerli bir e-posta adresi girin',
    'form.error.phone': 'Telefon Numarası Gerekli',
    'form.error.phone.desc': 'Lütfen telefon numaranızı girin',
    'form.error.passport': 'Pasaport Numarası Gerekli',
    'form.error.passport.desc': 'Lütfen pasaport numaranızı girin',
    'form.error.birth.date': 'Doğum Tarihi Gerekli',
    'form.error.birth.date.desc': 'Lütfen doğum tarihinizi girin',
    'form.error.passport.issue': 'Pasaport Düzenleme Tarihi Gerekli',
    'form.error.passport.issue.desc': 'Lütfen pasaport düzenleme tarihinizi girin',
    'form.error.passport.expiry': 'Pasaport Son Kullanma Tarihi Gerekli',
    'form.error.passport.expiry.desc': 'Lütfen pasaport son kullanma tarihinizi girin',
    'form.error.place.birth': 'Doğum Yeri Gerekli',
    'form.error.place.birth.desc': 'Lütfen doğum yerinizi girin (minimum 2 karakter)',
    'form.error.mother.name': 'Anne Adı Gerekli',
    'form.error.mother.name.desc': 'Lütfen annenizin tam adını girin (minimum 2 karakter)',
    'form.error.father.name': 'Baba Adı Gerekli',
    'form.error.father.name.desc': 'Lütfen babanızın tam adını girin (minimum 2 karakter)',
    'form.error.address': 'Adres Gerekli',
    'form.error.address.desc': 'Lütfen tam adresinizi girin (minimum 10 karakter)',
    'form.error.passport.expired': 'Pasaport Süresi Dolmuş',
    'form.error.prerequisites': 'Önkoşullar Gerekli',
    'form.error.prerequisites.desc': 'Devam etmeden önce lütfen tüm önkoşulları onaylayın',

    // Footer
    'footer.application': 'Başvuru',
    'footer.new.application': 'Yeni Başvuru',
    'footer.check.status': 'Durum Sorgula',
    'footer.download.evisa': 'E-Vize İndir',
    'footer.information': 'Bilgi',
    'footer.faq': 'SSS',
    'footer.requirements': 'Gereksinimler',
    'footer.processing.times': 'İşlem Süreleri',
    'footer.support': 'Destek',
    'footer.contact.us': 'Bize Ulaşın',
    'footer.live.chat': 'Canlı Sohbet',
    'footer.help.center': 'Yardım Merkezi',
    'footer.legal': 'Yasal',
    'footer.terms': 'Şartlar ve Koşullar',
    'footer.privacy': 'Gizlilik Politikası',
    'footer.refund': 'İade Politikası',
    'footer.ssl.secured': 'SSL Güvenli',
    'footer.encryption': '256-bit Şifreleme',
    'footer.government.approved': 'Devlet Onaylı',
    'footer.we.accept': 'Kabul Ettiğimiz:',
    'footer.service.name': 'Türkiye E-Vize Hizmeti',
    'footer.copyright': '© 2024 Türkiye E-Vize Başvuru Hizmeti. Tüm hakları saklıdır.',
    'footer.professional': 'Profesyonel Vize Başvuru Hizmeti',
    'footer.reliable': 'Hızlı, güvenilir ve güvenli vize işleme',
  },
  fr: {
    // Header
    'header.title': 'RÉPUBLIQUE DE TURQUIE',
    'header.subtitle': 'Ministère de l\'Intérieur',
    'header.department': 'Direction Générale de la Sécurité',
    'header.application': 'Demande',
    'header.status': 'Vérifier le Statut',
    'header.insurance': 'Assurance',
    
    // Homepage
    'home.hero.title': 'Demande de E-Visa Turquie',
    'home.hero.subtitle': 'Demandez votre e-visa pour la Turquie en ligne en quelques minutes',
    'home.hero.steps': 'Votre visa prêt en 3 étapes',
    'home.hero.step1': 'Postuler en Ligne',
    'home.hero.step2': 'Payer en Sécurité',
    'home.hero.step3': 'Obtenir E-Visa',
    'home.heritage.title': 'Découvrez l\'Héritage de la Turquie',
    'home.heritage.subtitle': 'Explorez les sites historiques magnifiques et les trésors culturels',
    'home.heritage.hagia': 'Chef-d\'œuvre byzantin emblématique d\'Istanbul',
    'home.heritage.cappadocia': 'Formations rocheuses extraordinaires et montgolfières',
    'home.heritage.pamukkale': 'Piscines thermales naturelles et ruines antiques',
    'home.buttons.apply': 'Demander un e-Visa',
    'home.buttons.check': 'Vérifier le Statut de la Demande',
    'home.steps.complete': 'Compléter la Demande',
    'home.steps.complete.desc': 'Remplissez le formulaire de demande de visa avec vos informations correctes',
    'home.steps.payment': 'Effectuer le Paiement',
    'home.steps.payment.desc': 'Payez en toute sécurité avec votre carte de crédit ou carte de débit',
    'home.steps.download': 'Télécharger E-Visa',
    'home.steps.download.desc': 'Téléchargez votre e-visa lorsque la demande est terminée avec succès',
    'home.insurance.title': 'Obtenir une Assurance Voyage pour la Turquie',
    'home.insurance.subtitle': 'Sécurisez votre voyage avec des plans d\'assurance officiellement approuvés',
    'home.insurance.button': 'Obtenir une Assurance Voyage pour la Turquie',
    
    // Application Form
    'app.title': 'Demande de E-Visa',
    'app.subtitle': 'Complétez votre demande de e-visa pour la Turquie en étapes simples',
    'app.form.title': 'Nouvelle Demande de E-Visa',
    'app.step1': 'Choix de Nationalité',
    'app.step2': 'Vérification des Documents',
    'app.step3': 'Informations d\'Arrivée',
    'app.step4': 'Informations Personnelles',
    'app.step5': 'Paiement',
    
    // Insurance
    'insurance.title': 'Services d\'Assurance Voyage',
    'insurance.subtitle': 'Assurance Voyage Officielle pour la Visite en Turquie',
    'insurance.plans.title': 'Plans d\'Assurance Voyage Officiels',
    'insurance.plans.subtitle': 'Sélectionnez la durée de couverture pour votre voyage en Turquie',
    'insurance.government.approved': 'Assurance Approuvée par le Gouvernement',
    'insurance.available.plans': 'Plans d\'Assurance Disponibles',
    'insurance.total.premium': 'Prime Totale',
    
    // Footer
    'footer.application': 'Demande',
    'footer.new.application': 'Nouvelle Demande',
    'footer.check.status': 'Vérifier le Statut',
    'footer.download.evisa': 'Télécharger E-Visa',
    'footer.information': 'Information',
    'footer.faq': 'FAQ',
    'footer.requirements': 'Exigences',
    'footer.processing.times': 'Temps de Traitement',
    'footer.support': 'Support',
    'footer.contact.us': 'Nous Contacter',
    'footer.live.chat': 'Chat en Direct',
    'footer.help.center': 'Centre d\'Aide',
    'footer.legal': 'Légal',
    'footer.terms': 'Termes et Conditions',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.refund': 'Politique de Remboursement',
    'footer.ssl.secured': 'SSL Sécurisé',
    'footer.encryption': 'Chiffrement 256-bit',
    'footer.government.approved': 'Approuvé par le Gouvernement',
    'footer.we.accept': 'Nous Acceptons:',
    'footer.service.name': 'Service E-Visa Turquie',
    'footer.copyright': '© 2024 Service de Demande E-Visa Turquie. Tous droits réservés.',
    'footer.professional': 'Service Professionnel de Demande de Visa',
    'footer.reliable': 'Traitement de visa rapide, fiable et sécurisé',
  },
  de: {
    // Header
    'header.title': 'REPUBLIK TÜRKEI',
    'header.subtitle': 'Innenministerium',
    'header.department': 'Generaldirektion für Sicherheit',
    'header.application': 'Antrag',
    'header.status': 'Status Prüfen',
    'header.insurance': 'Versicherung',
    
    // Homepage
    'home.hero.title': 'Türkei E-Visa Antrag',
    'home.hero.subtitle': 'Beantragen Sie Ihr Türkei e-Visa online in wenigen Minuten',
    'home.hero.steps': 'Ihr Visa bereit in 3 Schritten',
    'home.hero.step1': 'Online Beantragen',
    'home.hero.step2': 'Sicher Bezahlen',
    'home.hero.step3': 'E-Visa Erhalten',
    'home.heritage.title': 'Entdecken Sie die Türkeis Erbe',
    'home.heritage.subtitle': 'Erkunden Sie prächtige historische Stätten und kulturelle Schätze',
    'home.heritage.hagia': 'Ikonisches byzantinisches Meisterwerk in Istanbul',
    'home.heritage.cappadocia': 'Außergewöhnliche Felsformationen und Heißluftballons',
    'home.heritage.pamukkale': 'Natürliche Thermalbäder und antike Ruinen',
    'home.buttons.apply': 'E-Visa Beantragen',
    'home.buttons.check': 'Antrag Status Prüfen',
    'home.steps.complete': 'Antrag Vervollständigen',
    'home.steps.complete.desc': 'Füllen Sie das Visa-Antragsformular mit Ihren korrekten Informationen aus',
    'home.steps.payment': 'Zahlung Durchführen',
    'home.steps.payment.desc': 'Bezahlen Sie sicher mit Ihrer Kredit- oder Debitkarte',
    'home.steps.download': 'E-Visa Herunterladen',
    'home.steps.download.desc': 'Laden Sie Ihr e-Visa herunter, wenn der Antrag erfolgreich abgeschlossen ist',
    'home.insurance.title': 'Reiseversicherung für die Türkei Erhalten',
    'home.insurance.subtitle': 'Sichern Sie Ihre Reise mit offiziell genehmigten Versicherungsplänen',
    'home.insurance.button': 'Reiseversicherung für die Türkei Erhalten',
    
    // Application Form
    'app.title': 'E-Visa Antrag',
    'app.subtitle': 'Vervollständigen Sie Ihren Türkei e-Visa Antrag in einfachen Schritten',
    'app.form.title': 'Neuer E-Visa Antrag',
    'app.step1': 'Nationalität Wählen',
    'app.step2': 'Dokument Überprüfung',
    'app.step3': 'Ankunftsinformationen',
    'app.step4': 'Persönliche Informationen',
    'app.step5': 'Zahlung',
    
    // Insurance
    'insurance.title': 'Reiseversicherung Services',
    'insurance.subtitle': 'Offizielle Reiseversicherung für Türkei Besuch',
    'insurance.plans.title': 'Offizielle Reiseversicherung Pläne',
    'insurance.plans.subtitle': 'Wählen Sie die Deckungsdauer für Ihre Türkei Reise',
    'insurance.government.approved': 'Regierung Genehmigte Versicherung',
    'insurance.available.plans': 'Verfügbare Versicherung Pläne',
    'insurance.total.premium': 'Gesamtprämie',
    
    // Footer
    'footer.application': 'Antrag',
    'footer.new.application': 'Neuer Antrag',
    'footer.check.status': 'Status Prüfen',
    'footer.download.evisa': 'E-Visa Herunterladen',
    'footer.information': 'Information',
    'footer.faq': 'FAQ',
    'footer.requirements': 'Anforderungen',
    'footer.processing.times': 'Bearbeitungszeiten',
    'footer.support': 'Support',
    'footer.contact.us': 'Kontaktieren Sie Uns',
    'footer.live.chat': 'Live Chat',
    'footer.help.center': 'Hilfe Center',
    'footer.legal': 'Rechtliches',
    'footer.terms': 'Geschäftsbedingungen',
    'footer.privacy': 'Datenschutz',
    'footer.refund': 'Rückerstattung',
    'footer.ssl.secured': 'SSL Gesichert',
    'footer.encryption': '256-bit Verschlüsselung',
    'footer.government.approved': 'Regierung Genehmigt',
    'footer.we.accept': 'Wir Akzeptieren:',
    'footer.service.name': 'Türkei E-Visa Service',
    'footer.copyright': '© 2024 Türkei E-Visa Antrag Service. Alle Rechte vorbehalten.',
    'footer.professional': 'Professioneller Visa Antrag Service',
    'footer.reliable': 'Schnelle, zuverlässige und sichere Visa Bearbeitung',
  },
  es: {
    // Header
    'header.title': 'REPÚBLICA DE TURQUÍA',
    'header.subtitle': 'Ministerio del Interior',
    'header.department': 'Dirección General de Seguridad',
    'header.application': 'Solicitud',
    'header.status': 'Verificar Estado',
    'header.insurance': 'Seguro',
    
    // Homepage
    'home.hero.title': 'Solicitud de E-Visa Turquía',
    'home.hero.subtitle': 'Solicite su e-visa para Turquía en línea en minutos',
    'home.hero.steps': 'Su visa lista en 3 pasos',
    'home.hero.step1': 'Solicitar en Línea',
    'home.hero.step2': 'Pagar Seguro',
    'home.hero.step3': 'Obtener E-Visa',
    'home.heritage.title': 'Descubra el Patrimonio de Turquía',
    'home.heritage.subtitle': 'Explore sitios históricos magníficos y tesoros culturales',
    'home.heritage.hagia': 'Obra maestra bizantina icónica en Estambul',
    'home.heritage.cappadocia': 'Formaciones rocosas extraordinarias y globos aerostáticos',
    'home.heritage.pamukkale': 'Piscinas termales naturales y ruinas antiguas',
    'home.buttons.apply': 'Solicitar e-Visa',
    'home.buttons.check': 'Verificar Estado de Solicitud',
    'home.steps.complete': 'Completar Solicitud',
    'home.steps.complete.desc': 'Complete el formulario de solicitud de visa con su información correcta',
    'home.steps.payment': 'Realizar Pago',
    'home.steps.payment.desc': 'Pague de forma segura con su tarjeta de crédito o débito',
    'home.steps.download': 'Descargar E-Visa',
    'home.steps.download.desc': 'Descargue su e-visa cuando la solicitud se complete exitosamente',
    'home.insurance.title': 'Obtener Seguro de Viaje para Turquía',
    'home.insurance.subtitle': 'Asegure su viaje con planes de seguro oficialmente aprobados',
    'home.insurance.button': 'Obtener Seguro de Viaje para Turquía',
    
    // Application Form
    'app.title': 'Solicitud de E-Visa',
    'app.subtitle': 'Complete su solicitud de e-visa para Turquía en pasos simples',
    'app.form.title': 'Nueva Solicitud de E-Visa',
    'app.step1': 'Elección de Nacionalidad',
    'app.step2': 'Verificación de Documentos',
    'app.step3': 'Información de Llegada',
    'app.step4': 'Información Personal',
    'app.step5': 'Pago',
    
    // Insurance
    'insurance.title': 'Servicios de Seguro de Viaje',
    'insurance.subtitle': 'Seguro de Viaje Oficial para Visita a Turquía',
    'insurance.plans.title': 'Planes de Seguro de Viaje Oficiales',
    'insurance.plans.subtitle': 'Seleccione la duración de cobertura para su viaje a Turquía',
    'insurance.government.approved': 'Seguro Aprobado por el Gobierno',
    'insurance.available.plans': 'Planes de Seguro Disponibles',
    'insurance.total.premium': 'Prima Total',
    
    // Footer
    'footer.application': 'Solicitud',
    'footer.new.application': 'Nueva Solicitud',
    'footer.check.status': 'Verificar Estado',
    'footer.download.evisa': 'Descargar E-Visa',
    'footer.information': 'Información',
    'footer.faq': 'FAQ',
    'footer.requirements': 'Requisitos',
    'footer.processing.times': 'Tiempos de Procesamiento',
    'footer.support': 'Soporte',
    'footer.contact.us': 'Contáctanos',
    'footer.live.chat': 'Chat en Vivo',
    'footer.help.center': 'Centro de Ayuda',
    'footer.legal': 'Legal',
    'footer.terms': 'Términos y Condiciones',
    'footer.privacy': 'Política de Privacidad',
    'footer.refund': 'Política de Reembolso',
    'footer.ssl.secured': 'SSL Seguro',
    'footer.encryption': 'Cifrado de 256-bit',
    'footer.government.approved': 'Aprobado por el Gobierno',
    'footer.we.accept': 'Aceptamos:',
    'footer.service.name': 'Servicio E-Visa Turquía',
    'footer.copyright': '© 2024 Servicio de Solicitud E-Visa Turquía. Todos los derechos reservados.',
    'footer.professional': 'Servicio Profesional de Solicitud de Visa',
    'footer.reliable': 'Procesamiento de visa rápido, confiable y seguro',
  },
  ar: {
    // Header
    'header.title': 'جمهورية تركيا',
    'header.subtitle': 'وزارة الداخلية',
    'header.department': 'المديرية العامة للأمن',
    'header.application': 'طلب',
    'header.status': 'التحقق من الحالة',
    'header.insurance': 'التأمين',
    
    // Homepage
    'home.hero.title': 'طلب التأشيرة الإلكترونية لتركيا',
    'home.hero.subtitle': 'تقدم بطلب للحصول على التأشيرة الإلكترونية لتركيا عبر الإنترنت في دقائق',
    'home.hero.steps': 'تأشيرتك جاهزة في 3 خطوات',
    'home.hero.step1': 'التقديم عبر الإنترنت',
    'home.hero.step2': 'الدفع الآمن',
    'home.hero.step3': 'الحصول على التأشيرة الإلكترونية',
    'home.heritage.title': 'اكتشف تراث تركيا',
    'home.heritage.subtitle': 'استكشف المواقع التاريخية الرائعة والكنوز الثقافية',
    'home.heritage.hagia': 'تحفة بيزنطية مميزة في إسطنبول',
    'home.heritage.cappadocia': 'تشكيلات صخرية استثنائية ومناطيد الهواء الساخن',
    'home.heritage.pamukkale': 'برك حرارية طبيعية وآثار قديمة',
    'home.buttons.apply': 'تقديم طلب للحصول على التأشيرة الإلكترونية',
    'home.buttons.check': 'التحقق من حالة الطلب',
    'home.steps.complete': 'إكمال الطلب',
    'home.steps.complete.desc': 'املأ نموذج طلب التأشيرة بمعلوماتك الصحيحة',
    'home.steps.payment': 'إجراء الدفع',
    'home.steps.payment.desc': 'ادفع بأمان باستخدام بطاقة الائتمان أو بطاقة الخصم',
    'home.steps.download': 'تحميل التأشيرة الإلكترونية',
    'home.steps.download.desc': 'قم بتنزيل التأشيرة الإلكترونية عند إكمال الطلب بنجاح',
    'home.insurance.title': 'الحصول على تأمين السفر لتركيا',
    'home.insurance.subtitle': 'أمن رحلتك مع خطط التأمين المعتمدة رسمياً',
    'home.insurance.button': 'الحصول على تأمين السفر لتركيا',
    
    // Application Form
    'app.title': 'طلب التأشيرة الإلكترونية',
    'app.subtitle': 'أكمل طلب التأشيرة الإلكترونية لتركيا بخطوات بسيطة',
    'app.form.title': 'طلب تأشيرة إلكترونية جديد',
    'app.step1': 'اختيار الجنسية',
    'app.step2': 'فحص الوثائق المساعدة',
    'app.step3': 'معلومات الوصول',
    'app.step4': 'المعلومات الشخصية',
    'app.step5': 'الدفع',
    
    // Insurance
    'insurance.title': 'خدمات التأمين على السفر',
    'insurance.subtitle': 'التأمين على السفر الرسمي لزيارة تركيا',
    'insurance.plans.title': 'خطط التأمين على السفر الرسمية',
    'insurance.plans.subtitle': 'اختر مدة التغطية لرحلتك إلى تركيا',
    'insurance.government.approved': 'تأمين معتمد من الحكومة',
    'insurance.available.plans': 'خطط التأمين المتاحة',
    'insurance.total.premium': 'إجمالي القسط',
    
    // Footer
    'footer.application': 'طلب',
    'footer.new.application': 'طلب جديد',
    'footer.check.status': 'التحقق من الحالة',
    'footer.download.evisa': 'تحميل التأشيرة الإلكترونية',
    'footer.information': 'معلومات',
    'footer.faq': 'الأسئلة الشائعة',
    'footer.requirements': 'المتطلبات',
    'footer.processing.times': 'أوقات المعالجة',
    'footer.support': 'الدعم',
    'footer.contact.us': 'اتصل بنا',
    'footer.live.chat': 'الدردشة المباشرة',
    'footer.help.center': 'مركز المساعدة',
    'footer.legal': 'قانوني',
    'footer.terms': 'الشروط والأحكام',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.refund': 'سياسة الاسترداد',
    'footer.ssl.secured': 'آمن SSL',
    'footer.encryption': 'تشفير 256-بت',
    'footer.government.approved': 'معتمد من الحكومة',
    'footer.we.accept': 'نقبل:',
    'footer.service.name': 'خدمة التأشيرة الإلكترونية التركية',
    'footer.copyright': '© 2024 خدمة طلب التأشيرة الإلكترونية التركية. جميع الحقوق محفوظة.',
    'footer.professional': 'خدمة طلب التأشيرة المهنية',
    'footer.reliable': 'معالجة التأشيرة سريعة وموثوقة وآمنة',
  },
};