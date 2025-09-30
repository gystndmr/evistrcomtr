import { 
  countries, 
  applications, 
  insuranceProducts, 
  insuranceApplications,
  chatMessages,
  type Country, 
  type InsertCountry, 
  type Application, 
  type InsertApplication,
  type InsuranceProduct,
  type InsertInsuranceProduct,
  type InsuranceApplication,
  type InsertInsuranceApplication,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, or, sql, count } from "drizzle-orm";

export interface IStorage {
  // Country operations
  getCountries(): Promise<Country[]>;
  getCountryByCode(code: string): Promise<Country | undefined>;
  getCountryById(id: number): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  
  // Application operations
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationByNumber(applicationNumber: string): Promise<Application | undefined>;
  getApplicationByOrderRef(orderRef: string): Promise<Application | undefined>;
  getApplications(): Promise<Application[]>;
  getApplicationsPaginated(page: number, limit: number, search: string): Promise<{ applications: Application[]; totalCount: number }>;
  getApplicationsStats(): Promise<{ totalCount: number; totalRevenue: number; pendingCount: number }>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;
  updateApplicationPaymentStatus(orderRef: string, paymentStatus: string): Promise<void>;
  updateApplicationPdf(id: number, pdfAttachment: string): Promise<void>;
  updateApplicationVisaType(id: number, visaType: string): Promise<Application | undefined>;
  
  // Insurance operations
  getInsuranceProducts(): Promise<InsuranceProduct[]>;
  getInsuranceProduct(id: number): Promise<InsuranceProduct | undefined>;
  createInsuranceProduct(product: InsertInsuranceProduct): Promise<InsuranceProduct>;
  createInsuranceApplication(application: InsertInsuranceApplication): Promise<InsuranceApplication>;
  getInsuranceApplicationByNumber(applicationNumber: string): Promise<InsuranceApplication | undefined>;
  getInsuranceApplicationByOrderRef(orderRef: string): Promise<InsuranceApplication | undefined>;
  getInsuranceApplications(): Promise<InsuranceApplication[]>;
  getInsuranceApplicationsPaginated(page: number, limit: number, search: string): Promise<{ applications: InsuranceApplication[]; totalCount: number }>;
  getInsuranceApplicationsStats(): Promise<{ totalCount: number; totalRevenue: number; pendingCount: number }>;
  getInsuranceApplicationById(id: number): Promise<InsuranceApplication | undefined>;
  updateInsuranceApplicationStatus(id: number, status: string): Promise<InsuranceApplication | undefined>;
  updateInsuranceApplicationPaymentStatus(orderRef: string, paymentStatus: string): Promise<void>;
  updateInsuranceApplicationPdf(id: number, pdfAttachment: string): Promise<void>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getAllChatMessages(): Promise<ChatMessage[]>;
  getChatMessages(): Promise<ChatMessage[]>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
  markChatMessagesRead(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ⚡ PERFORMANCE: Add memory cache for countries
  private countriesCache: Country[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getCountries(): Promise<Country[]> {
    // ⚡ Check cache first
    const now = Date.now();
    if (this.countriesCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      console.log(`🚀 Countries served from cache (${this.countriesCache.length} countries)`);
      return this.countriesCache;
    }

    try {
      console.log(`🔍 Loading countries from database...`);
      const results = await db.select().from(countries);
      
      // Create a Map to store unique countries by name
      const uniqueCountriesMap = new Map<string, typeof results[0]>();
      
      results.forEach(country => {
        const existing = uniqueCountriesMap.get(country.name);
        if (!existing) {
          // First occurrence of this country name
          uniqueCountriesMap.set(country.name, country);
        } else {
          // If duplicate exists, keep the one with longer code
          if (country.code.length > existing.code.length) {
            uniqueCountriesMap.set(country.name, country);
          }
        }
      });
      
      const uniqueCountries = Array.from(uniqueCountriesMap.values());
      
      // Map database fields to frontend-expected format  
      const formattedCountries = uniqueCountries.map(country => ({
        ...country,
        isEligible: Boolean(country.isEligible) // Keep isEligible field name for frontend consistency
      })) as any[];
      
      // ⚡ Cache the results
      this.countriesCache = formattedCountries;
      this.cacheTimestamp = now;
      console.log(`🚀 Countries cached (${formattedCountries.length} countries)`);
      
      return formattedCountries;
    } catch (error) {
      console.error('Database error in getCountries:', error);
      return this.countriesCache || []; // Return cache if available, empty array if not
    }
  }

  async getCountryByCode(code: string): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.code, code));
    return country;
  }

  async getCountryById(id: number): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.id, id));
    return country;
  }

  async createCountry(countryData: InsertCountry): Promise<Country> {
    const [country] = await db.insert(countries).values(countryData).returning();
    return country;
  }

  async getApplication(id: number): Promise<Application | undefined> {
    try {
      const [application] = await db.select().from(applications).where(eq(applications.id, id));
      return application;
    } catch (error) {
      console.error('Database error in getApplication:', error);
      return undefined;
    }
  }

  async getApplicationByNumber(applicationNumber: string): Promise<Application | undefined> {
    try {
      const [application] = await db.select().from(applications).where(eq(applications.applicationNumber, applicationNumber));
      return application;
    } catch (error) {
      console.error('Database error in getApplicationByNumber:', error);
      return undefined;
    }
  }

  async getApplicationByOrderRef(orderRef: string): Promise<Application | undefined> {
    try {
      const [application] = await db.select().from(applications).where(eq(applications.applicationNumber, orderRef));
      return application;
    } catch (error) {
      console.error('Database error in getApplicationByOrderRef:', error);
      return undefined;
    }
  }

  async getAllApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(desc(applications.createdAt));
  }

  async createApplication(applicationData: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applications).values(applicationData).returning();
    return application;
  }

  async getApplications(): Promise<Application[]> {
    try {
      const results = await db.select().from(applications).orderBy(desc(applications.createdAt)).limit(100);
      return results;
    } catch (error) {
      console.error('Database error in getApplications:', error);
      return [];
    }
  }

  async getApplicationsPaginated(page: number, limit: number, search: string): Promise<{ applications: Application[]; totalCount: number }> {
    try {
      const offset = (page - 1) * limit;
      
      let query = db.select().from(applications);
      let countQuery = db.select({ count: count() }).from(applications);
      
      if (search && search.trim()) {
        const searchPattern = `%${search}%`;
        const searchCondition = or(
          ilike(applications.firstName, searchPattern),
          ilike(applications.lastName, searchPattern),
          ilike(applications.email, searchPattern),
          ilike(applications.applicationNumber, searchPattern)
        );
        query = query.where(searchCondition);
        countQuery = countQuery.where(searchCondition);
      }
      
      const [results, countResult] = await Promise.all([
        query.orderBy(desc(applications.createdAt)).limit(limit).offset(offset),
        countQuery
      ]);
      
      const normalizedApplications = results.map(app => ({
        ...app,
        supportingDocumentType: app.supportingDocumentType || (app as any).supporting_document_type,
        supportingDocumentCountry: app.supportingDocumentCountry || (app as any).supporting_document_country,
        supportingDocumentNumber: app.supportingDocumentNumber || (app as any).supporting_document_number,
        supportingDocumentStartDate: app.supportingDocumentStartDate || (app as any).supporting_document_start_date,
        supportingDocumentEndDate: app.supportingDocumentEndDate || (app as any).supporting_document_end_date,
      }));
      
      return {
        applications: normalizedApplications,
        totalCount: (countResult[0]?.count as number) || 0
      };
    } catch (error) {
      console.error('Database error in getApplicationsPaginated:', error);
      return { applications: [], totalCount: 0 };
    }
  }

  async getApplicationsStats(): Promise<{ totalCount: number; totalRevenue: number; pendingCount: number }> {
    try {
      // Use PostgreSQL system statistics for fast approximate counts
      const [countResult, pendingResult] = await Promise.all([
        db.execute(sql`
          SELECT n_live_tup as count
          FROM pg_stat_user_tables 
          WHERE schemaname = 'public' AND relname = 'applications'
        `),
        db.select({ count: count() }).from(applications).where(eq(applications.status, 'pending'))
      ]);
      
      const totalCount = (countResult.rows[0] as any)?.count || 0;
      
      return {
        totalCount: Number(totalCount),
        totalRevenue: 0, // Skip revenue calculation for performance
        pendingCount: (pendingResult[0]?.count as number) || 0
      };
    } catch (error) {
      console.error('Database error in getApplicationsStats:', error);
      return { totalCount: 0, totalRevenue: 0, pendingCount: 0 };
    }
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const [updatedApp] = await db.update(applications).set({ status, updatedAt: new Date() }).where(eq(applications.id, id)).returning();
    return updatedApp;
  }

  async updateApplicationPaymentStatus(orderRef: string, paymentStatus: string): Promise<void> {
    try {
      await db.update(applications).set({ paymentStatus, updatedAt: new Date() }).where(eq(applications.applicationNumber, orderRef));
      console.log(`✅ Payment status updated for visa application ${orderRef}: ${paymentStatus}`);
    } catch (error) {
      console.error('Database error in updateApplicationPaymentStatus:', error);
    }
  }

  async getInsuranceProducts(): Promise<InsuranceProduct[]> {
    try {
      return await db.select().from(insuranceProducts).orderBy(desc(insuranceProducts.isPopular));
    } catch (error) {
      console.error('Database error in getInsuranceProducts:', error);
      return [];
    }
  }

  async getInsuranceProduct(id: number): Promise<InsuranceProduct | undefined> {
    const [product] = await db.select().from(insuranceProducts).where(eq(insuranceProducts.id, id));
    return product;
  }

  async createInsuranceProduct(productData: InsertInsuranceProduct): Promise<InsuranceProduct> {
    const [product] = await db.insert(insuranceProducts).values(productData).returning();
    return product;
  }

  async createInsuranceApplication(applicationData: InsertInsuranceApplication): Promise<InsuranceApplication> {
    const [application] = await db.insert(insuranceApplications).values(applicationData).returning();
    return application;
  }

  async getInsuranceApplicationByNumber(applicationNumber: string): Promise<InsuranceApplication | undefined> {
    try {
      const [application] = await db.select().from(insuranceApplications).where(eq(insuranceApplications.applicationNumber, applicationNumber));
      return application;
    } catch (error) {
      console.error('Database error in getInsuranceApplicationByNumber:', error);
      return undefined;
    }
  }

  async getInsuranceApplicationByOrderRef(orderRef: string): Promise<InsuranceApplication | undefined> {
    try {
      const [application] = await db.select().from(insuranceApplications).where(eq(insuranceApplications.applicationNumber, orderRef));
      return application;
    } catch (error) {
      console.error('Database error in getInsuranceApplicationByOrderRef:', error);
      return undefined;
    }
  }

  async getInsuranceApplications(): Promise<InsuranceApplication[]> {
    try {
      return await db.select().from(insuranceApplications).orderBy(desc(insuranceApplications.createdAt)).limit(100);
    } catch (error) {
      console.error('Database error in getInsuranceApplications:', error);
      return [];
    }
  }

  async getInsuranceApplicationsPaginated(page: number, limit: number, search: string): Promise<{ applications: InsuranceApplication[]; totalCount: number }> {
    try {
      const offset = (page - 1) * limit;
      
      let query = db.select().from(insuranceApplications);
      let countQuery = db.select({ count: count() }).from(insuranceApplications);
      
      if (search && search.trim()) {
        const searchPattern = `%${search}%`;
        const searchCondition = or(
          ilike(insuranceApplications.firstName, searchPattern),
          ilike(insuranceApplications.lastName, searchPattern),
          ilike(insuranceApplications.email, searchPattern),
          ilike(insuranceApplications.applicationNumber, searchPattern)
        );
        query = query.where(searchCondition);
        countQuery = countQuery.where(searchCondition);
      }
      
      const [results, countResult] = await Promise.all([
        query.orderBy(desc(insuranceApplications.createdAt)).limit(limit).offset(offset),
        countQuery
      ]);
      
      return {
        applications: results,
        totalCount: (countResult[0]?.count as number) || 0
      };
    } catch (error) {
      console.error('Database error in getInsuranceApplicationsPaginated:', error);
      return { applications: [], totalCount: 0 };
    }
  }

  async getInsuranceApplicationsStats(): Promise<{ totalCount: number; totalRevenue: number; pendingCount: number }> {
    try {
      // Use PostgreSQL system statistics for fast approximate counts
      const [countResult, pendingResult] = await Promise.all([
        db.execute(sql`
          SELECT n_live_tup as count
          FROM pg_stat_user_tables 
          WHERE schemaname = 'public' AND relname = 'insurance_applications'
        `),
        db.select({ count: count() }).from(insuranceApplications).where(eq(insuranceApplications.status, 'pending'))
      ]);
      
      const totalCount = (countResult.rows[0] as any)?.count || 0;
      
      return {
        totalCount: Number(totalCount),
        totalRevenue: 0, // Skip revenue calculation for performance
        pendingCount: (pendingResult[0]?.count as number) || 0
      };
    } catch (error) {
      console.error('Database error in getInsuranceApplicationsStats:', error);
      return { totalCount: 0, totalRevenue: 0, pendingCount: 0 };
    }
  }

  async getInsuranceApplicationById(id: number): Promise<InsuranceApplication | undefined> {
    try {
      const [application] = await db.select().from(insuranceApplications).where(eq(insuranceApplications.id, id));
      return application;
    } catch (error) {
      console.error('Database error in getInsuranceApplicationById:', error);
      return undefined;
    }
  }

  async updateInsuranceApplicationStatus(id: number, status: string): Promise<InsuranceApplication | undefined> {
    const [updatedApp] = await db.update(insuranceApplications).set({ status, updatedAt: new Date() }).where(eq(insuranceApplications.id, id)).returning();
    return updatedApp;
  }

  async updateInsuranceApplicationPaymentStatus(orderRef: string, paymentStatus: string): Promise<void> {
    try {
      await db.update(insuranceApplications).set({ paymentStatus, updatedAt: new Date() }).where(eq(insuranceApplications.applicationNumber, orderRef));
      console.log(`✅ Payment status updated for insurance application ${orderRef}: ${paymentStatus}`);
    } catch (error) {
      console.error('Database error in updateInsuranceApplicationPaymentStatus:', error);
    }
  }

  async updateApplicationPdf(id: number, pdfAttachment: string): Promise<void> {
    await db.update(applications).set({ pdfAttachment, updatedAt: new Date() }).where(eq(applications.id, id));
  }

  async updateApplicationVisaType(id: number, visaType: string): Promise<Application | undefined> {
    const [updatedApp] = await db.update(applications).set({ 
      supportingDocumentCountry: visaType, 
      updatedAt: new Date() 
    }).where(eq(applications.id, id)).returning();
    return updatedApp;
  }

  async updateInsuranceApplicationPdf(id: number, pdfAttachment: string): Promise<void> {
    await db.update(insuranceApplications).set({ pdfAttachment, updatedAt: new Date() }).where(eq(insuranceApplications.id, id));
  }

  // Chat operations
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const chatData = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    };
    const [created] = await db.insert(chatMessages).values(chatData).returning();
    return created;
  }

  async getAllChatMessages(): Promise<ChatMessage[]> {
    try {
      return db.select().from(chatMessages).orderBy(desc(chatMessages.timestamp));
    } catch (error) {
      console.error('Database error in getAllChatMessages:', error);
      return [];
    }
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    try {
      return db.select().from(chatMessages).orderBy(desc(chatMessages.timestamp));
    } catch (error) {
      console.error('Database error in getChatMessages:', error);
      return [];
    }
  }

  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return db.select().from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(desc(chatMessages.timestamp));
  }

  async markChatMessagesRead(sessionId: string): Promise<void> {
    await db.update(chatMessages)
      .set({ isRead: true })
      .where(eq(chatMessages.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
