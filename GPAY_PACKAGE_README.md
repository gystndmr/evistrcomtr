# 🎯 GPay Ödeme Sistemi - Komple Entegrasyon Paketi

Bu paket, bizim çalışan GPay sisteminin tüm kodlarını içerir ve 5 dakikada herhangi bir Replit projesine entegre edilebilir.

## 📦 Paket İçeriği

### 🔧 Backend Dosyaları
- `server/payment-service.ts` - GPay servis katmanı (signature generation, API calls)
- `server/payment-routes.ts` - Express.js route'ları (/api/payment/*)
- `.env` - Environment variables (production credentials dahil)

### 🎨 Frontend Dosyaları  
- `client/components/PaymentForm.tsx` - React payment form component
- `client/pages/payment-success.tsx` - Ödeme başarı sayfası
- `client/pages/payment-cancel.tsx` - Ödeme iptal sayfası

### 📚 Dokümantasyon
- `GPAY_INTEGRATION_GUIDE.md` - Detaylı kurulum rehberi
- `INTEGRATION_EXAMPLE.md` - Kod örnekleri ve kullanım senaryoları

## ⚡ Hızlı Kurulum (5 Dakika)

### 1. Dosyaları Kopyala
```bash
# Backend dosyaları
server/payment-service.ts
server/payment-routes.ts

# Frontend dosyaları  
client/components/PaymentForm.tsx
client/pages/payment-success.tsx
client/pages/payment-cancel.tsx
```

### 2. Environment Variables
`.env` dosyasına ekle:
```env
NODE_ENV=production
DOMAIN_URL=https://your-domain.com
GPAY_MERCHANT_ID=1100002537
GPAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."
GPAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```

### 3. Dependencies Yükle
```bash
npm install crypto dotenv
```

### 4. Backend'de Route'ları Ekle
```typescript
// server/index.ts
import { registerPaymentRoutes } from './payment-routes';
registerPaymentRoutes(app);
```

### 5. Frontend'de Route'ları Ekle  
```typescript
// client/src/App.tsx
<Route path="/payment-success" component={PaymentSuccess} />
<Route path="/payment-cancel" component={PaymentCancel} />
```

## 🚀 Kullanıma Hazır!

### Basit Ödeme Formu
```typescript
import PaymentForm from '@/components/PaymentForm';

const paymentData = {
  amount: 100.00,
  customerName: "Ahmet Yılmaz", 
  customerEmail: "ahmet@example.com",
  description: "Test Ödeme"
};

<PaymentForm paymentData={paymentData} />
```

### Manual API Kullanımı
```typescript
const response = await fetch('/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 150,
    customerName: "Test User",
    customerEmail: "test@example.com"
  })
});

const result = await response.json();
if (result.success) {
  window.location.href = result.paymentUrl;
}
```

## ✅ Özellikler

### 🔐 Güvenlik
- Production GPay credentials
- RSA md5WithRSAEncryption signature
- Automatic signature verification
- Secure callback handling

### 📱 Frontend
- Responsive payment form
- Loading states ve error handling
- Professional success/cancel pages
- Mobile-friendly design

### 🔧 Backend
- RESTful API endpoints
- Automatic order reference generation
- Client IP detection
- Comprehensive error handling
- Callback processing

### 🌐 Production Ready
- Environment-based configuration
- HTTPS support
- Detailed logging
- Error monitoring

## 🎯 Test Endpoints

```bash
# Konfigürasyon test
GET /api/payment/test-config

# Ödeme oluştur
POST /api/payment/create

# Ödeme doğrula
GET /api/payment/verify/:transactionId
```

## 🆘 Troubleshooting

### Yaygın Sorunlar:
1. **Invalid Signature** - Private key kontrolü
2. **500 Server Error** - Domain URL callback registration 
3. **Missing Dependencies** - npm install crypto dotenv

### Debug Mode:
```env
NODE_ENV=development
```

## 📞 Production Info

- **Merchant ID:** 1100002537
- **API Endpoint:** https://getvisa.gpayprocessing.com
- **Test Endpoint:** /api/payment/test-config

---

Bu paket bizim production ortamında çalışan sisteminki aynısıdır. Kopyala-yapıştır ile 5 dakikada çalışır duruma gelir!

## 📋 Checklist

- [ ] Dosyaları kopyaladın mı?
- [ ] .env dosyasını güncelledin mi?
- [ ] npm install yaptın mı?
- [ ] Route'ları ekledin mi?
- [ ] DOMAIN_URL'yi güncelledi mi?
- [ ] Test endpoint'ini çalıştırdın mı?

Tüm checkmark'lar ✅ ise sistem hazır!