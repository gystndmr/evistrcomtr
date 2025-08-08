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
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Country operations
  getCountries(): Promise<Country[]>;
  getCountryByCode(code: string): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  
  // Application operations
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationByNumber(applicationNumber: string): Promise<Application | undefined>;
  getApplications(): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;
  updateApplicationPdf(id: number, pdfAttachment: string): Promise<void>;
  updateApplicationVisaType(id: number, visaType: string): Promise<Application | undefined>;
  
  // Insurance operations
  getInsuranceProducts(): Promise<InsuranceProduct[]>;
  getInsuranceProduct(id: number): Promise<InsuranceProduct | undefined>;
  createInsuranceProduct(product: InsertInsuranceProduct): Promise<InsuranceProduct>;
  createInsuranceApplication(application: InsertInsuranceApplication): Promise<InsuranceApplication>;
  getInsuranceApplicationByNumber(applicationNumber: string): Promise<InsuranceApplication | undefined>;
  getInsuranceApplications(): Promise<InsuranceApplication[]>;
  getInsuranceApplicationById(id: number): Promise<InsuranceApplication | undefined>;
  updateInsuranceApplicationStatus(id: number, status: string): Promise<InsuranceApplication | undefined>;
  updateInsuranceApplicationPdf(id: number, pdfAttachment: string): Promise<void>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(): Promise<ChatMessage[]>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
  markChatMessagesRead(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCountries(): Promise<Country[]> {
    try {
      return await db.select().from(countries);
    } catch (error) {
      console.error('Database error in getCountries:', error);
      return [];
    }
  }

  async getCountryByCode(code: string): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.code, code));
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

  async getAllApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(desc(applications.createdAt));
  }

  async createApplication(applicationData: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applications).values(applicationData).returning();
    return application;
  }

  async getApplications(): Promise<Application[]> {
    try {
      const results = await db.select().from(applications).orderBy(desc(applications.createdAt));
      
      // DEBUG: Test başvurusunu kontrol et
      const testApp = results.find(app => app.applicationNumber === 'TRME2M3FUQ3LU8CW');
      if (testApp) {
        console.log('🔧 DEBUG Storage Test Application:', {
          applicationNumber: testApp.applicationNumber,
          supportingDocumentType: testApp.supportingDocumentType,
          supportingDocumentCountry: testApp.supportingDocumentCountry,
          keys: Object.keys(testApp)
        });
      }
      
      return results;
    } catch (error) {
      console.error('Database error in getApplications:', error);
      return [];
    }
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const [updatedApp] = await db.update(applications).set({ status, updatedAt: new Date() }).where(eq(applications.id, id)).returning();
    return updatedApp;
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

  async getInsuranceApplications(): Promise<InsuranceApplication[]> {
    try {
      return await db.select().from(insuranceApplications).orderBy(desc(insuranceApplications.createdAt));
    } catch (error) {
      console.error('Database error in getInsuranceApplications:', error);
      return [];
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
