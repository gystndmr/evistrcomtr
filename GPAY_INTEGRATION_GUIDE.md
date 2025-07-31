# GPay Ödeme Sistemi Entegrasyonu - Komple Kurulum Rehberi

## 🚀 Hızlı Kurulum (5 Dakika)

### 1. Gerekli Paketleri Yükle
```bash
npm install crypto dotenv
```

### 2. Environment Variables (.env dosyası)
```env
NODE_ENV=production
DOMAIN_URL=https://your-domain.com
GPAY_MERCHANT_ID=1100002537
GPAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAviOrMy6pJDRThx6IkAcY
N0avdK1MLV4LiWy58gky6F3DqxLUrnvapYh1zLiXGi+bSUbMHNtn0+EUggEm2ikv
Z7SwQusB/N+89XyjkxFxHZ6asgGjYoyiYh8fFFnZvSxtcBvytvp2pz2qT3pBcdiR
78wxC9GAUQF5uDDykejFFsXUuEKyVHfm1iNErAqYZC39PjZP58rwD6QJ2XGLoBKK
WzBCPkbtwjBk9QY7zBvaBKyUw/ik2qQ06P+xl7edpnBq9IUPr1KL4yQENlNk122X
ThwGZXqjWimzPt79ptJ4FvhECkawSdiM/nKToRyh8wsCNMvGjh2v090k+XkTeoHi
RE/tiVH9UGaxmRrZVINLVze4kE3mFwc+nbPrhdVe+HIBacOPvLdI7DYIq/RHCOkX
W8REwwgDmPvPfE7x9InCxajFcLcza0fpTaRPdvTbpzUTeeYD7np9/nF6Z23xvuCR
l3XPR2c8Xp5CPMUjwFHpZKileK+45j+S4JFh/SuTVxY1B6NSDX5JYOeoLo9fMQ5h
a1NlPhAXUtHwCzjMFkbnQGohssfDFT4ZB60rVv09XedYhECO1CjF+d+caa7DBfLV
68Ii1CD5EEEm5VPTjyZo+hluRwVgngR3euzkWh8n9uPg7by4Rsg+tMKWxnRG/5pB
NHOV2h6vp0+8TRttp6OZnaUCAwEAAQ==
-----END PUBLIC KEY-----"
GPAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
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
DjPZy1LIdNVuY5gNsPweK2KBzJGc
-----END PRIVATE KEY-----"
```

### 3. Ana Dosyalar

## 📁 Dosya Yapısı
```
server/
├── payment-service.ts     # GPay servis katmanı
├── payment-routes.ts      # API endpoint'leri
└── payment-utils.ts       # Yardımcı fonksiyonlar

client/
├── components/
│   └── PaymentForm.tsx    # React ödeme formu
└── pages/
    ├── payment-success.tsx # Başarı sayfası
    └── payment-cancel.tsx  # İptal sayfası
```

## 🔧 Backend Entegrasyonu

### payment-service.ts
GPay API ile iletişim kurma servisi

### payment-routes.ts  
Express.js route'ları

### payment-utils.ts
Signature generation ve yardımcı fonksiyonlar

## 🎨 Frontend Entegrasyonu

### PaymentForm.tsx
React payment form component'i

### Başarı/İptal Sayfaları
Ödeme sonrası yönlendirme sayfaları

## 🚀 Kullanım

### 1. Backend'de Route'ları Ekle
```javascript
// server/index.ts veya routes.ts
import { registerPaymentRoutes } from './payment-routes';
registerPaymentRoutes(app);
```

### 2. Frontend'de Ödeme Formu
```javascript
import PaymentForm from './components/PaymentForm';

// Ödeme bilgileri
const paymentData = {
  amount: 100.00,
  orderReference: 'ORDER123',
  customerName: 'John Doe',
  customerEmail: 'john@example.com'
};

<PaymentForm paymentData={paymentData} />
```

## 🔐 Güvenlik Özellikleri

- RSA md5WithRSAEncryption signature
- Production GPay API kullanımı
- Secure callback URL handling
- Automatic signature verification

## 📋 Test Etme

### 1. Test API Endpoint
```bash
GET /api/payment/test-config
```

### 2. Test Payment
```bash
POST /api/payment/create
{
  "amount": 100,
  "orderReference": "TEST123",
  "customerName": "Test User",
  "customerEmail": "test@example.com"
}
```

## 🌐 Production Deployment

1. Environment variables'ları production'a kopyala
2. Domain URL'ini güncelle (.env)
3. GPay portal'da callback URL'lerini kaydet
4. SSL sertifikası aktif olduğundan emin ol

## 🆘 Troubleshooting

### Yaygın Hatalar:
- **Invalid Signature**: Private key veya signature algorithm kontrolü
- **500 Server Error**: Callback URL'lerin GPay'de kayıtlı olup olmadığı
- **Domain Error**: DOMAIN_URL environment variable kontrolü

### Debug Mode:
```env
NODE_ENV=development
```
Console'da detaylı log çıktıları görüntülenir.

## 📞 Destek

GPay Portal: https://getvisa.gpayprocessing.com
Merchant ID: 1100002537

---

Bu entegrasyon paketi ile GPay ödeme sistemi 5 dakikada kurulabilir!