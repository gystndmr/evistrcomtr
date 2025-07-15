import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
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
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  passportNumber: text("passport_number").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  arrivalDate: timestamp("arrival_date").notNull(),
  documentType: text("document_type").notNull(),
  processingType: text("processing_type").notNull().default("standard"),
  supportingDocuments: jsonb("supporting_documents"),
  status: text("status").notNull().default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
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
  travelDate: timestamp("travel_date").notNull(),
  returnDate: timestamp("return_date").notNull(),
  destination: text("destination").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
export const insertApplicationSchema = createInsertSchema(applications);
export const insertInsuranceProductSchema = createInsertSchema(insuranceProducts);
export const insertInsuranceApplicationSchema = createInsertSchema(insuranceApplications);

// Types
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsuranceProduct = typeof insuranceProducts.$inferSelect;
export type InsertInsuranceProduct = z.infer<typeof insertInsuranceProductSchema>;
export type InsuranceApplication = typeof insuranceApplications.$inferSelect;
export type InsertInsuranceApplication = z.infer<typeof insertInsuranceApplicationSchema>;
