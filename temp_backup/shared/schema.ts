import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  flag: text("flag"),
  isEligible: boolean("is_eligible").notNull().default(false),
  requiresSupportingDocs: boolean("requires_supporting_docs").notNull().default(false),
  supportedDocumentTypes: text("supported_document_types").array(),
  visaFee: decimal("visa_fee", { precision: 10, scale: 2 }).default("60.00"),
  maxStayDays: integer("max_stay_days").default(30),
  validityDays: integer("validity_days").default(180),
  multipleEntry: boolean("multiple_entry").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  applicationNumber: text("application_number").notNull().unique(),
  countryId: integer("country_id").references(() => countries.id),
  countryOfOrigin: text("country_of_origin"), // Hangi ülkeden başvurdu
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  passportNumber: text("passport_number").notNull(),
  passportIssueDate: timestamp("passport_issue_date"), // Pasaport veriliş tarihi
  passportExpiryDate: timestamp("passport_expiry_date"), // Pasaport geçerlilik tarihi
  dateOfBirth: timestamp("date_of_birth").notNull(),
  placeOfBirth: text("place_of_birth"), // Doğum yeri
  motherName: text("mother_name"), // Anne adı
  fatherName: text("father_name"), // Baba adı
  address: text("address"), // Adres bilgisi
  arrivalDate: timestamp("arrival_date").notNull(),
  documentType: text("document_type").notNull(),
  processingType: text("processing_type").notNull().default("standard"),
  supportingDocuments: jsonb("supporting_documents"),
  supportingDocumentType: text("supporting_document_type"), // Seçilen destekleyici belge türü
  supportingDocumentCountry: text("supporting_document_country"), // Spesifik visa ülkesi (IRL, SCHENGEN, USA, GBR)
  supportingDocumentNumber: text("supporting_document_number"), // Destekleyici belge numarası
  supportingDocumentStartDate: timestamp("supporting_document_start_date"), // Destekleyici belge başlangıç tarihi
  supportingDocumentEndDate: timestamp("supporting_document_end_date"), // Destekleyici belge bitiş tarihi
  status: text("status").notNull().default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  pdfAttachment: text("pdf_attachment"), // For admin uploaded PDF files
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insuranceProducts = pgTable("insurance_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  coverage: jsonb("coverage").notNull(),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insuranceApplications = pgTable("insurance_applications", {
  id: serial("id").primaryKey(),
  applicationNumber: text("application_number").notNull().unique(),
  productId: integer("product_id").references(() => insuranceProducts.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  passportNumber: text("passport_number"),
  countryOfOrigin: text("country_of_origin"), // Müşterinin hangi ülkeden başvuru yaptığı
  travelDate: timestamp("travel_date").notNull(),
  returnDate: timestamp("return_date").notNull(),
  destination: text("destination").notNull(),
  tripDurationDays: integer("trip_duration_days"), // Kaç günlük seçti
  dateOfBirth: text("date_of_birth"), // Doğum tarihi (yaş hesabı için)
  parentIdPhotos: jsonb("parent_id_photos"), // 18 yaş altı için ebeveyn kimlik fotoğrafları
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  status: text("status").notNull().default("pending"),
  pdfAttachment: text("pdf_attachment"), // For admin uploaded PDF files
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }),
  message: text("message").notNull(),
  sender: varchar("sender", { length: 10 }).notNull(), // 'user' or 'agent'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

// Relations
export const countriesRelations = relations(countries, ({ many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  country: one(countries, {
    fields: [applications.countryId],
    references: [countries.id],
  }),
}));

export const insuranceProductsRelations = relations(insuranceProducts, ({ many }) => ({
  applications: many(insuranceApplications),
}));

export const insuranceApplicationsRelations = relations(insuranceApplications, ({ one }) => ({
  product: one(insuranceProducts, {
    fields: [insuranceApplications.productId],
    references: [insuranceProducts.id],
  }),
}));

// Zod schemas
export const insertCountrySchema = createInsertSchema(countries);
export const insertApplicationSchema = createInsertSchema(applications).extend({
  // Make totalAmount optional since it's calculated on the backend based on processing type
  totalAmount: z.string().optional(),
});
export const insertInsuranceProductSchema = createInsertSchema(insuranceProducts);
export const insertInsuranceApplicationSchema = createInsertSchema(insuranceApplications).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  pdfAttachment: true
});

export const insertChatMessageSchema = createInsertSchema(chatMessages);

// Types
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsuranceProduct = typeof insuranceProducts.$inferSelect;
export type InsertInsuranceProduct = z.infer<typeof insertInsuranceProductSchema>;
export type InsuranceApplication = typeof insuranceApplications.$inferSelect;
export type InsertInsuranceApplication = z.infer<typeof insertInsuranceApplicationSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
