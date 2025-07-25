# Türkiye E-Vize Uygulaması - Sıfırdan Kurulum Rehberi

## 1. Sistem Gereksinimleri

### Temel Gereksinimler
- Node.js 20.x veya üzeri
- PostgreSQL veritabanı
- npm veya yarn paket yöneticisi
- TypeScript desteği

### Dış Servis Gereksinimleri
- SendGrid API anahtarı (email gönderimi için)
- GPay ödeme sistemi kimlik bilgileri
- Neon PostgreSQL veritabanı (önerilen)

## 2. Proje Dosya Yapısı

```
turkish-evisa-system/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # UI bileşenleri
│   │   ├── pages/            # Sayfa bileşenleri
│   │   ├── lib/              # Yardımcı kütüphaneler
│   │   └── App.tsx           # Ana uygulama
├── server/                    # Express backend
│   ├── routes.ts             # API rotaları
│   ├── storage.ts            # Veritabanı işlemleri
│   ├── index.ts              # Ana server dosyası
│   └── email-*.ts            # Email şablonları
├── shared/                    # Ortak tipler ve şemalar
│   └── schema.ts             # Drizzle veritabanı şemaları
├── package.json              # Proje bağımlılıkları
├── vite.config.ts            # Frontend yapılandırması
├── drizzle.config.ts         # Veritabanı yapılandırması
└── .env                      # Çevre değişkenleri
```

## 3. Adım Adım Kurulum

### 3.1 Proje Başlatma
```bash
# Yeni dizin oluştur
mkdir turkish-evisa-system
cd turkish-evisa-system

# Node.js projesi başlat
npm init -y
```

### 3.2 Temel Bağımlılıklar
```bash
# Production bağımlılıkları
npm install express drizzle-orm @neondatabase/serverless 
npm install react react-dom wouter @tanstack/react-query
npm install @hookform/resolvers react-hook-form zod drizzle-zod
npm install @sendgrid/mail nanoid date-fns
npm install @radix-ui/react-* tailwindcss class-variance-authority
npm install lucide-react framer-motion

# Development bağımlılıkları
npm install -D typescript @types/node @types/react @types/express
npm install -D vite @vitejs/plugin-react tsx esbuild
npm install -D drizzle-kit tailwindcss autoprefixer postcss
npm install -D @replit/vite-plugin-runtime-error-modal
```

### 3.3 Çevre Değişkenleri (.env)
```env
# Veritabanı
DATABASE_URL=postgresql://username:password@hostname/database

# Email Servisi
SENDGRID_API_KEY=your_sendgrid_api_key
VERIFIED_EMAIL_ADDRESS=info@yourdomain.com

# GPay Ödeme Sistemi
GPAY_MERCHANT_ID=your_merchant_id
GPAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
your_public_key_here
-----END PUBLIC KEY-----"
GPAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_private_key_here
-----END PRIVATE KEY-----"

# Genel
NODE_ENV=development
```

### 3.4 Package.json Scripts
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

## 4. Temel Yapılandırma Dosyaları

### 4.1 TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["client", "server", "shared"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4.2 Vite (vite.config.ts)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
```

### 4.3 Drizzle (drizzle.config.ts)
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});
```

### 4.4 Tailwind (tailwind.config.js)
```javascript
module.exports = {
  content: ["./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 5. Veritabanı Şeması (shared/schema.ts)

```typescript
import { pgTable, serial, text, timestamp, integer, json, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Ülkeler tablosu
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  eligible: boolean('eligible').default(true),
  flag: text('flag'),
  requiresSupporting: boolean('requires_supporting').default(false),
});

// Vize başvuruları
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  applicationNumber: text('application_number').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  passportNumber: text('passport_number').notNull(),
  countryOfOrigin: text('country_of_origin').notNull(),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Sigorta başvuruları
export const insuranceApplications = pgTable('insurance_applications', {
  id: serial('id').primaryKey(),
  applicationNumber: text('application_number').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  passportNumber: text('passport_number'),
  nationality: text('nationality'),
  productName: text('product_name').notNull(),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Schema'lardan tipler
export const insertApplicationSchema = createInsertSchema(applications);
export const insertInsuranceSchema = createInsertSchema(insuranceApplications);
export type Application = typeof applications.$inferSelect;
export type InsuranceApplication = typeof insuranceApplications.$inferSelect;
```

## 6. Ana Server Dosyası (server/index.ts)

```typescript
import express from 'express';
import { setupVite, serveStatic } from './vite.js';
import { setupRoutes } from './routes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API rotalarını ekle
setupRoutes(app);

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Geliştirme/production moduna göre Vite veya statik dosya servisi
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  setupVite(app, server);
}
```

## 7. API Rotaları (server/routes.ts)

```typescript
import { Router } from 'express';
import { storage } from './storage.js';
import { generateApplicationEmail } from './email-visa.js';
import { sendEmail } from './email-sender.js';

const router = Router();

// Vize başvurusu oluştur
router.post('/api/applications', async (req, res) => {
  try {
    const application = await storage.createApplication(req.body);
    
    // Email gönder
    const emailContent = generateApplicationEmail(
      application.firstName,
      application.lastName,
      application.applicationNumber
    );
    
    await sendEmail(application.email, emailContent);
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin panel rotaları
router.get('/api/admin/applications', async (req, res) => {
  const applications = await storage.getApplications();
  res.json(applications);
});

export function setupRoutes(app) {
  app.use(router);
}
```

## 8. Çalıştırma Adımları

### 8.1 Geliştirme Ortamı
```bash
# Veritabanı şemasını uygula
npm run db:push

# Geliştirme serverını başlat
npm run dev
```

### 8.2 Production Ortamı
```bash
# Uygulamayı derle
npm run build

# Production serverını başlat
npm run start
```

## 9. Önemli Özellikler

### Admin Panel
- URL: `/admin`
- Şifre: `admin123`
- Footer'daki küçük nokta ile erişim

### Email Sistemi
- SendGrid entegrasyonu
- Otomatik onay emailleri
- PDF ekleri desteklenir

### Ödeme Sistemi
- GPay entegrasyonu
- RSA imza doğrulaması
- Callback URL desteği

### Çoklu Dil Desteği
- 6 dil: TR, EN, FR, DE, ES, AR
- Otomatik tarayıcı dil algılama
- Dinamik çeviri sistemi

## 10. Sorun Giderme

### Port Çakışması
```bash
# Port 5000'i kullanan işlemleri sonlandır
pkill -f "tsx server/index.ts"
pkill -f "node dist/index.js"
```

### Vite WebSocket Sorunları
- Production mode kullanın: `npm run build && npm start`
- Veya browser'da Vite hatalarını yok sayın

### Veritabanı Bağlantı Sorunları
- DATABASE_URL'in doğru olduğundan emin olun
- `npm run db:push` ile şemayı uygulayın

## 11. Güvenlik Notları

- `.env` dosyasını git'e eklemeyin
- Production'da güçlü şifreler kullanın
- HTTPS kullanmayı unutmayın
- Admin panel şifresini değiştirin

Bu rehber ile sistemi sıfırdan kurabilir ve çalışır hale getirebilirsiniz.