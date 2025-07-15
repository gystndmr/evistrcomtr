import { 
  countries, 
  applications, 
  insuranceProducts, 
  insuranceApplications,
  type Country, 
  type InsertCountry, 
  type Application, 
  type InsertApplication,
  type InsuranceProduct,
  type InsertInsuranceProduct,
  type InsuranceApplication,
  type InsertInsuranceApplication
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
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<void>;
  
  // Insurance operations
  getInsuranceProducts(): Promise<InsuranceProduct[]>;
  getInsuranceProduct(id: number): Promise<InsuranceProduct | undefined>;
  createInsuranceProduct(product: InsertInsuranceProduct): Promise<InsuranceProduct>;
  createInsuranceApplication(application: InsertInsuranceApplication): Promise<InsuranceApplication>;
  getInsuranceApplicationByNumber(applicationNumber: string): Promise<InsuranceApplication | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getCountries(): Promise<Country[]> {
    return await db.select().from(countries);
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
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationByNumber(applicationNumber: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.applicationNumber, applicationNumber));
    return application;
  }

  async createApplication(applicationData: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applications).values(applicationData).returning();
    return application;
  }

  async updateApplicationStatus(id: number, status: string): Promise<void> {
    await db.update(applications).set({ status, updatedAt: new Date() }).where(eq(applications.id, id));
  }

  async getInsuranceProducts(): Promise<InsuranceProduct[]> {
    return await db.select().from(insuranceProducts).orderBy(desc(insuranceProducts.isPopular));
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
    const [application] = await db.select().from(insuranceApplications).where(eq(insuranceApplications.applicationNumber, applicationNumber));
    return application;
  }
}

export const storage = new DatabaseStorage();
