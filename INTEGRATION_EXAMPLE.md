# GPay Entegrasyonu - Kullanım Örnekleri

## 🚀 5 Dakikada Kurulum

### 1. Backend Entegrasyonu

```typescript
// server/index.ts veya routes.ts
import { registerPaymentRoutes } from './payment-routes';
import 'dotenv/config'; // .env dosyasını yükle

// Routes'ları kaydet
registerPaymentRoutes(app);
```

### 2. Frontend Entegrasyonu

```typescript
// Herhangi bir React component'inde
import PaymentForm from '@/components/PaymentForm';

function MyPaymentPage() {
  const paymentData = {
    amount: 150.00,
    customerName: "Ahmet Yılmaz",
    customerEmail: "ahmet@example.com",
    description: "E-Visa Başvurusu",
    orderReference: "VISA001" // Opsiyonel
  };

  const handleSuccess = (result: any) => {
    console.log('Ödeme başarılı:', result);
    // Success sayfasına yönlendir
  };

  const handleError = (error: string) => {
    console.error('Ödeme hatası:', error);
    // Hata mesajı göster
  };

  return (
    <PaymentForm 
      paymentData={paymentData}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

## 📱 Complete Working Example

### App.tsx'e Route Ekleme
```typescript
// client/src/App.tsx
import { Route, Switch } from 'wouter';
import PaymentSuccess from '@/pages/payment-success';
import PaymentCancel from '@/pages/payment-cancel';

function App() {
  return (
    <Switch>
      {/* Diğer route'lar */}
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/payment-cancel" component={PaymentCancel} />
      {/* Diğer route'lar */}
    </Switch>
  );
}
```

### Pratik Kullanım - Form Submission
```typescript
// Örnek: Visa başvuru formundan ödemeye geçiş
function VisaApplicationForm() {
  const [applicationData, setApplicationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    // ... diğer alanlar
  });

  const handleSubmit = async () => {
    // 1. Başvuruyu database'e kaydet
    const application = await saveApplication(applicationData);
    
    // 2. Ödeme verisini hazırla
    const paymentData = {
      amount: 75.00, // USD
      customerName: `${applicationData.firstName} ${applicationData.lastName}`,
      customerEmail: applicationData.email,
      description: `E-Visa Application ${application.id}`,
      orderReference: application.applicationNumber
    };

    // 3. Ödeme formunu göster
    setShowPaymentForm(true);
    setPaymentData(paymentData);
  };

  return (
    <div>
      {!showPaymentForm ? (
        // Başvuru formu
        <form onSubmit={handleSubmit}>
          {/* Form alanları */}
          <Button type="submit">Ödemeye Geç</Button>
        </form>
      ) : (
        // Ödeme formu
        <PaymentForm paymentData={paymentData} />
      )}
    </div>
  );
}
```

## 🔧 Advanced Usage

### Custom Payment Flow
```typescript
// Özel ödeme akışı
function CustomPaymentFlow() {
  const [step, setStep] = useState(1);

  const createPayment = async (amount: number, description: string) => {
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          orderReference: `ORD${Date.now()}`,
          customerName: "Customer Name",
          customerEmail: "customer@example.com",
          description
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // GPay sayfasına yönlendir
        window.location.href = result.paymentUrl;
      } else {
        alert('Ödeme oluşturulamadı: ' + result.error);
      }
    } catch (error) {
      alert('Ödeme hatası: ' + error);
    }
  };

  return (
    <div>
      <Button onClick={() => createPayment(100, "Test Payment")}>
        100 TL Öde
      </Button>
    </div>
  );
}
```

### Backend Callback Handling
```typescript
// server/payment-routes.ts içinde callback işleme
app.post("/api/payment/callback", async (req, res) => {
  try {
    const callbackData = req.body;
    console.log("Payment callback:", callbackData);
    
    // Ödeme durumunu kontrol et
    if (callbackData.status === 'success') {
      // 1. Database'i güncelle
      await updatePaymentStatus(callbackData.orderRef, 'completed');
      
      // 2. Email gönder
      await sendPaymentConfirmationEmail(callbackData.customerEmail);
      
      // 3. İlgili servisleri bilgilendir
      await notifyServices(callbackData);
    }
    
    res.json({ status: 'ok' });
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ error: error.message });
  }
});
```

## 🎯 Production Tips

### 1. Error Handling
```typescript
// Robust error handling
const handlePaymentError = (error: string) => {
  // Log to monitoring service
  console.error('Payment error:', error);
  
  // Show user-friendly message
  if (error.includes('Invalid signature')) {
    alert('Güvenlik hatası. Lütfen tekrar deneyin.');
  } else if (error.includes('Network')) {
    alert('Bağlantı hatası. İnternet bağlantınızı kontrol edin.');
  } else {
    alert('Ödeme işlemi başarısız. Destek ekibimizle iletişime geçin.');
  }
};
```

### 2. Loading States
```typescript
// Payment form with loading states
function EnhancedPaymentForm({ paymentData }: { paymentData: PaymentData }) {
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const handlePayment = async () => {
    setIsCreatingPayment(true);
    
    try {
      // Payment creation logic
      const result = await createPayment(paymentData);
      
      if (result.success) {
        // Show success message before redirect
        toast.success('Ödeme sayfasına yönlendiriliyorsunuz...');
        setTimeout(() => {
          window.location.href = result.paymentUrl;
        }, 1000);
      }
    } catch (error) {
      toast.error('Ödeme oluşturulamadı');
    } finally {
      setIsCreatingPayment(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isCreatingPayment}
      className="w-full"
    >
      {isCreatingPayment ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Hazırlanıyor...
        </>
      ) : (
        'Ödeme Yap'
      )}
    </Button>
  );
}
```

### 3. URL Configuration
```env
# Production .env
NODE_ENV=production
DOMAIN_URL=https://yourdomain.com
GPAY_MERCHANT_ID=1100002537

# Development .env  
NODE_ENV=development
DOMAIN_URL=http://localhost:5000
GPAY_MERCHANT_ID=1100002537
```

## 🔒 Security Best Practices

1. **Never expose private keys** - Sadece backend'de kullan
2. **Validate callbacks** - Signature doğrulama yap
3. **Use HTTPS** - Production'da SSL zorunlu
4. **Log everything** - Tüm ödeme işlemlerini logla
5. **Handle timeouts** - Ödeme timeout'ları için fallback

Bu örneklerle GPay entegrasyonu hemen kullanıma hazır!