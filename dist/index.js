var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default;
var init_vite_config = __esm({
  async "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
          await import("@replit/vite-plugin-cartographer").then(
            (m) => m.cartographer()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "client", "src"),
          "@shared": path.resolve(import.meta.dirname, "shared"),
          "@assets": path.resolve(import.meta.dirname, "attached_assets")
        }
      },
      root: path.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}
var viteLogger;
var init_vite = __esm({
  async "server/vite.ts"() {
    "use strict";
    await init_vite_config();
    viteLogger = createLogger();
  }
});

// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  applications: () => applications,
  applicationsRelations: () => applicationsRelations,
  chatMessages: () => chatMessages,
  countries: () => countries,
  countriesRelations: () => countriesRelations,
  insertApplicationSchema: () => insertApplicationSchema,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertCountrySchema: () => insertCountrySchema,
  insertInsuranceApplicationSchema: () => insertInsuranceApplicationSchema,
  insertInsuranceProductSchema: () => insertInsuranceProductSchema,
  insuranceApplications: () => insuranceApplications,
  insuranceApplicationsRelations: () => insuranceApplicationsRelations,
  insuranceProducts: () => insuranceProducts,
  insuranceProductsRelations: () => insuranceProductsRelations
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  flag: text("flag"),
  // Legacy columns (temporary - will be removed after migration)
  isEligible: boolean("is_eligible").notNull().default(false),
  requiresSupportingDocs: boolean("requires_supporting_docs").notNull().default(false),
  // New scenario column
  scenario: integer("scenario").notNull().default(3),
  // 1: E-visa no docs, 2: E-visa with docs, 3: Visa-free + insurance, 4: Not eligible
  supportedDocumentTypes: text("supported_document_types").array(),
  visaFee: decimal("visa_fee", { precision: 10, scale: 2 }).default("60.00"),
  maxStayDays: integer("max_stay_days").default(30),
  validityDays: integer("validity_days").default(180),
  multipleEntry: boolean("multiple_entry").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  applicationNumber: text("application_number").notNull().unique(),
  countryId: integer("country_id").references(() => countries.id),
  countryOfOrigin: text("country_of_origin"),
  // Hangi ülkeden başvurdu
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  passportNumber: text("passport_number").notNull(),
  passportIssueDate: timestamp("passport_issue_date"),
  // Pasaport veriliş tarihi
  passportExpiryDate: timestamp("passport_expiry_date"),
  // Pasaport geçerlilik tarihi
  dateOfBirth: timestamp("date_of_birth").notNull(),
  placeOfBirth: text("place_of_birth"),
  // Doğum yeri
  motherName: text("mother_name"),
  // Anne adı
  fatherName: text("father_name"),
  // Baba adı
  address: text("address"),
  // Adres bilgisi
  arrivalDate: timestamp("arrival_date").notNull(),
  documentType: text("document_type").notNull(),
  processingType: text("processing_type").notNull().default("standard"),
  supportingDocuments: jsonb("supporting_documents"),
  supportingDocumentType: text("supporting_document_type"),
  // Seçilen destekleyici belge türü
  supportingDocumentCountry: text("supporting_document_country"),
  // Spesifik visa ülkesi (IRL, SCHENGEN, USA, GBR)
  supportingDocumentNumber: text("supporting_document_number"),
  // Destekleyici belge numarası
  supportingDocumentStartDate: timestamp("supporting_document_start_date"),
  // Destekleyici belge başlangıç tarihi
  supportingDocumentEndDate: timestamp("supporting_document_end_date"),
  // Destekleyici belge bitiş tarihi
  status: text("status").notNull().default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  pdfAttachment: text("pdf_attachment"),
  // For admin uploaded PDF files
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insuranceProducts = pgTable("insurance_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  coverage: jsonb("coverage").notNull(),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insuranceApplications = pgTable("insurance_applications", {
  id: serial("id").primaryKey(),
  applicationNumber: text("application_number").notNull().unique(),
  productId: integer("product_id").references(() => insuranceProducts.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  passportNumber: text("passport_number"),
  countryOfOrigin: text("country_of_origin"),
  // Müşterinin hangi ülkeden başvuru yaptığı
  travelDate: timestamp("travel_date").notNull(),
  returnDate: timestamp("return_date").notNull(),
  destination: text("destination").notNull(),
  tripDurationDays: integer("trip_duration_days"),
  // Kaç günlük seçti
  dateOfBirth: text("date_of_birth"),
  // Doğum tarihi (yaş hesabı için)
  parentIdPhotos: jsonb("parent_id_photos"),
  // 18 yaş altı için ebeveyn kimlik fotoğrafları
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  status: text("status").notNull().default("pending"),
  pdfAttachment: text("pdf_attachment"),
  // For admin uploaded PDF files
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var chatMessages = pgTable("chat_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }),
  message: text("message").notNull(),
  sender: varchar("sender", { length: 10 }).notNull(),
  // 'user' or 'agent'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull()
});
var countriesRelations = relations(countries, ({ many }) => ({
  applications: many(applications)
}));
var applicationsRelations = relations(applications, ({ one }) => ({
  country: one(countries, {
    fields: [applications.countryId],
    references: [countries.id]
  })
}));
var insuranceProductsRelations = relations(insuranceProducts, ({ many }) => ({
  applications: many(insuranceApplications)
}));
var insuranceApplicationsRelations = relations(insuranceApplications, ({ one }) => ({
  product: one(insuranceProducts, {
    fields: [insuranceApplications.productId],
    references: [insuranceProducts.id]
  })
}));
var insertCountrySchema = createInsertSchema(countries);
var insertApplicationSchema = createInsertSchema(applications).extend({
  // Make totalAmount optional since it's calculated on the backend based on processing type
  totalAmount: z.string().optional()
});
var insertInsuranceProductSchema = createInsertSchema(insuranceProducts);
var insertInsuranceApplicationSchema = createInsertSchema(insuranceApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  pdfAttachment: true
}).extend({
  // Override email validation to accept any string format
  email: z.string().email("Invalid email address"),
  // Override phone to accept any string
  phone: z.string().min(1, "Phone number is required"),
  // Override dateOfBirth to accept any string format (can be YYYY-MM-DD or other formats)
  dateOfBirth: z.string().optional(),
  // Override passportNumber to accept any string
  passportNumber: z.string().optional()
});
var insertChatMessageSchema = createInsertSchema(chatMessages);

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, ilike, or, sql, count } from "drizzle-orm";
var DatabaseStorage = class {
  // ⚡ PERFORMANCE: Add memory cache for countries
  countriesCache = null;
  cacheTimestamp = 0;
  CACHE_DURATION = 5 * 60 * 1e3;
  // 5 minutes
  async getCountries() {
    const now = Date.now();
    if (this.countriesCache && now - this.cacheTimestamp < this.CACHE_DURATION) {
      console.log(`\u{1F680} Countries served from cache (${this.countriesCache.length} countries)`);
      return this.countriesCache;
    }
    try {
      console.log(`\u{1F50D} Loading countries from database...`);
      const results = await db.select().from(countries);
      const uniqueCountriesMap = /* @__PURE__ */ new Map();
      results.forEach((country) => {
        const existing = uniqueCountriesMap.get(country.name);
        if (!existing) {
          uniqueCountriesMap.set(country.name, country);
        } else {
          if (country.code.length > existing.code.length) {
            uniqueCountriesMap.set(country.name, country);
          }
        }
      });
      const uniqueCountries = Array.from(uniqueCountriesMap.values());
      const formattedCountries = uniqueCountries.map((country) => ({
        ...country,
        isEligible: Boolean(country.isEligible)
        // Keep isEligible field name for frontend consistency
      }));
      this.countriesCache = formattedCountries;
      this.cacheTimestamp = now;
      console.log(`\u{1F680} Countries cached (${formattedCountries.length} countries)`);
      return formattedCountries;
    } catch (error) {
      console.error("Database error in getCountries:", error);
      return this.countriesCache || [];
    }
  }
  async getCountryByCode(code) {
    const [country] = await db.select().from(countries).where(eq(countries.code, code));
    return country;
  }
  async getCountryById(id) {
    const [country] = await db.select().from(countries).where(eq(countries.id, id));
    return country;
  }
  async createCountry(countryData) {
    const [country] = await db.insert(countries).values(countryData).returning();
    return country;
  }
  async getApplication(id) {
    try {
      const [application] = await db.select().from(applications).where(eq(applications.id, id));
      return application;
    } catch (error) {
      console.error("Database error in getApplication:", error);
      return void 0;
    }
  }
  async getApplicationByNumber(applicationNumber) {
    try {
      const [application] = await db.select().from(applications).where(eq(applications.applicationNumber, applicationNumber));
      return application;
    } catch (error) {
      console.error("Database error in getApplicationByNumber:", error);
      return void 0;
    }
  }
  async getApplicationByOrderRef(orderRef) {
    try {
      const [application] = await db.select().from(applications).where(eq(applications.applicationNumber, orderRef));
      return application;
    } catch (error) {
      console.error("Database error in getApplicationByOrderRef:", error);
      return void 0;
    }
  }
  async getAllApplications() {
    return await db.select().from(applications).orderBy(desc(applications.createdAt));
  }
  async createApplication(applicationData) {
    const [application] = await db.insert(applications).values(applicationData).returning();
    return application;
  }
  async getApplications() {
    try {
      const results = await db.select().from(applications).orderBy(desc(applications.createdAt)).limit(100);
      return results;
    } catch (error) {
      console.error("Database error in getApplications:", error);
      return [];
    }
  }
  async getApplicationsPaginated(page, limit, search) {
    try {
      const offset = (page - 1) * limit;
      let query = db.select().from(applications);
      let totalCount = 0;
      if (search && search.trim()) {
        const searchPattern = `%${search}%`;
        const searchCondition = or(
          ilike(applications.firstName, searchPattern),
          ilike(applications.lastName, searchPattern),
          ilike(applications.email, searchPattern),
          ilike(applications.applicationNumber, searchPattern)
        );
        query = query.where(searchCondition);
        const countResult = await db.select({ count: count() }).from(applications).where(searchCondition);
        totalCount = countResult[0]?.count || 0;
      } else {
        const countResult = await db.execute(sql`
          SELECT n_live_tup as count
          FROM pg_stat_user_tables 
          WHERE schemaname = 'public' AND relname = 'applications'
        `);
        totalCount = Number(countResult.rows[0]?.count || 0);
      }
      const results = await query.orderBy(desc(applications.id)).limit(limit).offset(offset);
      const normalizedApplications = results.map((app2) => ({
        ...app2,
        supportingDocumentType: app2.supportingDocumentType || app2.supporting_document_type,
        supportingDocumentCountry: app2.supportingDocumentCountry || app2.supporting_document_country,
        supportingDocumentNumber: app2.supportingDocumentNumber || app2.supporting_document_number,
        supportingDocumentStartDate: app2.supportingDocumentStartDate || app2.supporting_document_start_date,
        supportingDocumentEndDate: app2.supportingDocumentEndDate || app2.supporting_document_end_date
      }));
      return {
        applications: normalizedApplications,
        totalCount
      };
    } catch (error) {
      console.error("Database error in getApplicationsPaginated:", error);
      return { applications: [], totalCount: 0 };
    }
  }
  async getApplicationsStats() {
    try {
      const countResult = await db.execute(sql`
        SELECT n_live_tup as count
        FROM pg_stat_user_tables 
        WHERE schemaname = 'public' AND relname = 'applications'
      `);
      const totalCount = countResult.rows[0]?.count || 0;
      return {
        totalCount: Number(totalCount),
        totalRevenue: 0,
        // Skip for performance on large datasets
        pendingCount: 0
        // Skip for performance on large datasets
      };
    } catch (error) {
      console.error("Database error in getApplicationsStats:", error);
      return { totalCount: 0, totalRevenue: 0, pendingCount: 0 };
    }
  }
  async updateApplicationStatus(id, status) {
    const [updatedApp] = await db.update(applications).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(applications.id, id)).returning();
    return updatedApp;
  }
  async updateApplicationPaymentStatus(orderRef, paymentStatus) {
    try {
      await db.update(applications).set({ paymentStatus, updatedAt: /* @__PURE__ */ new Date() }).where(eq(applications.applicationNumber, orderRef));
      console.log(`\u2705 Payment status updated for visa application ${orderRef}: ${paymentStatus}`);
    } catch (error) {
      console.error("Database error in updateApplicationPaymentStatus:", error);
    }
  }
  async getInsuranceProducts() {
    try {
      return await db.select().from(insuranceProducts).orderBy(desc(insuranceProducts.isPopular));
    } catch (error) {
      console.error("Database error in getInsuranceProducts:", error);
      return [];
    }
  }
  async getInsuranceProduct(id) {
    const [product] = await db.select().from(insuranceProducts).where(eq(insuranceProducts.id, id));
    return product;
  }
  async createInsuranceProduct(productData) {
    const [product] = await db.insert(insuranceProducts).values(productData).returning();
    return product;
  }
  async createInsuranceApplication(applicationData) {
    const [application] = await db.insert(insuranceApplications).values(applicationData).returning();
    return application;
  }
  async getInsuranceApplicationByNumber(applicationNumber) {
    try {
      const [application] = await db.select().from(insuranceApplications).where(eq(insuranceApplications.applicationNumber, applicationNumber));
      return application;
    } catch (error) {
      console.error("Database error in getInsuranceApplicationByNumber:", error);
      return void 0;
    }
  }
  async getInsuranceApplicationByOrderRef(orderRef) {
    try {
      const [application] = await db.select().from(insuranceApplications).where(eq(insuranceApplications.applicationNumber, orderRef));
      return application;
    } catch (error) {
      console.error("Database error in getInsuranceApplicationByOrderRef:", error);
      return void 0;
    }
  }
  async getInsuranceApplications() {
    try {
      return await db.select().from(insuranceApplications).orderBy(desc(insuranceApplications.createdAt)).limit(100);
    } catch (error) {
      console.error("Database error in getInsuranceApplications:", error);
      return [];
    }
  }
  async getInsuranceApplicationsPaginated(page, limit, search) {
    try {
      const offset = (page - 1) * limit;
      let query = db.select().from(insuranceApplications);
      let totalCount = 0;
      if (search && search.trim()) {
        const searchPattern = `%${search}%`;
        const searchCondition = or(
          ilike(insuranceApplications.firstName, searchPattern),
          ilike(insuranceApplications.lastName, searchPattern),
          ilike(insuranceApplications.email, searchPattern),
          ilike(insuranceApplications.applicationNumber, searchPattern)
        );
        query = query.where(searchCondition);
        const countResult = await db.select({ count: count() }).from(insuranceApplications).where(searchCondition);
        totalCount = countResult[0]?.count || 0;
      } else {
        const countResult = await db.execute(sql`
          SELECT n_live_tup as count
          FROM pg_stat_user_tables 
          WHERE schemaname = 'public' AND relname = 'insurance_applications'
        `);
        totalCount = Number(countResult.rows[0]?.count || 0);
      }
      const results = await query.orderBy(desc(insuranceApplications.id)).limit(limit).offset(offset);
      return {
        applications: results,
        totalCount
      };
    } catch (error) {
      console.error("Database error in getInsuranceApplicationsPaginated:", error);
      return { applications: [], totalCount: 0 };
    }
  }
  async getInsuranceApplicationsStats() {
    try {
      const countResult = await db.execute(sql`
        SELECT n_live_tup as count
        FROM pg_stat_user_tables 
        WHERE schemaname = 'public' AND relname = 'insurance_applications'
      `);
      const totalCount = countResult.rows[0]?.count || 0;
      return {
        totalCount: Number(totalCount),
        totalRevenue: 0,
        // Skip for performance on large datasets  
        pendingCount: 0
        // Skip for performance on large datasets
      };
    } catch (error) {
      console.error("Database error in getInsuranceApplicationsStats:", error);
      return { totalCount: 0, totalRevenue: 0, pendingCount: 0 };
    }
  }
  async getInsuranceApplicationById(id) {
    try {
      const [application] = await db.select().from(insuranceApplications).where(eq(insuranceApplications.id, id));
      return application;
    } catch (error) {
      console.error("Database error in getInsuranceApplicationById:", error);
      return void 0;
    }
  }
  async updateInsuranceApplicationStatus(id, status) {
    const [updatedApp] = await db.update(insuranceApplications).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(insuranceApplications.id, id)).returning();
    return updatedApp;
  }
  async updateInsuranceApplicationPaymentStatus(orderRef, paymentStatus) {
    try {
      await db.update(insuranceApplications).set({ paymentStatus, updatedAt: /* @__PURE__ */ new Date() }).where(eq(insuranceApplications.applicationNumber, orderRef));
      console.log(`\u2705 Payment status updated for insurance application ${orderRef}: ${paymentStatus}`);
    } catch (error) {
      console.error("Database error in updateInsuranceApplicationPaymentStatus:", error);
    }
  }
  async updateApplicationPdf(id, pdfAttachment) {
    await db.update(applications).set({ pdfAttachment, updatedAt: /* @__PURE__ */ new Date() }).where(eq(applications.id, id));
  }
  async updateApplicationVisaType(id, visaType) {
    const [updatedApp] = await db.update(applications).set({
      supportingDocumentCountry: visaType,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(applications.id, id)).returning();
    return updatedApp;
  }
  async updateInsuranceApplicationPdf(id, pdfAttachment) {
    await db.update(insuranceApplications).set({ pdfAttachment, updatedAt: /* @__PURE__ */ new Date() }).where(eq(insuranceApplications.id, id));
  }
  // Chat operations
  async createChatMessage(message) {
    const chatData = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };
    const [created] = await db.insert(chatMessages).values(chatData).returning();
    return created;
  }
  async getAllChatMessages() {
    try {
      return db.select().from(chatMessages).orderBy(desc(chatMessages.timestamp));
    } catch (error) {
      console.error("Database error in getAllChatMessages:", error);
      return [];
    }
  }
  async getChatMessages() {
    try {
      return db.select().from(chatMessages).orderBy(desc(chatMessages.timestamp));
    } catch (error) {
      console.error("Database error in getChatMessages:", error);
      return [];
    }
  }
  async getChatMessagesBySession(sessionId) {
    return db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(desc(chatMessages.timestamp));
  }
  async markChatMessagesRead(sessionId) {
    await db.update(chatMessages).set({ isRead: true }).where(eq(chatMessages.sessionId, sessionId));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z as z2 } from "zod";

// server/email.ts
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
async function sendAdminCopyEmail(originalSubject, customerEmail, emailType, originalContent) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error("\u{1F6A8} SENDGRID_API_KEY bulunamad\u0131");
    return false;
  }
  try {
    console.log("\u{1F6A8} BA\u015ELAT: Admin kopya email g\xF6nderimi...");
    const adminMessage = {
      to: "copy@euramedglobal.com",
      from: {
        email: "info@getvisa.tr",
        name: "GetVisa Admin Notifications"
      },
      subject: `\u{1F6A8} ${emailType} KOPYA: ${originalSubject}`,
      text: `Administrative Notification - ${emailType} Application Copy

Customer Email: ${customerEmail}
Application Type: ${emailType}
Original Subject: ${originalSubject}

This is an automated administrative copy from the Turkey E-Visa Application System.

GetVisa Admin System`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #007bff; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">\u{1F4E7} YEN\u0130 BA\u015EVURU KOPYA</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">${emailType} BA\u015EVURU KOPYASI</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-left: 5px solid #dc3545;">
            <h3 style="color: #dc3545; margin-top: 0;">Application Details:</h3>
            <p><strong>Customer Email:</strong> ${customerEmail}</p>
            <p><strong>Application Type:</strong> ${emailType.toUpperCase()}</p>
            <p><strong>Original Subject:</strong> ${originalSubject}</p>
            <p><strong>Admin Email:</strong> copy@euramedglobal.com</p>
            <p><strong>Notification Time:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString("tr-TR")}</p>
          </div>
          <div style="padding: 20px; background: white; border: 1px solid #dee2e6;">
            <h3>Original Email Content:</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
              ${originalContent || "<p>Original email content not available</p>"}
            </div>
          </div>
          <div style="background: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px;">
            GetVisa.tr Admin Copy System - ${(/* @__PURE__ */ new Date()).toISOString()}
          </div>
        </div>
      `,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        "Importance": "high",
        "X-Mailer": "GetVisa Admin System"
      }
    };
    console.log("\u{1F6A8} Admin email i\xE7eri\u011Fi haz\u0131rland\u0131:", {
      to: adminMessage.to,
      from: adminMessage.from,
      subject: adminMessage.subject,
      hasText: !!adminMessage.text,
      hasHtml: !!adminMessage.html
    });
    const result = await sgMail.send(adminMessage);
    console.log("\u{1F6A8} SUCCESS: Admin kopya email g\xF6nderildi!", result[0]?.statusCode);
    console.log("\u{1F6A8} Admin Message ID:", result[0]?.headers?.["x-message-id"]);
    return true;
  } catch (error) {
    console.error("\u{1F6A8} HATA: Admin kopya email g\xF6nderilemedi:", error);
    console.error("\u{1F6A8} Error details:", error.response?.body || error.message);
    return false;
  }
}
async function sendEmail(options) {
  console.log("\u{1F527} SendGrid sendEmail function called");
  console.log("\u{1F527} API Key length:", process.env.SENDGRID_API_KEY?.length || 0);
  console.log("\u{1F527} To address:", options.to);
  console.log("\u{1F527} Subject:", options.subject);
  const fromEmail = "info@getvisa.tr";
  console.log("\u{1F527} From address (FIXED to info@getvisa.tr):", fromEmail);
  let customerSuccess = false;
  try {
    const customerEmailOptions = {
      ...options,
      from: fromEmail
    };
    const customerResult = await sgMail.send(customerEmailOptions);
    console.log("\u2705 Customer email sent successfully:", customerResult[0]?.statusCode);
    customerSuccess = true;
  } catch (customerError) {
    console.error("\u274C Customer email error:", customerError);
    console.error("\u274C Customer SendGrid error message:", customerError.message);
    console.error("\u274C Customer SendGrid error response:", customerError.response?.body);
  }
  try {
    const isVisaEmail = options.subject.includes("E-Visa");
    const isInsuranceEmail = options.subject.includes("Insurance");
    const emailType = isVisaEmail ? "VISA" : isInsuranceEmail ? "INSURANCE" : "APPLICATION";
    await new Promise((resolve) => setTimeout(resolve, 3e3));
    console.log("\u{1F6A8} BA\u015ELAT: Dedicated admin copy function \xE7a\u011Fr\u0131l\u0131yor...");
    const adminSuccess = await sendAdminCopyEmail(
      options.subject,
      options.to,
      emailType,
      options.html
    );
    if (adminSuccess) {
      console.log("\u{1F6A8} SUCCESS: Dedicated admin copy email sistemi ba\u015Far\u0131l\u0131!");
    } else {
      console.log("\u{1F6A8} WARNING: Dedicated admin copy email sistemi ba\u015Far\u0131s\u0131z!");
    }
    if (customerSuccess) {
      console.log("\u2705 Both emails sent - Customer and DEDICATED Admin Copy");
    } else {
      console.log("\u2705 DEDICATED Admin Copy sent, but customer email failed");
    }
  } catch (copyError) {
    console.error("\u274C Error in dedicated admin copy system:", copyError);
    if (customerSuccess) {
      console.log("\u2705 Customer email still sent successfully");
    } else {
      console.log("\u274C Both customer and admin copy emails failed");
    }
  }
  if (!customerSuccess) {
    throw new Error("Customer email delivery failed");
  }
}
function generateVisaReceivedEmail(firstName, lastName, applicationNumber, applicationData, language = "en") {
  const turkeyFlagSvg = `
    <svg width="32" height="24" viewBox="0 0 32 24" style="margin: 0 auto;">
      <rect width="32" height="24" fill="#E30A17"/>
      <g fill="#FFFFFF">
        <circle cx="10" cy="12" r="4"/>
        <circle cx="11.5" cy="12" r="3.2" fill="#E30A17"/>
        <path d="M18 8 L20 10 L22 8 L21 11 L24 12 L21 13 L22 16 L20 14 L18 16 L19 13 L16 12 L19 11 Z"/>
      </g>
    </svg>
  `;
  return {
    subject: `\u2705 Payment Successful - [${applicationNumber}] Turkey E-Visa Application Received`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>E-Visa Application Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
          <!-- Header - SIMPLIFIED -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background-color: #DC2626; color: white; padding: 30px; text-align: center;">
                <div style="margin-bottom: 15px;">\u{1F1F9}\u{1F1F7}</div>
                <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px; color: white;">TURKEY E VISA</h1>
                <p style="margin: 0; font-size: 16px; color: white; font-weight: 500;">ELECTRONIC VISA APPLICATION SYSTEM</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: white;">getvisa.tr</p>
              </td>
            </tr>
          </table>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <!-- Payment Success Confirmation - SIMPLIFIED -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
              <tr>
                <td style="background-color: #10b981; color: white; padding: 25px; text-align: center; border-radius: 8px;">
                  <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: bold; color: white;">\u2705 PAYMENT SUCCESSFUL!</h2>
                  <p style="margin: 0; font-size: 16px; color: white;">Your payment has been successfully processed and confirmed.</p>
                </td>
              </tr>
            </table>
            
            <!-- Application Status - SIMPLIFIED -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
              <tr>
                <td style="background-color: #f8f9fa; padding: 25px; text-align: center; border: 1px solid #dee2e6; border-radius: 8px;">
                  <p style="color: #1a1a1a; line-height: 1.7; margin: 0; font-size: 16px;">
                    <strong>Your Turkey Visa application has been successfully received and recorded.</strong><br>
                    <span style="color: #666; font-size: 14px;">Your application has been forwarded for evaluation.</span>
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Application Summary - SIMPLIFIED -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
              <tr>
                <td style="background-color: #DC2626; color: white; padding: 20px; text-align: center; border-radius: 8px;">
                  <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: bold; color: white;">\u{1F4CB} APPLICATION SUMMARY</h3>
                  <div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
                    <p style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 2px; color: white;">${applicationNumber}</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">Application Reference Number</p>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Visa Information -->
            <div style="background-color: #fef2f2; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #DC2626;">
              <h3 style="color: #DC2626; margin-top: 0; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #DC2626; padding-bottom: 10px;">\u{1F1F9}\u{1F1F7} VISA APPLICATION DETAILS</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Full Name:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${firstName} ${lastName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Passport Number:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; font-weight: bold;">${applicationData.passportNumber || "Not specified"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Date of Birth:</td>
                      <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth).toLocaleDateString("en-US") : "Not specified"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Country of Origin:</td>
                      <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.countryOfOrigin || "Not specified"}</td>
                    </tr>
                  </table>
                </div>
                <div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold; width: 45%;">Arrival Date:</td>
                      <td style="padding: 12px 0; color: #1a1a1a;">${applicationData.arrivalDate ? new Date(applicationData.arrivalDate).toLocaleDateString("en-US") : "Not specified"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Processing Type:</td>
                      <td style="padding: 12px 0; color: #1a1a1a; text-transform: capitalize;">${applicationData.processingType || "Standard"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">E-Visa Fee:</td>
                      <td style="padding: 12px 0; color: #1a1a1a;">$69.00</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">${applicationData.supportingDocumentType ? "Processing Fee (with docs):" : "Processing Fee:"}</td>
                      <td style="padding: 12px 0; color: #1a1a1a;">$${(parseFloat(applicationData.totalAmount || "69") - 69).toFixed(2)}</td>
                    </tr>
                    <tr style="border-top: 2px solid #DC2626;">
                      <td style="padding: 12px 0; color: #DC2626; font-weight: bold; font-size: 16px;">Total Amount:</td>
                      <td style="padding: 12px 0; color: #DC2626; font-weight: bold; font-size: 16px;">$${applicationData.totalAmount || "Not specified"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666; font-weight: bold;">Status:</td>
                      <td style="padding: 12px 0; color: #f59e0b; font-weight: bold;">\u23F3 UNDER REVIEW</td>
                    </tr>
                  </table>
                </div>
              </div>
              
              ${applicationData.placeOfBirth || applicationData.motherName || applicationData.fatherName || applicationData.address ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #fecaca;">
                <h4 style="color: #DC2626; margin: 0 0 15px 0; font-size: 16px;">\u{1F464} PERSONAL INFORMATION</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  ${applicationData.placeOfBirth ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold; width: 30%;">Place of Birth:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationData.placeOfBirth}</td>
                  </tr>` : ""}
                  ${applicationData.motherName ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Mother's Name:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationData.motherName}</td>
                  </tr>` : ""}
                  ${applicationData.fatherName ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Father's Name:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationData.fatherName}</td>
                  </tr>` : ""}
                  ${applicationData.address ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Address:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationData.address}</td>
                  </tr>` : ""}
                </table>
              </div>` : ""}
              
              ${applicationData.supportingDocumentType ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #fecaca;">
                <h4 style="color: #DC2626; margin: 0 0 15px 0; font-size: 16px;">\u{1F4C4} SUPPORTING DOCUMENTS</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold; width: 30%;">Document Type:</td>
                    <td style="padding: 8px 0; color: #1a1a1a; text-transform: capitalize;">${applicationData.supportingDocumentType}</td>
                  </tr>
                  ${applicationData.supportingDocumentNumber ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Document Number:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${applicationData.supportingDocumentNumber}</td>
                  </tr>` : ""}
                  ${applicationData.supportingDocumentStartDate ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Valid From:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${new Date(applicationData.supportingDocumentStartDate).toLocaleDateString("en-US")}</td>
                  </tr>` : ""}
                  ${applicationData.supportingDocumentEndDate ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Valid Until:</td>
                    <td style="padding: 8px 0; color: #1a1a1a;">${new Date(applicationData.supportingDocumentEndDate).toLocaleDateString("en-US")}</td>
                  </tr>` : ""}
                </table>
              </div>` : ""}
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.5;">
                <strong>\u26A0\uFE0F Important Information:</strong><br>
                \u2022 Your e-visa application evaluation takes 3-5 business days<br>
                \u2022 You can check the current status using your application number<br>
                \u2022 When your e-visa is approved, you will receive your electronic visa via email<br>
                \u2022 Processing time may vary based on the selected processing type
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #DC2626; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                \u{1F50D} Check Application Status
              </a>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #cbd5e1;">
              <h4 style="margin: 0 0 10px 0; color: #475569; font-size: 16px;">\u{1F4F1} Quick Status Check:</h4>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                Visit <strong>https://getvisa.tr/status</strong> and enter your application number:<br>
                <span style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-weight: bold; color: #1e293b;">${applicationNumber}</span>
              </p>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">\u{1F4AC} Customer Service:</h4>
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                If you have any questions, please visit our website or contact our support team. We're here to help you throughout the application process.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; margin-top: 30px;">
              <p style="margin: 0;">\xA9 2025 EURAMED LTD - Turkey Visa Services</p>
              
              <p style="margin: 10px 0 0 0; font-size: 11px;">
                EURAMED LTD | Contact: info@euramedglobal.com | Website: getvisa.tr
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
TURKEY E-ELECTRONIC VISA APPLICATION SYSTEM

Dear ${firstName} ${lastName},

\u{1F4B3} PAYMENT SUCCESSFUL!
Your payment has been successfully processed and confirmed.

Your Turkey Visa application has been successfully received and recorded.

APPLICATION DETAILS:
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Application Reference No: ${applicationNumber}
Applicant: ${firstName} ${lastName}
Passport Number: ${applicationData.passportNumber || "Not specified"}
Date of Birth: ${applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth).toLocaleDateString("en-US") : "Not specified"}
Country of Origin: ${applicationData.countryOfOrigin || "Not specified"}
Arrival Date: ${applicationData.arrivalDate ? new Date(applicationData.arrivalDate).toLocaleDateString("en-US") : "Not specified"}
Processing Type: ${applicationData.processingType || "Standard"}

PRICING BREAKDOWN:
E-Visa Fee: $69.00
${applicationData.supportingDocumentType ? "Processing Fee (with docs):" : "Processing Fee:"} $${(parseFloat(applicationData.totalAmount || "69") - 69).toFixed(2)}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
TOTAL AMOUNT: $${applicationData.totalAmount || "Not specified"}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

Status: UNDER REVIEW
Application Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US")} ${(/* @__PURE__ */ new Date()).toLocaleTimeString("en-US")}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

IMPORTANT INFORMATION:
\u2022 Your e-visa application evaluation takes 3-5 business days
\u2022 You can check the current status using your application number
\u2022 When your e-visa is approved, you will receive your electronic visa via email
\u2022 Processing time may vary based on the selected processing type

CHECK STATUS: https://getvisa.tr/status?ref=${applicationNumber}

Best regards,
Turkey E-Visa Services Team

---
EURAMED LTD - Turkey Visa Services
Contact: info@euramedglobal.com | Website: getvisa.tr

    `
  };
}
function generateVisaRejectionEmail(firstName, lastName, applicationNumber, rejectionReason = "Your application did not meet the requirements.") {
  const turkeyFlagSvg = `
    <svg width="32" height="24" viewBox="0 0 32 24" style="margin: 0 auto;">
      <rect width="32" height="24" fill="#E30A17"/>
      <g fill="#FFFFFF">
        <circle cx="10" cy="12" r="4"/>
        <circle cx="11.5" cy="12" r="3.2" fill="#E30A17"/>
        <path d="M18 8 L20 10 L22 8 L21 11 L24 12 L21 13 L22 16 L20 14 L18 16 L19 13 L16 12 L19 11 Z"/>
      </g>
    </svg>
  `;
  return {
    subject: `[${applicationNumber}] Turkey E-Visa Application - Status Update`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>E-Visa Application Status</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
          <!-- Header - SIMPLIFIED -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background-color: #DC2626; color: white; padding: 30px; text-align: center;">
                <div style="margin-bottom: 15px;">\u{1F1F9}\u{1F1F7}</div>
                <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px; color: white;">TURKEY E VISA</h1>
                <p style="margin: 0; font-size: 16px; color: white; font-weight: 500;">ELECTRONIC VISA APPLICATION SYSTEM</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: white;">getvisa.tr</p>
              </td>
            </tr>
          </table>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #f87171;">
              <p style="color: #991b1b; line-height: 1.7; margin: 0; font-size: 16px; text-align: center;">
                <strong>We regret to inform you that your Turkey Visa application has been reviewed and unfortunately cannot be approved at this time.</strong>
              </p>
            </div>
            
            <!-- Application Summary -->
            <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold;">\u{1F4CB} APPLICATION REFERENCE</h3>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${applicationNumber}</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Status: REJECTED</p>
              </div>
            </div>
            
            <!-- Rejection Reason -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h4 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">\u{1F4DD} Reason for Rejection:</h4>
              <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                ${rejectionReason}
              </p>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">\u{1F4DE} Next Steps:</h4>
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                If you believe this decision was made in error, or if you would like to reapply with additional documentation, please contact our support team. We're here to help you with your Turkey visa application process.
              </p>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #cbd5e1;">
              <h4 style="margin: 0 0 10px 0; color: #475569; font-size: 16px;">\u{1F4AC} Customer Service:</h4>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                \u{1F4E7} Email: info@euramedglobal.com<br>
                \u{1F310} Website: https://getvisa.tr<br>
                \u{1F4F1} 24/7 Customer Service Available
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; margin-top: 30px;">
              <p style="margin: 0;">\xA9 2025 EURAMED LTD - Turkey Visa Services</p>
              
              <p style="margin: 10px 0 0 0; font-size: 11px;">
                EURAMED LTD | Contact: info@euramedglobal.com | Website: getvisa.tr
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
TURKEY E-ELECTRONIC VISA APPLICATION SYSTEM

Dear ${firstName} ${lastName},

We regret to inform you that your Turkey Visa application has been reviewed and unfortunately cannot be approved at this time.

APPLICATION DETAILS:
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Application Reference No: ${applicationNumber}
Applicant: ${firstName} ${lastName}
Status: REJECTED
Review Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US")} ${(/* @__PURE__ */ new Date()).toLocaleTimeString("en-US")}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

REASON FOR REJECTION:
${rejectionReason}

NEXT STEPS:
If you believe this decision was made in error, or if you would like to reapply with additional documentation, please contact our support team.

CUSTOMER SERVICE:
Email: info@euramedglobal.com
Website: https://getvisa.tr
24/7 Customer Service Available

Best regards,
Turkey E-Visa Services Team

---
EURAMED LTD - Turkey Visa Services
Contact: info@euramedglobal.com | Website: getvisa.tr

    `
  };
}
function generateVisaApprovalEmail(firstName, lastName, applicationNumber, pdfAttachment, language = "en") {
  const turkeyFlagSvg = `
    <svg width="40" height="30" viewBox="0 0 40 30" style="margin: 0 auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <rect width="40" height="30" fill="#E30A17"/>
      <g fill="#FFFFFF">
        <circle cx="12" cy="15" r="5"/>
        <circle cx="14" cy="15" r="4" fill="#E30A17"/>
        <path d="M22 10 L24.5 12.5 L27 10 L25.5 13.5 L29 15 L25.5 16.5 L27 20 L24.5 17.5 L22 20 L23.5 16.5 L20 15 L23.5 13.5 Z"/>
      </g>
    </svg>
  `;
  return {
    subject: `[${applicationNumber}] Turkey E-Visa Application APPROVED`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Turkey E-Visa Approved</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
          <!-- Header - SIMPLIFIED -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background-color: #DC2626; color: white; padding: 30px; text-align: center;">
                <div style="margin-bottom: 15px;">\u{1F1F9}\u{1F1F7}</div>
                <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px; color: white;">TURKEY E VISA</h1>
                <p style="margin: 0; font-size: 16px; color: white; font-weight: 500;">ELECTRONIC VISA APPLICATION SYSTEM</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: white;">getvisa.tr</p>
              </td>
            </tr>
          </table>
          
          <!-- Success Banner -->
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 25px; text-align: center; border-bottom: 3px solid #047857;">
            <h2 style="margin: 0; font-size: 28px; font-weight: bold;">\u2705 APPROVED</h2>
            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.95;">Your Turkey E-Visa has been approved!</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <p style="color: #1a1a1a; line-height: 1.7; margin-bottom: 20px; font-size: 16px;">
              <strong>Congratulations!</strong> Your Turkey Visa application has been <span style="color: #10B981; font-weight: bold;">APPROVED</span> and is ready for use.
            </p>
            
            <!-- Application Details -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #DC2626;">
              <h3 style="color: #DC2626; margin: 0 0 15px 0; font-size: 18px;">\u{1F4CB} Visa Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold; width: 40%;">Application Number:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${applicationNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Visa Holder:</td>
                  <td style="padding: 8px 0; color: #1a1a1a;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                  <td style="padding: 8px 0; color: #10B981; font-weight: bold;">APPROVED</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Issue Date:</td>
                  <td style="padding: 8px 0; color: #1a1a1a;">${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US")}</td>
                </tr>
              </table>
            </div>
            
            ${pdfAttachment ? `
            <!-- PDF Attachment Notice -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 25px; margin: 25px 0; border-radius: 8px;">
              <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">\u{1F4CE} Your E-Visa Document</h3>
              <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">
                \u2022 Your official e-visa document is <strong>attached to this email as a PDF</strong><br>
                \u2022 Please <strong>download and print</strong> your e-visa before traveling to Turkey<br>
                \u2022 You must present the <strong>printed e-visa along with your passport</strong> at the Turkish border<br>
                \u2022 Keep both digital and printed copies for your travel records
              </p>
            </div>
            ` : ""}
            
            <!-- Important Instructions -->
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 25px; margin: 25px 0; border-radius: 8px;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">\u{1F6C2} Travel Instructions</h3>
              <p style="margin: 0; color: #1e40af; font-size: 15px; line-height: 1.6;">
                \u2022 Present your printed e-visa and passport to Turkish immigration<br>
                \u2022 Ensure your passport is valid for at least 6 months from entry date<br>
                \u2022 Your e-visa allows single or multiple entries as specified<br>
                \u2022 Keep your e-visa document accessible during your entire stay
              </p>
            </div>
            
            <!-- Action Buttons -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://getvisa.tr/api/download/visa/${applicationNumber}" style="background-color: #10B981; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
                \u{1F4C4} Download E-Visa
              </a>
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #DC2626; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
                \u{1F50D} Check Status
              </a>
            </div>
            
            <!-- Contact Information -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 6px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                <strong>Need assistance?</strong><br>
                Contact us at <a href="mailto:info@euramedglobal.com" style="color: #DC2626;">info@euramedglobal.com</a><br>
                Visit: <a href="https://getvisa.tr" style="color: #DC2626;">getvisa.tr</a>
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
              Have a wonderful trip to Turkey! \u{1F1F9}\u{1F1F7}<br>
              <em>This is an automated email. Please do not reply to this message.</em>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">\xA9 2025 EURAMED LTD - Turkey Visa Services</p>
            
            <p style="margin: 10px 0 0 0; font-size: 11px;">
              EURAMED LTD | Contact: info@euramedglobal.com | Website: getvisa.tr
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
[APPROVED] Turkey E-Visa Application ${applicationNumber}

Dear ${firstName} ${lastName},

Congratulations! Your Turkey Visa has been APPROVED.

Visa Details:
- Application Number: ${applicationNumber}
- Visa Holder: ${firstName} ${lastName}
- Status: APPROVED
- Issue Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US")}

${pdfAttachment ? `
IMPORTANT: Your official e-visa document is attached to this email as a PDF.
- Download and print your e-visa before traveling
- Present the printed e-visa along with your passport at the Turkish border
- Keep both digital and printed copies for your records
` : ""}

Travel Instructions:
- Present your printed e-visa and passport to Turkish immigration
- Ensure your passport is valid for at least 6 months from entry date
- Your e-visa allows entry as specified in the document
- Keep your e-visa accessible during your entire stay

Download your e-visa: https://getvisa.tr/status?ref=${applicationNumber}
Check status: https://getvisa.tr/status?ref=${applicationNumber}

Contact: info@euramedglobal.com
Website: getvisa.tr

Have a wonderful trip to Turkey!

---
EURAMED LTD - Turkey Visa Services
Contact: info@euramedglobal.com | Website: getvisa.tr


This is an automated email. Please do not reply to this message.
    `
  };
}
function generateInsuranceReceivedEmail(firstName, lastName, applicationNumber, productName, applicationData, language = "en") {
  const turkeyFlagSvg = `
    <svg width="32" height="24" viewBox="0 0 32 24" style="margin: 0 auto;">
      <rect width="32" height="24" fill="#E30A17"/>
      <g fill="#FFFFFF">
        <circle cx="10" cy="12" r="4"/>
        <circle cx="11.5" cy="12" r="3.2" fill="#E30A17"/>
        <path d="M18 8 L20 10 L22 8 L21 11 L24 12 L21 13 L22 16 L20 14 L18 16 L19 13 L16 12 L19 11 Z"/>
      </g>
    </svg>
  `;
  return {
    subject: `[${applicationNumber}] Turkey Travel Insurance Application Received`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Insurance Application Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center;">
            ${turkeyFlagSvg}
            <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">TURKEY TRAVEL INSURANCE</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">TRAVEL INSURANCE SYSTEM</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">getvisa.tr</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #dee2e6;">
              <p style="color: #1a1a1a; line-height: 1.7; margin: 0; font-size: 16px; text-align: center;">
                <strong>Your Turkey Travel Insurance application has been successfully received and recorded.</strong><br>
                <span style="color: #666; font-size: 14px;">Your application has been forwarded for evaluation.</span>
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #DC2626; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                \u{1F50D} Check Application Status
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Dear ${firstName} ${lastName},

Your Turkey Travel Insurance application has been successfully received and recorded.

Application Number: ${applicationNumber}

You can check your application status at: https://getvisa.tr/status?ref=${applicationNumber}
    `
  };
}
function generateInsuranceApprovalEmail(firstName, lastName, applicationNumber, productName, pdfAttachment) {
  const turkeyFlagSvg = `
    <svg width="32" height="24" viewBox="0 0 32 24" style="margin: 0 auto;">
      <rect width="32" height="24" fill="#E30A17"/>
      <g fill="#FFFFFF">
        <circle cx="10" cy="12" r="4"/>
        <circle cx="11.5" cy="12" r="3.2" fill="#E30A17"/>
        <path d="M18 8 L20 10 L22 8 L21 11 L24 12 L21 13 L22 16 L20 14 L18 16 L19 13 L16 12 L19 11 Z"/>
      </g>
    </svg>
  `;
  return {
    subject: `[${applicationNumber}] Turkey Travel Insurance Approved - Your Policy is Ready`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Turkey Travel Insurance Approved</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 30px; text-align: center;">
            ${turkeyFlagSvg}
            <h1 style="margin: 15px 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">\u2705 TURKEY TRAVEL INSURANCE APPROVED</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">TRAVEL INSURANCE SYSTEM</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">getvisa.tr</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 22px;">Dear ${firstName} ${lastName},</h2>
            
            <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #0284c7;">
              <p style="color: #1a1a1a; line-height: 1.7; margin: 0; font-size: 16px; text-align: center;">
                <strong>\u{1F389} Congratulations! Your Turkey Travel Insurance has been APPROVED and is ready for use.</strong><br>
                <span style="color: #0369a1; font-size: 14px;">Your insurance policy is attached to this email or can be downloaded below.</span>
              </p>
            </div>
            
            <!-- Insurance Information -->
            <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold;">\u{1F4CB} INSURANCE POLICY DETAILS</h3>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                <table style="width: 100%; border-collapse: collapse; color: white;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Application Number:</td>
                    <td style="padding: 8px 0; text-align: right; font-family: monospace; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">${applicationNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Policy Holder:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Insurance Package:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${productName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Status:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #86efac;">\u2705 APPROVED</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; text-align: left;">Issue Date:</td>
                    <td style="padding: 8px 0; text-align: right;">${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US")}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            ${pdfAttachment ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.5;">
                <strong>\u{1F4CE} Important:</strong><br>
                \u2022 Your official insurance policy is attached to this email as a PDF<br>
                \u2022 Please download and print your policy before traveling<br>
                \u2022 Carry the printed policy with you during your trip to Turkey
              </p>
            </div>
            ` : ""}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://getvisa.tr/api/download/insurance/${applicationNumber}" style="background-color: #0284c7; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
                \u{1F4C4} Download Policy
              </a>
              <a href="https://getvisa.tr/status?ref=${applicationNumber}" style="background-color: #DC2626; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; margin: 0 10px 10px 0;">
                \u{1F50D} Check Status
              </a>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">\u{1F4AC} Customer Support:</h4>
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                If you have any questions about your insurance policy or need assistance:<br>
                \u{1F4E7} Email: info@euramedglobal.com<br>
                \u{1F310} Website: https://getvisa.tr<br>
                \u{1F4F1} 24/7 Customer Service Available
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; margin-top: 30px;">
              <p style="margin: 0;">\xA9 2025 EURAMED LTD - Turkey Travel Insurance Services</p>
              
              <p style="margin: 10px 0 0 0; font-size: 11px;">
                EURAMED LTD | Contact: info@euramedglobal.com | Website: getvisa.tr
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Dear ${firstName} ${lastName},

Congratulations! Your Turkey Travel Insurance has been APPROVED.

Application Number: ${applicationNumber}
Policy Holder: ${firstName} ${lastName}
Insurance Package: ${productName}
Status: APPROVED
Issue Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US")}

Download your policy at: https://getvisa.tr/status?ref=${applicationNumber}

This email was sent automatically. For questions, contact us at info@euramedglobal.com

---
EURAMED LTD - Turkey Travel Insurance Services
Contact: info@euramedglobal.com | Website: getvisa.tr

    `
  };
}

// server/routes.ts
function generateApplicationNumber() {
  const timestamp2 = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TR${timestamp2}${random}`.toUpperCase();
}
async function registerRoutes(app2) {
  app2.get("/api/countries", async (req, res) => {
    try {
      const countries2 = await storage.getCountries();
      res.json(countries2);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });
  app2.get("/api/countries/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const country = await storage.getCountryByCode(code);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      console.error("Error fetching country:", error);
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });
  app2.post("/api/applications", async (req, res) => {
    try {
      const bodyWithDates = {
        ...req.body,
        applicationNumber: generateApplicationNumber(),
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : void 0,
        arrivalDate: req.body.arrivalDate ? new Date(req.body.arrivalDate) : void 0,
        passportIssueDate: req.body.passportIssueDate ? new Date(req.body.passportIssueDate) : void 0,
        passportExpiryDate: req.body.passportExpiryDate ? new Date(req.body.passportExpiryDate) : void 0,
        supportingDocumentStartDate: req.body.supportingDocumentStartDate ? new Date(req.body.supportingDocumentStartDate) : void 0,
        supportingDocumentEndDate: req.body.supportingDocumentEndDate ? new Date(req.body.supportingDocumentEndDate) : void 0
      };
      const validatedData = insertApplicationSchema.parse({
        ...bodyWithDates,
        totalAmount: "0"
        // Temporary value, will be recalculated after scenario normalization
      });
      try {
        if (!validatedData.countryId) {
          return res.status(400).json({ message: "Country ID is required" });
        }
        const country = await storage.getCountryById(validatedData.countryId);
        if (!country) {
          return res.status(400).json({ message: "Invalid country ID" });
        }
        let effectiveScenario = country.scenario;
        if (country.code === "EGY" && validatedData.dateOfBirth) {
          const age = Math.floor((Date.now() - validatedData.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1e3));
          effectiveScenario = age >= 15 && age <= 45 ? 2 : 1;
          console.log(`Egypt age-based scenario: age=${age}, scenario=${effectiveScenario}`);
        }
        if (effectiveScenario === 1) {
          validatedData.supportingDocumentType = void 0;
          validatedData.supportingDocumentNumber = void 0;
          validatedData.supportingDocumentStartDate = void 0;
          validatedData.supportingDocumentEndDate = void 0;
          validatedData.supportingDocumentCountry = void 0;
        }
        if (effectiveScenario === 4) {
          return res.status(400).json({
            message: "E-visa applications are not available for this country. Please visit the nearest consulate."
          });
        }
        if (effectiveScenario === 3) {
          return res.status(400).json({
            message: "You are exempt from visa requirements, but travel insurance is mandatory. Please purchase travel insurance instead."
          });
        }
        const hasSupportingDocument = req.body.supportingDocumentType && req.body.supportingDocumentType !== "";
        const hasSupporting = hasSupportingDocument;
        if (effectiveScenario === 1 && hasSupporting) {
          return res.status(400).json({
            message: "Supporting documents are not required for your country. Please remove supporting documents."
          });
        }
        if (effectiveScenario === 2 && !hasSupporting) {
          return res.status(400).json({
            message: "Supporting documents are required for your country. Please provide the necessary supporting documents."
          });
        }
        console.log(`\u2705 Scenario validation passed: Country=${country.code}, Scenario=${effectiveScenario}, HasSupporting=${hasSupporting}`);
        const processingTypes = {
          "slow": 90,
          // Ready in 7 days
          "standard": 155,
          // Ready in 4 days  
          "fast": 205,
          // Ready in 2 days
          "urgent_24": 320,
          // Ready in 24 hours
          "urgent_12": 370,
          // Ready in 12 hours
          "urgent_4": 450,
          // Ready in 4 hours
          "urgent_1": 685
          // Ready in 1 hour
        };
        const finalHasSupporting = validatedData.supportingDocumentType && validatedData.supportingDocumentType !== "";
        const finalProcessingType = validatedData.processingType || "slow";
        let calculatedTotalAmount = 90;
        const eVisaFee = 69;
        const processingFee = processingTypes[finalProcessingType] || 90;
        calculatedTotalAmount = processingFee + eVisaFee;
        validatedData.totalAmount = calculatedTotalAmount.toString();
        console.log(`\u{1F4B0} Final pricing calculation: ProcessingType=${finalProcessingType}, HasSupporting=${finalHasSupporting}, TotalAmount=$${calculatedTotalAmount}`);
      } catch (validationError) {
        console.error("Scenario validation error:", validationError);
        return res.status(500).json({ message: "Failed to validate application requirements" });
      }
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create application" });
    }
  });
  app2.get("/api/applications", async (req, res) => {
    try {
      const applications2 = await storage.getApplications();
      res.json(applications2);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  app2.get("/api/applications/:applicationNumber", async (req, res) => {
    try {
      const { applicationNumber } = req.params;
      const application = await storage.getApplicationByNumber(applicationNumber);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });
  app2.get("/api/insurance-products", async (req, res) => {
    try {
      const products = await storage.getInsuranceProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching insurance products:", error);
      res.status(500).json({ message: "Failed to fetch insurance products" });
    }
  });
  app2.get("/api/insurance/products", async (req, res) => {
    try {
      const products = await storage.getInsuranceProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching insurance products:", error);
      res.status(500).json({ message: "Failed to fetch insurance products" });
    }
  });
  app2.get("/api/insurance-applications", async (req, res) => {
    try {
      const applications2 = await storage.getInsuranceApplications();
      res.json(applications2);
    } catch (error) {
      console.error("Error fetching insurance applications:", error);
      res.status(500).json({ message: "Failed to fetch insurance applications" });
    }
  });
  app2.post("/api/insurance/applications", async (req, res) => {
    try {
      console.log("=== INSURANCE APPLICATION DEBUG ===");
      console.log("Raw dateOfBirth:", req.body.dateOfBirth, typeof req.body.dateOfBirth);
      console.log("Raw totalAmount:", req.body.totalAmount, typeof req.body.totalAmount);
      const bodyWithDates = {
        ...req.body,
        applicationNumber: generateApplicationNumber(),
        destination: req.body.destination || "Turkey",
        // Default destination
        travelDate: req.body.travelDate ? new Date(req.body.travelDate) : void 0,
        returnDate: req.body.returnDate ? new Date(req.body.returnDate) : void 0,
        dateOfBirth: req.body.dateOfBirth,
        // Keep as string
        totalAmount: req.body.totalAmount
        // Keep original value first
      };
      console.log("After processing - dateOfBirth:", bodyWithDates.dateOfBirth, typeof bodyWithDates.dateOfBirth);
      console.log("After processing - totalAmount:", bodyWithDates.totalAmount, typeof bodyWithDates.totalAmount);
      const validatedData = insertInsuranceApplicationSchema.parse(bodyWithDates);
      const application = await storage.createInsuranceApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating insurance application:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create insurance application" });
    }
  });
  app2.get("/api/insurance/applications/:applicationNumber", async (req, res) => {
    try {
      const { applicationNumber } = req.params;
      const application = await storage.getInsuranceApplicationByNumber(applicationNumber);
      if (!application) {
        return res.status(404).json({ message: "Insurance application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching insurance application:", error);
      res.status(500).json({ message: "Failed to fetch insurance application" });
    }
  });
  app2.post("/api/seed", async (req, res) => {
    try {
      const countriesData = [
        // E-visa eligible countries (official list from evisa.gov.tr)
        { code: "AFG", name: "Afghanistan", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "DZA", name: "Algeria", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "ATG", name: "Antigua and Barbuda", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "ARM", name: "Armenia", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "AUS", name: "Australia", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 90, validityDays: 180 },
        { code: "BHS", name: "Bahamas", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "BGD", name: "Bangladesh", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "BRB", name: "Barbados", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "BMU", name: "Bermuda", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "BTN", name: "Bhutan", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "KHM", name: "Cambodia", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "CPV", name: "Cape Verde", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "CHN", name: "China", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "invitation"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "HRV", name: "Croatia", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "DMA", name: "Dominica", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "DOM", name: "Dominican Republic", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "TLS", name: "East Timor", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "EGY", name: "Egypt", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "GNQ", name: "Equatorial Guinea", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "EST", name: "Estonia", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "FJI", name: "Fiji", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "GRD", name: "Grenada", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "HTI", name: "Haiti", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "HKG", name: "Hong Kong", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "IND", name: "India", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "IRQ", name: "Iraq", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "JAM", name: "Jamaica", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "LVA", name: "Latvia", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "LBY", name: "Libya", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "LTU", name: "Lithuania", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "MDV", name: "Maldives", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "MUS", name: "Mauritius", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "MEX", name: "Mexico", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "NAM", name: "Namibia", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "NPL", name: "Nepal", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "PAK", name: "Pakistan", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "PSE", name: "Palestine", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "PHL", name: "Philippines", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "LCA", name: "Saint Lucia", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "VCT", name: "Saint Vincent and the Grenadines", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "SEN", name: "Senegal", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "SLB", name: "Solomon Islands", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "ZAF", name: "South Africa", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "LKA", name: "Sri Lanka", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "SUR", name: "Suriname", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "TWN", name: "Taiwan", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "VUT", name: "Vanuatu", isEligible: true, requiresSupportingDocs: false, visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "VNM", name: "Vietnam", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        { code: "YEM", name: "Yemen", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"], visaFee: "60.00", maxStayDays: 30, validityDays: 180 },
        // Non-eligible countries (examples)
        { code: "USA", name: "United States", isEligible: false, requiresSupportingDocs: false },
        { code: "GBR", name: "United Kingdom", isEligible: false, requiresSupportingDocs: false },
        { code: "DEU", name: "Germany", isEligible: false, requiresSupportingDocs: false },
        { code: "FRA", name: "France", isEligible: false, requiresSupportingDocs: false },
        { code: "JPN", name: "Japan", isEligible: false, requiresSupportingDocs: false },
        { code: "CAN", name: "Canada", isEligible: false, requiresSupportingDocs: false },
        { code: "ITA", name: "Italy", isEligible: false, requiresSupportingDocs: false },
        { code: "ESP", name: "Spain", isEligible: false, requiresSupportingDocs: false },
        { code: "NLD", name: "Netherlands", isEligible: false, requiresSupportingDocs: false },
        { code: "BRA", name: "Brazil", isEligible: false, requiresSupportingDocs: false },
        { code: "NGA", name: "Nigeria", isEligible: false, requiresSupportingDocs: false },
        { code: "IRN", name: "Iran", isEligible: false, requiresSupportingDocs: false },
        { code: "SYR", name: "Syria", isEligible: false, requiresSupportingDocs: false },
        // Additional major countries missing from the original seed
        { code: "TUR", name: "Turkey", isEligible: false, requiresSupportingDocs: false },
        { code: "RUS", name: "Russian Federation", isEligible: false, requiresSupportingDocs: false },
        { code: "ARG", name: "Argentina", isEligible: false, requiresSupportingDocs: false },
        { code: "CHE", name: "Switzerland", isEligible: false, requiresSupportingDocs: false },
        { code: "AUT", name: "Austria", isEligible: false, requiresSupportingDocs: false },
        { code: "BEL", name: "Belgium", isEligible: false, requiresSupportingDocs: false },
        { code: "DNK", name: "Denmark", isEligible: false, requiresSupportingDocs: false },
        { code: "FIN", name: "Finland", isEligible: false, requiresSupportingDocs: false },
        { code: "NOR", name: "Norway", isEligible: false, requiresSupportingDocs: false },
        { code: "SWE", name: "Sweden", isEligible: false, requiresSupportingDocs: false },
        { code: "PRT", name: "Portugal", isEligible: false, requiresSupportingDocs: false },
        { code: "GRC", name: "Greece", isEligible: false, requiresSupportingDocs: false },
        { code: "POL", name: "Poland", isEligible: false, requiresSupportingDocs: false },
        { code: "CZE", name: "Czech Republic", isEligible: false, requiresSupportingDocs: false },
        { code: "HUN", name: "Hungary", isEligible: false, requiresSupportingDocs: false },
        { code: "SVK", name: "Slovakia", isEligible: false, requiresSupportingDocs: false },
        { code: "SVN", name: "Slovenia", isEligible: false, requiresSupportingDocs: false },
        { code: "ROU", name: "Romania", isEligible: false, requiresSupportingDocs: false },
        { code: "BGR", name: "Bulgaria", isEligible: false, requiresSupportingDocs: false },
        { code: "LUX", name: "Luxembourg", isEligible: false, requiresSupportingDocs: false },
        { code: "IRL", name: "Ireland", isEligible: false, requiresSupportingDocs: false },
        { code: "ISL", name: "Iceland", isEligible: false, requiresSupportingDocs: false },
        { code: "MLT", name: "Malta", isEligible: false, requiresSupportingDocs: false },
        { code: "CYP", name: "Cyprus", isEligible: false, requiresSupportingDocs: false },
        // Asian Countries
        { code: "KOR", name: "South Korea", isEligible: false, requiresSupportingDocs: false },
        { code: "PRK", name: "North Korea", isEligible: false, requiresSupportingDocs: false },
        { code: "MNG", name: "Mongolia", isEligible: false, requiresSupportingDocs: false },
        { code: "KAZ", name: "Kazakhstan", isEligible: false, requiresSupportingDocs: false },
        { code: "KGZ", name: "Kyrgyzstan", isEligible: false, requiresSupportingDocs: false },
        { code: "TJK", name: "Tajikistan", isEligible: false, requiresSupportingDocs: false },
        { code: "TKM", name: "Turkmenistan", isEligible: false, requiresSupportingDocs: false },
        { code: "UZB", name: "Uzbekistan", isEligible: false, requiresSupportingDocs: false },
        { code: "AZE", name: "Azerbaijan", isEligible: false, requiresSupportingDocs: false },
        { code: "GEO", name: "Georgia", isEligible: false, requiresSupportingDocs: false },
        { code: "THA", name: "Thailand", isEligible: false, requiresSupportingDocs: false },
        { code: "MYS", name: "Malaysia", isEligible: false, requiresSupportingDocs: false },
        { code: "SGP", name: "Singapore", isEligible: false, requiresSupportingDocs: false },
        { code: "IDN", name: "Indonesia", isEligible: false, requiresSupportingDocs: false },
        { code: "LAO", name: "Laos", isEligible: false, requiresSupportingDocs: false },
        { code: "MMR", name: "Myanmar", isEligible: false, requiresSupportingDocs: false },
        { code: "BRN", name: "Brunei", isEligible: false, requiresSupportingDocs: false },
        // Middle East & Africa
        { code: "SAU", name: "Saudi Arabia", isEligible: false, requiresSupportingDocs: false },
        { code: "ARE", name: "United Arab Emirates", isEligible: false, requiresSupportingDocs: false },
        { code: "QAT", name: "Qatar", isEligible: false, requiresSupportingDocs: false },
        { code: "BHR", name: "Bahrain", isEligible: false, requiresSupportingDocs: false },
        { code: "KWT", name: "Kuwait", isEligible: false, requiresSupportingDocs: false },
        { code: "OMN", name: "Oman", isEligible: false, requiresSupportingDocs: false },
        { code: "JOR", name: "Jordan", isEligible: false, requiresSupportingDocs: false },
        { code: "LBN", name: "Lebanon", isEligible: false, requiresSupportingDocs: false },
        { code: "ISR", name: "Israel", isEligible: false, requiresSupportingDocs: false },
        { code: "MAR", name: "Morocco", isEligible: false, requiresSupportingDocs: false },
        { code: "TUN", name: "Tunisia", isEligible: false, requiresSupportingDocs: false },
        { code: "ETH", name: "Ethiopia", isEligible: false, requiresSupportingDocs: false },
        { code: "KEN", name: "Kenya", isEligible: false, requiresSupportingDocs: false },
        { code: "UGA", name: "Uganda", isEligible: false, requiresSupportingDocs: false },
        { code: "TZA", name: "Tanzania", isEligible: false, requiresSupportingDocs: false },
        { code: "ZWE", name: "Zimbabwe", isEligible: false, requiresSupportingDocs: false },
        { code: "ZMB", name: "Zambia", isEligible: false, requiresSupportingDocs: false },
        { code: "BWA", name: "Botswana", isEligible: false, requiresSupportingDocs: false },
        { code: "GHA", name: "Ghana", isEligible: false, requiresSupportingDocs: false },
        { code: "CIV", name: "Ivory Coast", isEligible: false, requiresSupportingDocs: false },
        { code: "CMR", name: "Cameroon", isEligible: false, requiresSupportingDocs: false },
        { code: "AGO", name: "Angola", isEligible: false, requiresSupportingDocs: false },
        { code: "MOZ", name: "Mozambique", isEligible: false, requiresSupportingDocs: false },
        { code: "MDG", name: "Madagascar", isEligible: false, requiresSupportingDocs: false },
        // Americas
        { code: "MEX", name: "Mexico", isEligible: false, requiresSupportingDocs: false },
        { code: "GTM", name: "Guatemala", isEligible: false, requiresSupportingDocs: false },
        { code: "BLZ", name: "Belize", isEligible: false, requiresSupportingDocs: false },
        { code: "HND", name: "Honduras", isEligible: false, requiresSupportingDocs: false },
        { code: "SLV", name: "El Salvador", isEligible: false, requiresSupportingDocs: false },
        { code: "NIC", name: "Nicaragua", isEligible: false, requiresSupportingDocs: false },
        { code: "CRI", name: "Costa Rica", isEligible: false, requiresSupportingDocs: false },
        { code: "PAN", name: "Panama", isEligible: false, requiresSupportingDocs: false },
        { code: "COL", name: "Colombia", isEligible: false, requiresSupportingDocs: false },
        { code: "VEN", name: "Venezuela", isEligible: false, requiresSupportingDocs: false },
        { code: "GUY", name: "Guyana", isEligible: false, requiresSupportingDocs: false },
        { code: "ECU", name: "Ecuador", isEligible: false, requiresSupportingDocs: false },
        { code: "PER", name: "Peru", isEligible: false, requiresSupportingDocs: false },
        { code: "BOL", name: "Bolivia", isEligible: false, requiresSupportingDocs: false },
        { code: "PRY", name: "Paraguay", isEligible: false, requiresSupportingDocs: false },
        { code: "URY", name: "Uruguay", isEligible: false, requiresSupportingDocs: false },
        { code: "CHL", name: "Chile", isEligible: false, requiresSupportingDocs: false },
        // Oceania & Others
        { code: "NZL", name: "New Zealand", isEligible: false, requiresSupportingDocs: false },
        { code: "PNG", name: "Papua New Guinea", isEligible: false, requiresSupportingDocs: false },
        { code: "WSM", name: "Samoa", isEligible: false, requiresSupportingDocs: false },
        { code: "TON", name: "Tonga", isEligible: false, requiresSupportingDocs: false },
        { code: "KIR", name: "Kiribati", isEligible: false, requiresSupportingDocs: false },
        { code: "TUV", name: "Tuvalu", isEligible: false, requiresSupportingDocs: false },
        { code: "NRU", name: "Nauru", isEligible: false, requiresSupportingDocs: false },
        { code: "PLW", name: "Palau", isEligible: false, requiresSupportingDocs: false },
        { code: "MHL", name: "Marshall Islands", isEligible: false, requiresSupportingDocs: false },
        { code: "FSM", name: "Micronesia", isEligible: false, requiresSupportingDocs: false },
        // Balkan Countries
        { code: "ALB", name: "Albania", isEligible: false, requiresSupportingDocs: false },
        { code: "MKD", name: "North Macedonia", isEligible: false, requiresSupportingDocs: false },
        { code: "SRB", name: "Serbia", isEligible: false, requiresSupportingDocs: false },
        { code: "BIH", name: "Bosnia and Herzegovina", isEligible: false, requiresSupportingDocs: false },
        { code: "MNE", name: "Montenegro", isEligible: false, requiresSupportingDocs: false },
        { code: "XKX", name: "Kosovo", isEligible: false, requiresSupportingDocs: false },
        // Caribbean & Central America
        { code: "CUB", name: "Cuba", isEligible: false, requiresSupportingDocs: false },
        { code: "TTO", name: "Trinidad and Tobago", isEligible: false, requiresSupportingDocs: false },
        { code: "GGY", name: "Guernsey", isEligible: false, requiresSupportingDocs: false },
        { code: "JEY", name: "Jersey", isEligible: false, requiresSupportingDocs: false },
        { code: "IMN", name: "Isle of Man", isEligible: false, requiresSupportingDocs: false },
        // Additional African Countries
        { code: "DJI", name: "Djibouti", isEligible: false, requiresSupportingDocs: false },
        { code: "ERI", name: "Eritrea", isEligible: false, requiresSupportingDocs: false },
        { code: "GMB", name: "Gambia", isEligible: false, requiresSupportingDocs: false },
        { code: "GIN", name: "Guinea", isEligible: false, requiresSupportingDocs: false },
        { code: "GNB", name: "Guinea-Bissau", isEligible: false, requiresSupportingDocs: false },
        { code: "LSO", name: "Lesotho", isEligible: false, requiresSupportingDocs: false },
        { code: "LBR", name: "Liberia", isEligible: false, requiresSupportingDocs: false },
        { code: "MLI", name: "Mali", isEligible: false, requiresSupportingDocs: false },
        { code: "MRT", name: "Mauritania", isEligible: false, requiresSupportingDocs: false },
        { code: "NER", name: "Niger", isEligible: false, requiresSupportingDocs: false },
        { code: "RWA", name: "Rwanda", isEligible: false, requiresSupportingDocs: false },
        { code: "STP", name: "Sao Tome and Principe", isEligible: false, requiresSupportingDocs: false },
        { code: "SLE", name: "Sierra Leone", isEligible: false, requiresSupportingDocs: false },
        { code: "SOM", name: "Somalia", isEligible: false, requiresSupportingDocs: false },
        { code: "SSD", name: "South Sudan", isEligible: false, requiresSupportingDocs: false },
        { code: "SDN", name: "Sudan", isEligible: false, requiresSupportingDocs: false },
        { code: "SWZ", name: "Eswatini", isEligible: false, requiresSupportingDocs: false },
        { code: "TGO", name: "Togo", isEligible: false, requiresSupportingDocs: false },
        { code: "TCD", name: "Chad", isEligible: false, requiresSupportingDocs: false },
        { code: "CAR", name: "Central African Republic", isEligible: false, requiresSupportingDocs: false },
        { code: "COD", name: "Democratic Republic of Congo", isEligible: false, requiresSupportingDocs: false },
        { code: "COG", name: "Republic of Congo", isEligible: false, requiresSupportingDocs: false },
        { code: "GAB", name: "Gabon", isEligible: false, requiresSupportingDocs: false },
        { code: "BFA", name: "Burkina Faso", isEligible: false, requiresSupportingDocs: false },
        { code: "BDI", name: "Burundi", isEligible: false, requiresSupportingDocs: false },
        { code: "COM", name: "Comoros", isEligible: false, requiresSupportingDocs: false },
        { code: "SYC", name: "Seychelles", isEligible: false, requiresSupportingDocs: false },
        { code: "MWI", name: "Malawi", isEligible: false, requiresSupportingDocs: false }
      ];
      for (const countryData of countriesData) {
        const existing = await storage.getCountryByCode(countryData.code);
        if (!existing) {
          console.log(`Adding new country: ${countryData.name} (${countryData.code})`);
          await storage.createCountry(countryData);
        } else {
          console.log(`Country already exists: ${countryData.name} (${countryData.code})`);
        }
      }
      const insuranceProducts2 = [
        {
          name: "7 Days Coverage",
          description: "Essential protection for short trips to Turkey",
          price: "114.00",
          coverage: {
            "Medical Emergency": "Up to $100,000",
            "Trip Cancellation": "Up to $10,000",
            "Lost Luggage": "Up to $1,000",
            "Duration": "7 days",
            "24/7 Support": "Available"
          },
          isPopular: false
        },
        {
          name: "14 Days Coverage",
          description: "Protection for two-week stays in Turkey",
          price: "131.00",
          coverage: {
            "Medical Emergency": "Up to $150,000",
            "Trip Cancellation": "Up to $15,000",
            "Lost Luggage": "Up to $1,500",
            "Duration": "14 days",
            "24/7 Support": "Available"
          },
          isPopular: true
        },
        {
          name: "30 Days Coverage",
          description: "Comprehensive protection for monthly stays",
          price: "154.00",
          coverage: {
            "Medical Emergency": "Up to $200,000",
            "Trip Cancellation": "Up to $20,000",
            "Lost Luggage": "Up to $2,000",
            "Duration": "30 days",
            "24/7 Support": "Available"
          },
          isPopular: false
        },
        {
          name: "60 Days Coverage",
          description: "Extended protection for longer stays",
          price: "191.00",
          coverage: {
            "Medical Emergency": "Up to $300,000",
            "Trip Cancellation": "Up to $30,000",
            "Lost Luggage": "Up to $3,000",
            "Duration": "60 days",
            "24/7 Support": "Available"
          },
          isPopular: false
        },
        {
          name: "90 Days Coverage",
          description: "Long-term protection for extended stays",
          price: "214.00",
          coverage: {
            "Medical Emergency": "Up to $400,000",
            "Trip Cancellation": "Up to $40,000",
            "Lost Luggage": "Up to $4,000",
            "Duration": "90 days",
            "24/7 Support": "Available"
          },
          isPopular: false
        },
        {
          name: "180 Days Coverage",
          description: "Long-term protection for extended stays",
          price: "275.00",
          coverage: {
            "Medical Emergency": "Up to $500,000",
            "Trip Cancellation": "Up to $50,000",
            "Lost Luggage": "Up to $5,000",
            "Duration": "180 days",
            "24/7 Support": "Available"
          },
          isPopular: false
        },
        {
          name: "1 Year Coverage",
          description: "Complete protection for annual stays",
          price: "315.00",
          coverage: {
            "Medical Emergency": "Up to $1,000,000",
            "Trip Cancellation": "Up to $100,000",
            "Lost Luggage": "Up to $10,000",
            "Duration": "1 year",
            "Adventure Sports": "Covered",
            "24/7 Support": "Available"
          },
          isPopular: false
        }
      ];
      const existingProducts = await storage.getInsuranceProducts();
      if (existingProducts.length === 0) {
        for (const productData of insuranceProducts2) {
          try {
            await storage.createInsuranceProduct(productData);
          } catch (error) {
          }
        }
      }
      res.json({ message: "Seed data created successfully" });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ message: "Failed to seed data" });
    }
  });
  app2.get("/api/admin/applications", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const search = req.query.search || "";
      const { applications: applications2, totalCount } = await storage.getApplicationsPaginated(page, limit, search);
      const totalPages = Math.ceil(totalCount / limit);
      res.json({
        applications: applications2,
        totalCount,
        currentPage: page,
        totalPages,
        hasMore: page < totalPages
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  app2.get("/api/admin/insurance-applications", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const search = req.query.search || "";
      const { applications: applications2, totalCount } = await storage.getInsuranceApplicationsPaginated(page, limit, search);
      const totalPages = Math.ceil(totalCount / limit);
      res.json({
        applications: applications2,
        totalCount,
        currentPage: page,
        totalPages,
        hasMore: page < totalPages
      });
    } catch (error) {
      console.error("Error fetching insurance applications:", error);
      res.status(500).json({ message: "Failed to fetch insurance applications" });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    try {
      const [visaStats, insuranceStats] = await Promise.all([
        storage.getApplicationsStats(),
        storage.getInsuranceApplicationsStats()
      ]);
      const stats = {
        totalApplications: visaStats.totalCount,
        totalInsuranceApplications: insuranceStats.totalCount,
        totalRevenue: visaStats.totalRevenue + insuranceStats.totalRevenue,
        pendingApplications: visaStats.pendingCount + insuranceStats.pendingCount
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.patch("/api/admin/applications/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, pdfAttachment } = req.body;
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      await storage.updateApplicationStatus(parseInt(id), status);
      if (pdfAttachment) {
        await storage.updateApplicationPdf(parseInt(id), pdfAttachment);
      }
      const application = await storage.getApplication(parseInt(id));
      if (application) {
        try {
          if (status === "approved") {
            const finalPdfAttachment = pdfAttachment || application.pdfAttachment;
            const emailContent = generateVisaApprovalEmail(
              application.firstName,
              application.lastName,
              application.applicationNumber,
              finalPdfAttachment
            );
            const emailOptions = {
              to: application.email,
              subject: emailContent.subject,
              html: emailContent.html,
              text: emailContent.text
            };
            if (finalPdfAttachment) {
              try {
                let cleanBase64 = finalPdfAttachment.replace(/^data:application\/pdf;base64,/, "");
                cleanBase64 = cleanBase64.replace(/\s/g, "");
                if (cleanBase64.length > 0 && cleanBase64.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
                  Buffer.from(cleanBase64, "base64");
                  emailOptions.attachments = [{
                    content: cleanBase64,
                    filename: `e-visa-${application.applicationNumber}.pdf`,
                    type: "application/pdf",
                    disposition: "attachment"
                  }];
                } else {
                  console.error("\u274C Invalid base64 PDF format for visa attachment");
                }
              } catch (base64Error) {
                console.error("\u274C Error processing visa PDF attachment:", base64Error);
              }
            }
            await sendEmail(emailOptions);
            console.log(`Visa approval email sent to ${application.email}`);
            console.log(`PDF attachment included: ${finalPdfAttachment ? "Yes" : "No"}`);
          } else if (status === "rejected") {
            await sendEmail({
              to: application.email,
              from: "info@getvisa.tr",
              subject: `[${application.applicationNumber}] Turkey E-Visa Application Update`,
              html: `
                <h2>Turkey E-Visa Application Update</h2>
                <p>Dear ${application.firstName} ${application.lastName},</p>
                <p>Your e-visa application ${application.applicationNumber} requires additional review.</p>
                <p>Best regards,<br>Turkey E-Visa Team</p>
              `,
              text: `Your Turkey E-Visa application ${application.applicationNumber} requires additional review.`,
              attachments: []
            });
            console.log(`Visa status email sent to ${application.email}`);
          }
        } catch (emailError) {
          console.error("Failed to send visa status email:", emailError);
        }
      }
      res.json({ message: "Application status updated successfully" });
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  });
  app2.patch("/api/admin/insurance-applications/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, pdfAttachment } = req.body;
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const application = await storage.getInsuranceApplicationById(parseInt(id));
      if (!application) {
        return res.status(404).json({ message: "Insurance application not found" });
      }
      await storage.updateInsuranceApplicationStatus(parseInt(id), status);
      if (pdfAttachment) {
        await storage.updateInsuranceApplicationPdf(parseInt(id), pdfAttachment);
      }
      if (status === "approved") {
        try {
          const product = application.productId ? await storage.getInsuranceProduct(application.productId) : null;
          const productName = product ? product.name : "Travel Insurance";
          const finalPdfAttachment = pdfAttachment || application.pdfAttachment;
          const emailContent = generateInsuranceApprovalEmail(
            application.firstName,
            application.lastName,
            application.applicationNumber,
            productName,
            finalPdfAttachment || void 0
          );
          const emailOptions = {
            to: application.email,
            from: "info@euramedglobal.com",
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
          };
          if (finalPdfAttachment) {
            try {
              let cleanBase64 = finalPdfAttachment.replace(/^data:application\/pdf;base64,/, "");
              cleanBase64 = cleanBase64.replace(/\s/g, "");
              if (cleanBase64.length > 0 && cleanBase64.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
                Buffer.from(cleanBase64, "base64");
                emailOptions.attachments = [{
                  content: cleanBase64,
                  filename: `insurance-policy-${application.applicationNumber}.pdf`,
                  type: "application/pdf",
                  disposition: "attachment"
                }];
              } else {
                console.error("\u274C Invalid base64 PDF format for insurance attachment");
              }
            } catch (base64Error) {
              console.error("\u274C Error processing insurance PDF attachment:", base64Error);
            }
          }
          await sendEmail(emailOptions);
          console.log(`Insurance approval email sent to ${application.email}`);
          console.log(`PDF attachment included: ${finalPdfAttachment ? "Yes" : "No"}`);
          console.log(`Insurance approval email sent to ${application.email}`);
        } catch (emailError) {
          console.error("Failed to send insurance approval email:", emailError);
        }
      } else if (status === "rejected") {
        try {
          const product = application.productId ? await storage.getInsuranceProduct(application.productId) : null;
          const productName = product ? product.name : "Travel Insurance";
          const emailContent = generateInsuranceApprovalEmail(
            application.firstName,
            application.lastName,
            application.applicationNumber,
            productName
          );
          const rejectionEmailContent = {
            subject: `[${application.applicationNumber}] Turkey Travel Insurance Application Status`,
            html: emailContent.html.replace("approved", "declined").replace("APPROVED", "DECLINED"),
            text: emailContent.text.replace("approved", "declined").replace("APPROVED", "DECLINED")
          };
          await sendEmail({
            to: application.email,
            from: "info@euramedglobal.com",
            subject: rejectionEmailContent.subject,
            html: rejectionEmailContent.html,
            text: rejectionEmailContent.text,
            attachments: []
          });
          console.log(`Insurance rejection email sent to ${application.email}`);
        } catch (emailError) {
          console.error("Failed to send insurance rejection email:", emailError);
        }
      }
      res.json({ message: "Insurance application status updated successfully" });
    } catch (error) {
      console.error("Error updating insurance application status:", error);
      res.status(500).json({ message: "Failed to update insurance application status" });
    }
  });
  app2.get("/api/download/visa/:applicationNumber", async (req, res) => {
    try {
      const { applicationNumber } = req.params;
      console.log(`Attempting to download PDF for visa application: ${applicationNumber}`);
      const applications2 = await storage.getApplications();
      console.log(`Found ${applications2.length} total applications`);
      const application = applications2.find((app3) => app3.applicationNumber === applicationNumber);
      console.log(`Application found:`, !!application);
      if (!application) {
        console.log(`Application ${applicationNumber} not found`);
        return res.status(404).json({ message: "Application not found" });
      }
      console.log(`Application status: ${application.status}, has PDF: ${!!application.pdfAttachment}`);
      if (application.status !== "approved" || !application.pdfAttachment) {
        console.log(`Document not available for ${applicationNumber}`);
        return res.status(404).json({ message: "Document not available" });
      }
      const base64Data = application.pdfAttachment.replace(/^data:application\/pdf;base64,/, "");
      const pdfBuffer = Buffer.from(base64Data, "base64");
      console.log(`Sending PDF for ${applicationNumber}, size: ${pdfBuffer.length} bytes`);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="evisa-${applicationNumber}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error downloading visa PDF:", error);
      res.status(500).json({ message: "Failed to download document" });
    }
  });
  app2.get("/api/download/insurance/:applicationNumber", async (req, res) => {
    try {
      const { applicationNumber } = req.params;
      const applications2 = await storage.getInsuranceApplications();
      const application = applications2.find((app3) => app3.applicationNumber === applicationNumber);
      if (!application) {
        return res.status(404).json({ message: "Insurance application not found" });
      }
      if (application.status !== "approved" || !application.pdfAttachment) {
        return res.status(404).json({ message: "Document not available" });
      }
      const base64Data = application.pdfAttachment.replace(/^data:application\/pdf;base64,/, "");
      const pdfBuffer = Buffer.from(base64Data, "base64");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="insurance-policy-${applicationNumber}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error downloading insurance PDF:", error);
      res.status(500).json({ message: "Failed to download document" });
    }
  });
  app2.post("/api/payment/update-status", async (req, res) => {
    try {
      const { orderRef, paymentStatus, xref } = req.body;
      if (!orderRef) {
        return res.status(400).json({ message: "Order reference is required" });
      }
      console.log("[Payment Status Update]", { orderRef, paymentStatus, xref });
      const applications2 = await storage.getApplications();
      const application = applications2.find(
        (app3) => app3.applicationNumber === orderRef || app3.orderRef === orderRef
      );
      if (application) {
        await storage.updateApplicationPaymentStatus(
          application.applicationNumber,
          paymentStatus === "success" ? "succeeded" : "failed"
        );
        if (paymentStatus === "success") {
          const emailData = generateVisaReceivedEmail(
            application.firstName,
            application.lastName,
            application.applicationNumber,
            application
          );
          await sendEmail({
            to: application.email,
            from: "info@getvisa.tr",
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text
          });
          await sendAdminCopyEmail(
            emailData.subject,
            application.email,
            "visa",
            emailData.html
          );
        }
        return res.json({ success: true, message: "Payment status updated" });
      }
      const insuranceApps = await storage.getInsuranceApplications();
      const insuranceApp = insuranceApps.find(
        (app3) => app3.applicationNumber === orderRef || app3.orderRef === orderRef
      );
      if (insuranceApp) {
        await storage.updateInsuranceApplicationPaymentStatus(
          insuranceApp.applicationNumber,
          paymentStatus === "success" ? "succeeded" : "failed"
        );
        if (paymentStatus === "success") {
          const emailData = generateInsuranceReceivedEmail(
            insuranceApp.firstName,
            insuranceApp.lastName,
            insuranceApp.applicationNumber,
            insuranceApp.productName || "Travel Insurance",
            insuranceApp
          );
          await sendEmail({
            to: insuranceApp.email,
            from: "info@getvisa.tr",
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text
          });
          await sendAdminCopyEmail(
            emailData.subject,
            insuranceApp.email,
            "insurance",
            emailData.html
          );
        }
        return res.json({ success: true, message: "Insurance payment status updated" });
      }
      return res.status(404).json({ message: "Application not found" });
    } catch (error) {
      console.error("[Payment Status Update Error]", error);
      return res.status(500).json({ message: "Failed to update payment status" });
    }
  });
  app2.post("/api/send-test-email", async (req, res) => {
    try {
      const { to, firstName, lastName, applicationNumber, emailType } = req.body;
      if (!to || !firstName || !lastName || !applicationNumber || !emailType) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      let emailData;
      if (emailType === "visa_received") {
        const mockApplicationData = {
          passportNumber: "A12345678",
          dateOfBirth: "1990-01-01",
          countryOfOrigin: "United States",
          arrivalDate: "2025-09-01",
          processingType: "standard",
          totalAmount: "119.00",
          supportingDocumentType: "residence",
          supportingDocumentCountry: "DEU",
          supportingDocumentNumber: "123456789",
          supportingDocumentStartDate: "2023-01-01",
          supportingDocumentEndDate: "2025-12-31"
        };
        emailData = generateVisaReceivedEmail(
          firstName,
          lastName,
          applicationNumber,
          mockApplicationData
        );
      } else if (emailType === "visa_approval") {
        emailData = generateVisaApprovalEmail(
          firstName,
          lastName,
          applicationNumber
        );
      } else if (emailType === "visa_rejection") {
        emailData = generateVisaRejectionEmail(
          firstName,
          lastName,
          applicationNumber,
          "Test rejection message from EURAMED LTD system"
        );
      } else {
        return res.status(400).json({ message: "Invalid email type" });
      }
      await sendEmail({
        to,
        from: "info@getvisa.tr",
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      });
      res.json({
        message: `${emailType} email sent successfully to ${to}`,
        subject: emailData.subject
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({
        message: "Failed to send test email",
        error: error.message
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/paytriot/paytriotClient.ts
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// server/utils/sign.ts
import crypto from "crypto";
function phpUrlEncode(str) {
  return encodeURIComponent(str).replace(/%20/g, "+").replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/~/g, "%7E");
}
function buildRequestSignature(fields, secret) {
  const copy = { ...fields };
  delete copy.signature;
  const pairs = Object.keys(copy).sort((a, b) => a.localeCompare(b)).map((k) => {
    const v = copy[k];
    if (v === void 0 || v === null || v === "") return null;
    return `${phpUrlEncode(k)}=${phpUrlEncode(String(v))}`;
  }).filter(Boolean);
  const message = pairs.join("&").replace(/%0D%0A/g, "%0A").replace(/%0A%0D/g, "%0A").replace(/%0D/g, "%0A") + secret;
  return crypto.createHash("sha512").update(message, "utf8").digest("hex").toLowerCase();
}
function buildResponseSignature(fields, secret) {
  const copy = { ...fields };
  delete copy.signature;
  const pairs = Object.keys(copy).sort((a, b) => a.localeCompare(b)).map((k) => {
    const v = copy[k];
    if (v === void 0 || v === null || v === "") return null;
    return `${phpUrlEncode(k)}=${phpUrlEncode(String(v))}`;
  }).filter(Boolean);
  const message = pairs.join("&").replace(/%0D%0A/g, "%0A").replace(/%0A%0D/g, "%0A").replace(/%0D/g, "%0A") + secret;
  return crypto.createHash("sha512").update(message, "utf8").digest("hex").toLowerCase();
}
function sign(fields, secret) {
  return buildRequestSignature(fields, secret);
}
function verifySignature(fields, secret, receivedSignature) {
  const expected = buildResponseSignature(fields, secret);
  return expected === String(receivedSignature || "").toLowerCase();
}
var signResponse = buildResponseSignature;

// server/utils/form.ts
function phpUrlEncode2(str) {
  return encodeURIComponent(str).replace(/%20/g, "+").replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/~/g, "%7E");
}
function toFormUrlEncoded(obj) {
  const pairs = [];
  const sortedKeys = Object.keys(obj).sort();
  for (const key of sortedKeys) {
    const value = obj[key];
    if (value !== void 0 && value !== null && value !== "") {
      pairs.push(`${phpUrlEncode2(key)}=${phpUrlEncode2(String(value))}`);
    }
  }
  return pairs.join("&");
}
function fromFormUrlEncoded(str) {
  const obj = {};
  if (!str) return obj;
  const pairs = str.split("&");
  for (const pair of pairs) {
    if (!pair) continue;
    const eq2 = pair.indexOf("=");
    const rawKey = eq2 >= 0 ? pair.slice(0, eq2) : pair;
    const rawVal = eq2 >= 0 ? pair.slice(eq2 + 1) : "";
    const key = decodeURIComponent(rawKey.replace(/\+/g, " "));
    const value = decodeURIComponent(rawVal.replace(/\+/g, " "));
    obj[key] = value;
  }
  return obj;
}

// server/paytriot/paytriotClient.ts
var PaytriotClient = class {
  gatewayUrl;
  merchantId;
  signatureKey;
  countryCode;
  currencyCode;
  timeout;
  termUrl;
  constructor() {
    this.gatewayUrl = "https://gateway.paytriot.co.uk/direct/";
    this.merchantId = "281927";
    this.signatureKey = "TempKey123Paytriot";
    this.countryCode = "826";
    this.currencyCode = "840";
    this.timeout = 3e4;
    const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : "http://localhost:5000";
    this.termUrl = `${baseUrl}/api/paytriot/3ds-callback`;
    console.log("[Paytriot] Gateway initialized");
    console.log("[Paytriot] 3DS TermUrl:", this.termUrl);
  }
  async sale(payload) {
    const {
      amountMinor,
      cardNumber,
      cardExpiryMonth,
      cardExpiryYear,
      cardCVV,
      orderRef,
      transactionUnique,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerPostCode,
      customerIPAddress,
      statementNarrative1,
      statementNarrative2,
      threeDSMD,
      threeDSPaRes
    } = payload;
    if (!amountMinor || typeof amountMinor !== "number" || amountMinor <= 0) {
      throw new Error("Invalid amountMinor: must be a positive number");
    }
    if (!customerIPAddress) {
      throw new Error("customerIPAddress is required");
    }
    const sanitizedOrderRef = (orderRef || `ORD${Date.now()}${uuidv4().slice(0, 8)}`).replace(/[^a-zA-Z0-9]/g, "");
    const sanitizedTransactionUnique = (transactionUnique || uuidv4()).replace(/[^a-zA-Z0-9]/g, "");
    const fields = {
      merchantID: this.merchantId,
      action: "SALE",
      type: "1",
      countryCode: this.countryCode,
      currencyCode: this.currencyCode,
      amount: String(amountMinor),
      orderRef: sanitizedOrderRef,
      transactionUnique: sanitizedTransactionUnique,
      customerIPAddress,
      threeDSRequired: "Y"
    };
    if (!threeDSMD && !threeDSPaRes) {
      fields.cardNumber = cardNumber;
      const paddedMonth = cardExpiryMonth.padStart(2, "0");
      const expiryYear = cardExpiryYear ? cardExpiryYear.slice(-2) : "";
      fields.cardExpiryDate = `${paddedMonth}${expiryYear}`;
      fields.cardCVV = cardCVV;
    }
    if (customerName?.trim()) fields.customerName = customerName.trim();
    if (customerEmail?.trim()) fields.customerEmail = customerEmail.trim();
    if (customerPhone?.trim()) fields.customerPhone = customerPhone.trim();
    if (customerAddress?.trim()) fields.customerAddress = customerAddress.trim();
    if (customerPostCode?.trim()) fields.customerPostCode = customerPostCode.trim();
    if (statementNarrative1?.trim()) fields.statementNarrative1 = statementNarrative1.trim();
    if (statementNarrative2?.trim()) fields.statementNarrative2 = statementNarrative2.trim();
    if (threeDSMD) fields.threeDSMD = threeDSMD;
    if (threeDSPaRes) fields.threeDSPaRes = threeDSPaRes;
    const signature = sign(fields, this.signatureKey);
    fields.signature = signature;
    const maskedFields = { ...fields };
    if (maskedFields.cardNumber) {
      maskedFields.cardNumber = `****${maskedFields.cardNumber.slice(-4)}`;
    }
    if (maskedFields.cardCVV) {
      maskedFields.cardCVV = "***";
    }
    console.log("[Paytriot] \u{1F510} REQUEST DETAILS:");
    console.log("[Paytriot] Gateway URL:", this.gatewayUrl);
    console.log("[Paytriot] Customer IP:", customerIPAddress);
    console.log("[Paytriot] Request fields (masked):", JSON.stringify(maskedFields, null, 2));
    console.log("[Paytriot] Calculated signature:", signature);
    const formBody = toFormUrlEncoded(fields);
    try {
      const response = await axios.post(this.gatewayUrl, formBody, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "text/html,application/x-www-form-urlencoded",
          "User-Agent": "PaytriotClient/1.0"
        },
        timeout: this.timeout,
        validateStatus: () => true
        // Accept all status codes
      });
      console.log("[Paytriot] \u{1F4E5} RESPONSE DETAILS:");
      console.log(
        "[Paytriot] HTTP Status:",
        response.status,
        response.statusText
      );
      console.log(
        "[Paytriot] Response headers:",
        response.headers
      );
      const responseText = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      console.log(
        "[Paytriot] Raw response (first 1000 chars):",
        responseText.substring(0, 1e3)
      );
      if (response.status !== 200) {
        console.error(`[Paytriot] \u26A0\uFE0F Non-200 HTTP status: ${response.status}`);
        console.error(`[Paytriot] Response body:`, responseText);
      }
      let responseData;
      try {
        responseData = typeof response.data === "object" ? response.data : JSON.parse(responseText);
      } catch (e) {
        responseData = fromFormUrlEncoded(responseText);
      }
      console.log(
        "[Paytriot] Response data:",
        JSON.stringify(responseData, null, 2)
      );
      if (responseData["Internal Worker Error"] !== void 0 || responseData["error"] !== void 0) {
        const errorMessage = responseData["Internal Worker Error"] || responseData["error"] || "Unknown proxy error";
        console.error("[Paytriot] Proxy/Worker error detected:", errorMessage);
        throw new Error(
          `Payment gateway error: ${errorMessage || "Proxy internal error"}`
        );
      }
      const receivedSignature = responseData.signature;
      const responseCode = parseInt(responseData.responseCode, 10);
      if (receivedSignature && responseCode === 0) {
        const computedSignature = signResponse(responseData, this.signatureKey);
        console.log("[Paytriot] Received signature:", receivedSignature);
        console.log("[Paytriot] Computed signature:", computedSignature);
        if (!verifySignature(responseData, this.signatureKey, receivedSignature)) {
          console.error("[Paytriot] Signature verification failed!");
          console.error(
            "[Paytriot] Response fields:",
            Object.keys(responseData)
          );
          throw new Error("Response signature verification failed");
        }
        console.log("[Paytriot] \u2705 Signature verification passed");
      } else {
        console.log(
          `[Paytriot] \u26A0\uFE0F Skipping signature verification (responseCode: ${responseCode})`
        );
      }
      return this.normalizeResponse(responseData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          throw new Error("Request timeout");
        }
        console.error("[Paytriot] Axios error:", error.message);
        if (error.response) {
          console.error("[Paytriot] Error response status:", error.response.status);
          console.error("[Paytriot] Error response data:", error.response.data);
        }
      }
      throw error;
    }
  }
  normalizeResponse(responseData) {
    const responseCode = parseInt(responseData.responseCode, 10);
    if (responseCode === 0) {
      return {
        status: "success",
        xref: responseData.xref,
        authorisationCode: responseData.authorisationCode,
        amountReceived: responseData.amountReceived,
        responseMessage: responseData.responseMessage || "Payment successful"
      };
    }
    const hasAcs = !!(responseData.threeDSACSURL && responseData.threeDSMD && responseData.threeDSPaReq);
    if (responseCode === 65802 && hasAcs) {
      return {
        status: "3ds_required",
        acsUrl: responseData.threeDSACSURL,
        md: responseData.threeDSMD,
        paReq: responseData.threeDSPaReq,
        termUrl: this.termUrl
      };
    }
    if (responseCode === 65796 && hasAcs) {
      return {
        status: "3ds_required",
        acsUrl: responseData.threeDSACSURL,
        md: responseData.threeDSMD,
        paReq: responseData.threeDSPaReq,
        termUrl: this.termUrl
      };
    }
    return {
      status: "error",
      code: responseCode,
      message: this.getUserFriendlyError(responseData) || "3-D Secure required but ACS details were not provided."
    };
  }
  getUserFriendlyError(responseData) {
    const responseCode = parseInt(responseData.responseCode, 10);
    const acquirerCode = responseData.acquirerResponseCode;
    const acquirerMessage = responseData.acquirerResponseMessage || "";
    const payriotErrors = {
      65539: "Invalid merchant credentials",
      65541: "Transaction not allowed in current state",
      65542: "Card details mismatch - please try again",
      65544: "Invalid payment information",
      65545: "Merchant account suspended - contact support",
      65546: "Currency not supported",
      65548: "System error - please try again",
      65554: "Duplicate transaction detected",
      65561: "Card type not supported",
      65566: "Test card used on live system",
      65567: "Card issuing country not supported",
      65796: "3-D Secure is required for this card (no ACS details returned)",
      65794: "3-D Secure unavailable on merchant account",
      65792: "3-D Secure transaction in progress"
    };
    const acquirerErrors = {
      "01": "Please contact your bank for authorization",
      "02": "Please contact your bank for authorization",
      "04": "Card declined - please use another card",
      "05": "Card declined by bank - please use another card",
      "12": "Invalid transaction - please check card details",
      "13": "Invalid amount - please check payment amount",
      "14": "Invalid card number - please check your card",
      "15": "Invalid card issuer",
      "25": "Cannot process at this time - please try again later",
      "30": "Format error - please try again",
      "41": "Lost card - please contact your bank",
      "43": "Stolen card - please contact your bank",
      "51": "Insufficient funds - please check your balance",
      "54": "Card expired - please use a valid card",
      "55": "Incorrect PIN - please try again",
      "57": "Transaction not permitted for this card",
      "58": "Transaction not permitted - contact your bank",
      "61": "Exceeds withdrawal limit",
      "62": "Restricted card - contact your bank",
      "65": "Exceeds transaction limit",
      "75": "PIN entry attempts exceeded",
      "76": "Invalid account",
      "78": "Card not activated",
      "79": "Invalid card lifecycle state",
      "82": "Incorrect CVV - please check security code",
      "83": "Cannot verify PIN",
      "85": "Card OK but transaction declined",
      "91": "Bank system unavailable - please try again",
      "92": "Unable to route transaction",
      "93": "Transaction violation",
      "94": "Duplicate transaction",
      "96": "System error - please try again later"
    };
    if (payriotErrors[responseCode]) {
      return payriotErrors[responseCode];
    }
    if (acquirerCode && acquirerErrors[acquirerCode]) {
      return acquirerErrors[acquirerCode];
    }
    if (responseCode === 2) {
      return "Please contact your bank for authorization";
    }
    if (responseCode === 4) {
      return "Card declined - please use another card";
    }
    if (responseCode === 5) {
      return "Card declined by bank - please use another card";
    }
    if (responseCode === 30) {
      return acquirerMessage || "Payment failed - please try again";
    }
    return responseData.responseMessage || acquirerMessage || "Payment failed - please check your card details and try again";
  }
};

// server/utils/ip.ts
function getRealClientIP(req) {
  const cfConnecting = req.headers["cf-connecting-ip"];
  if (cfConnecting && typeof cfConnecting === "string") {
    return cfConnecting;
  }
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (xForwardedFor) {
    const forwardedIPs = typeof xForwardedFor === "string" ? xForwardedFor : xForwardedFor[0];
    const ips = forwardedIPs.split(",");
    const firstIp = ips[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }
  return req.ip || "0.0.0.0";
}

// server/paytriot/paytriotRoutes.ts
function registerPaytriotRoutes(app2) {
  const paytriotClient = new PaytriotClient();
  const tempTransactions = /* @__PURE__ */ new Map();
  app2.post("/api/paytriot/sale", async (req, res) => {
    let txKey;
    try {
      const {
        amountMinor,
        cardNumber,
        cardExpiryMonth,
        cardExpiryYear,
        cardCVV,
        orderRef,
        transactionUnique,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerPostCode,
        customerIPAddress: providedIP,
        statementNarrative1,
        statementNarrative2,
        returnUrl,
        errorUrl
      } = req.body;
      if (!amountMinor || typeof amountMinor !== "number" || amountMinor <= 0) {
        return res.status(400).json({
          status: "error",
          message: "Invalid amount: must be a positive number in minor units"
        });
      }
      if (!cardNumber || !cardExpiryMonth || !cardExpiryYear || !cardCVV) {
        return res.status(400).json({
          status: "error",
          message: "Missing card details"
        });
      }
      const customerIPAddress = providedIP || getRealClientIP(req);
      if (!customerIPAddress || customerIPAddress === "0.0.0.0") {
        console.warn(
          "[Paytriot] Warning: Could not determine customer IP address"
        );
      }
      const maskedCardNumber = cardNumber.slice(0, 6) + "****" + cardNumber.slice(-4);
      console.log("[Paytriot] Initiating sale:", {
        amountMinor,
        cardNumber: maskedCardNumber,
        orderRef,
        customerIP: customerIPAddress
      });
      const payload = {
        amountMinor,
        cardNumber,
        cardExpiryMonth,
        cardExpiryYear,
        cardCVV,
        orderRef,
        transactionUnique,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerPostCode,
        customerIPAddress,
        // ✅ Müşteri IP'si artık doğru şekilde gönderiliyor
        statementNarrative1,
        statementNarrative2
      };
      txKey = transactionUnique || `temp-${Date.now()}`;
      if (txKey) tempTransactions.set(txKey, payload);
      const result = await paytriotClient.sale(payload);
      console.log("[Paytriot] Sale result:", {
        status: result.status,
        xref: result.xref,
        orderRef
      });
      if (result.status === "success") {
        if (txKey) tempTransactions.delete(txKey);
        try {
          const base2 = `${req.protocol}://${req.get("host")}`;
          const resp = await fetch(`${base2}/api/payment/update-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderRef,
              // frontend'den gelen applicationNumber/orderRef
              paymentStatus: "success",
              xref: result.xref
            })
          });
          const data = await resp.json().catch(() => ({}));
          console.log("[Paytriot] update-status ->", resp.status, data);
        } catch (e) {
          console.warn("[Paytriot] update-status call failed:", e?.message || e);
        }
        const base = `${req.protocol}://${req.get("host")}`;
        const target = typeof returnUrl === "string" && returnUrl.length > 0 ? new URL(returnUrl, base) : new URL("/payment-success", base);
        if (target.origin === base) {
          if (result.xref) target.searchParams.set("xref", result.xref);
          if (orderRef) target.searchParams.set("orderRef", orderRef);
          return res.json(result);
        }
        console.log("[Paytriot] Direct success - purged card data from memory");
        return res.json(result);
      } else if (result.status === "3ds_required" && result.md) {
        const sanitizedPayload = {
          amountMinor: payload.amountMinor,
          cardNumber: "",
          // Will be empty for 3DS continuation
          cardExpiryMonth: "",
          cardExpiryYear: "",
          cardCVV: "",
          // CVV must never be stored
          orderRef: payload.orderRef,
          transactionUnique: payload.transactionUnique,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          customerAddress: payload.customerAddress,
          customerPostCode: payload.customerPostCode,
          customerIPAddress: payload.customerIPAddress,
          // ✅ IP adresi 3DS için de saklanıyor
          statementNarrative1: payload.statementNarrative1,
          statementNarrative2: payload.statementNarrative2
        };
        if (txKey) tempTransactions.delete(txKey);
        tempTransactions.set(result.md, sanitizedPayload);
        console.log(
          "[Paytriot] 3DS required - stored sanitized transaction (no card data) with MD:",
          result.md
        );
      } else {
        if (txKey) tempTransactions.delete(txKey);
        const base = `${req.protocol}://${req.get("host")}`;
        if (typeof errorUrl === "string" && errorUrl.length > 0) {
          const err = new URL(errorUrl, base);
          if (err.origin === base) {
            const msg = result.message || "Payment failed";
            err.searchParams.set("message", msg);
            if (orderRef) err.searchParams.set("orderRef", orderRef);
            return res.redirect(303, err.toString());
          }
        }
        return res.json(result);
        console.log("[Paytriot] Error occurred - purged card data from memory");
      }
      return res.json(result);
    } catch (error) {
      console.error("[Paytriot] Sale error:", error.message);
      if (txKey) {
        tempTransactions.delete(txKey);
        console.log(
          "[Paytriot] Exception occurred - purged card data from memory"
        );
      }
      return res.status(500).json({
        status: "error",
        message: error.message || "Payment processing failed"
      });
    }
  });
  app2.post("/api/paytriot/3ds-callback", async (req, res) => {
    try {
      const { MD, PaRes } = req.body;
      console.log("[Paytriot] 3DS callback received:", {
        MD: MD ? "present" : "missing",
        PaRes: PaRes ? "present" : "missing"
      });
      if (!MD || !PaRes) {
        return res.status(400).json({
          status: "error",
          message: "Missing 3DS authentication data"
        });
      }
      const originalTransaction = tempTransactions.get(MD);
      if (!originalTransaction) {
        return res.status(400).json({
          status: "error",
          message: "Transaction not found or expired"
        });
      }
      const payload = {
        ...originalTransaction,
        threeDSMD: MD,
        threeDSPaRes: PaRes
      };
      const result = await paytriotClient.sale(payload);
      tempTransactions.delete(MD);
      console.log("[Paytriot] 3DS completion result:", {
        status: result.status,
        xref: result.xref
      });
      if (result.status === "success") {
        if (originalTransaction.orderRef) {
          try {
            const updateResponse = await fetch(
              `${req.protocol}://${req.get("host")}/api/payment/update-status`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderRef: originalTransaction.orderRef,
                  paymentStatus: "success",
                  xref: result.xref
                })
              }
            );
            console.log(
              "[Paytriot] Payment status updated after 3DS:",
              await updateResponse.json()
            );
          } catch (err) {
            console.error("[Paytriot] Failed to update payment status:", err);
          }
        }
        return res.redirect(
          `/payment-success?xref=${result.xref}&orderRef=${originalTransaction.orderRef || ""}`
        );
      } else {
        if (originalTransaction.orderRef) {
          try {
            await fetch(
              `${req.protocol}://${req.get("host")}/api/payment/update-status`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderRef: originalTransaction.orderRef,
                  paymentStatus: "failed"
                })
              }
            );
          } catch (err) {
            console.error("[Paytriot] Failed to update payment status:", err);
          }
        }
        return res.redirect(
          `/payment-error?message=${encodeURIComponent(result.message || "Payment failed")}`
        );
      }
    } catch (error) {
      console.error("[Paytriot] 3DS callback error:", error.message);
      return res.redirect(
        `/payment-error?message=${encodeURIComponent("3DS authentication failed")}`
      );
    }
  });
  app2.post("/paytriot/callback", async (req, res) => {
    try {
      console.log("[Paytriot] Server callback received:", req.body);
      res.status(200).send("OK");
    } catch (error) {
      console.error("[Paytriot] Callback error:", error.message);
      res.status(500).send("Error");
    }
  });
  app2.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  console.log(
    "[Paytriot] Routes registered successfully - Using Cloudflare Worker proxy"
  );
}

// server/index.ts
var setupVite2;
var serveStatic2;
var log2;
log2 = console.log;
serveStatic2 = (app2) => {
  app2.use(express2.static("dist/public"));
};
if (process.env.NODE_ENV !== "production") {
  const viteModule = await init_vite().then(() => vite_exports);
  setupVite2 = viteModule.setupVite;
  serveStatic2 = viteModule.serveStatic;
  log2 = viteModule.log;
}
var app = express2();
app.set("trust proxy", true);
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: true, limit: "50mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  if (path3.startsWith("/api")) {
    console.log(`\u{1F50D} API REQUEST: ${req.method} ${path3}`);
    if (req.method === "POST") {
      console.log(`\u{1F50D} Headers:`, req.headers);
      console.log(
        `\u{1F50D} Body preview:`,
        JSON.stringify(req.body).substring(0, 100)
      );
    }
  }
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      if (log2) {
        log2(logLine);
      } else {
        console.log(logLine);
      }
    }
  });
  next();
});
(async () => {
  registerPaytriotRoutes(app);
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    if (setupVite2) {
      await setupVite2(app, server);
    }
  } else {
    if (serveStatic2) {
      serveStatic2(app);
    }
  }
  const port = 5e3;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      if (log2) {
        log2(`serving on port ${port}`);
      } else {
        console.log(`serving on port ${port}`);
      }
    }
  );
})();
