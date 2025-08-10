import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema, insertInsuranceApplicationSchema } from "@shared/schema";
import { z } from "zod";
import { sendEmail, generateVisaReceivedEmail, generateInsuranceReceivedEmail, generateInsuranceApprovalEmail, generateVisaApprovalEmail } from "./email";
import { gPayService } from "./payment-simple";

function generateApplicationNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TR${timestamp}${random}`.toUpperCase();
}

// Generate unique order reference for GPay (includes timestamp)
function generateOrderReference(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TR${timestamp}${random}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all countries
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });

  // Get specific country by code
  app.get("/api/countries/:code", async (req, res) => {
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

  // Create visa application
  app.post("/api/applications", async (req, res) => {
    try {
      // Convert string dates to Date objects before validation
      const bodyWithDates = {
        ...req.body,
        applicationNumber: generateApplicationNumber(),
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
        arrivalDate: req.body.arrivalDate ? new Date(req.body.arrivalDate) : undefined,
        passportIssueDate: req.body.passportIssueDate ? new Date(req.body.passportIssueDate) : undefined,
        passportExpiryDate: req.body.passportExpiryDate ? new Date(req.body.passportExpiryDate) : undefined,
        supportingDocumentStartDate: req.body.supportingDocumentStartDate ? new Date(req.body.supportingDocumentStartDate) : undefined,
        supportingDocumentEndDate: req.body.supportingDocumentEndDate ? new Date(req.body.supportingDocumentEndDate) : undefined,
      };

      const validatedData = insertApplicationSchema.parse(bodyWithDates);

      const application = await storage.createApplication(validatedData);
      
      // E-posta gönderimi (vize başvuru alındı)
      try {
        const emailContent = generateVisaReceivedEmail(
          application.firstName, 
          application.lastName, 
          application.applicationNumber,
          application,
          'en'
        );
        
        await sendEmail({
          to: application.email,
          from: "info@getvisa.tr",
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });
        
        console.log(`Visa application received email sent to ${application.email}`);
      } catch (emailError) {
        console.error('Failed to send visa application received email:', emailError);
      }
      
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  // Get application by number
  app.get("/api/applications/:applicationNumber", async (req, res) => {
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

  // Get insurance products (both URLs for compatibility)
  app.get("/api/insurance-products", async (req, res) => {
    try {
      const products = await storage.getInsuranceProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching insurance products:", error);
      res.status(500).json({ message: "Failed to fetch insurance products" });
    }
  });
  
  app.get("/api/insurance/products", async (req, res) => {
    try {
      const products = await storage.getInsuranceProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching insurance products:", error);
      res.status(500).json({ message: "Failed to fetch insurance products" });
    }
  });

  // Create insurance application
  app.post("/api/insurance/applications", async (req, res) => {
    try {
      console.log("=== INSURANCE APPLICATION DEBUG ===");
      console.log("Raw dateOfBirth:", req.body.dateOfBirth, typeof req.body.dateOfBirth);
      console.log("Raw totalAmount:", req.body.totalAmount, typeof req.body.totalAmount);
      
      // Convert dates and amounts to proper format for schema validation
      const bodyWithDates = {
        ...req.body,
        applicationNumber: generateApplicationNumber(),
        destination: req.body.destination || "Turkey", // Default destination
        travelDate: req.body.travelDate ? new Date(req.body.travelDate) : undefined,
        returnDate: req.body.returnDate ? new Date(req.body.returnDate) : undefined,
        dateOfBirth: req.body.dateOfBirth, // Keep as string
        totalAmount: req.body.totalAmount, // Keep original value first
      };
      
      console.log("After processing - dateOfBirth:", bodyWithDates.dateOfBirth, typeof bodyWithDates.dateOfBirth);
      console.log("After processing - totalAmount:", bodyWithDates.totalAmount, typeof bodyWithDates.totalAmount);

      const validatedData = insertInsuranceApplicationSchema.parse(bodyWithDates);

      const application = await storage.createInsuranceApplication(validatedData);
      
      // E-posta gönderimi (sigorta başvuru alındı)
      try {
        // Sigorta ürün bilgisini al
        const product = application.productId ? await storage.getInsuranceProduct(application.productId) : null;
        const productName = product ? product.name : 'Travel Insurance';
        
        const { generateInsuranceReceivedEmail } = await import('./email-insurance');
        const emailContent = generateInsuranceReceivedEmail(
          application.firstName, 
          application.lastName, 
          application.applicationNumber,
          productName,
          application
        );
        
        await sendEmail({
          to: application.email,
          from: "info@getvisa.tr",
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
          attachments: []
        });
        
        console.log(`✅ Insurance application received email sent to ${application.email}`);
      } catch (emailError) {
        console.error('Failed to send insurance application received email:', emailError);
      }
      
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating insurance application:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create insurance application" });
    }
  });

  // Get insurance application by number
  app.get("/api/insurance/applications/:applicationNumber", async (req, res) => {
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

  // Seed initial data
  app.post("/api/seed", async (req, res) => {
    try {
      // Seed countries based on official Turkey e-visa eligibility
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
        { code: "MWI", name: "Malawi", isEligible: false, requiresSupportingDocs: false },



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

      // Seed insurance products with duration-based pricing
      const insuranceProducts = [
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

      // Check if insurance products exist, if not create them
      const existingProducts = await storage.getInsuranceProducts();
      if (existingProducts.length === 0) {
        for (const productData of insuranceProducts) {
          try {
            await storage.createInsuranceProduct(productData);
          } catch (error) {
            // Product might already exist, continue
          }
        }
      }

      res.json({ message: "Seed data created successfully" });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ message: "Failed to seed data" });
    }
  });

  // Admin routes with pagination
  app.get("/api/admin/applications", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = (req.query.search as string) || '';
      
      const allApplications = await storage.getApplications();
      
      // Ensure both snake_case and camelCase fields for frontend compatibility
      const normalizedApplications = allApplications.map(app => ({
        ...app,
        // Add camelCase versions if they don't exist
        supportingDocumentType: app.supportingDocumentType || (app as any).supporting_document_type,
        supportingDocumentCountry: app.supportingDocumentCountry || (app as any).supporting_document_country,
        supportingDocumentNumber: app.supportingDocumentNumber || (app as any).supporting_document_number,
        supportingDocumentStartDate: app.supportingDocumentStartDate || (app as any).supporting_document_start_date,
        supportingDocumentEndDate: app.supportingDocumentEndDate || (app as any).supporting_document_end_date,
        // Also keep snake_case versions for backward compatibility
        supporting_document_type: (app as any).supporting_document_type || app.supportingDocumentType,
        supporting_document_country: (app as any).supporting_document_country || app.supportingDocumentCountry,
        supporting_document_number: (app as any).supporting_document_number || app.supportingDocumentNumber,
        supporting_document_start_date: (app as any).supporting_document_start_date || app.supportingDocumentStartDate,
        supporting_document_end_date: (app as any).supporting_document_end_date || app.supportingDocumentEndDate
      }));
      
      // Filter by search term if provided
      let filteredApplications = normalizedApplications;
      if (search) {
        filteredApplications = normalizedApplications.filter(app => 
          app.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          app.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          app.email?.toLowerCase().includes(search.toLowerCase()) ||
          app.applicationNumber?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Pagination
      const totalCount = filteredApplications.length;
      const totalPages = Math.ceil(totalCount / limit);
      const offset = (page - 1) * limit;
      const applications = filteredApplications.slice(offset, offset + limit);
      
      res.json({
        applications,
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

  app.get("/api/admin/insurance-applications", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = (req.query.search as string) || '';
      
      const allApplications = await storage.getInsuranceApplications();
      
      // Filter by search term if provided
      let filteredApplications = allApplications;
      if (search) {
        filteredApplications = allApplications.filter(app => 
          app.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          app.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          app.email?.toLowerCase().includes(search.toLowerCase()) ||
          app.applicationNumber?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Pagination
      const totalCount = filteredApplications.length;
      const totalPages = Math.ceil(totalCount / limit);
      const offset = (page - 1) * limit;
      const applications = filteredApplications.slice(offset, offset + limit);
      
      res.json({
        applications,
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

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      const insuranceApplications = await storage.getInsuranceApplications();
      
      const stats = {
        totalApplications: applications.length,
        totalInsuranceApplications: insuranceApplications.length,
        totalRevenue: applications.reduce((sum: number, app: any) => sum + parseFloat(app.totalAmount), 0) + 
                     insuranceApplications.reduce((sum: number, app: any) => sum + parseFloat(app.totalAmount), 0),
        pendingApplications: applications.filter((app: any) => app.status === 'pending').length + 
                           insuranceApplications.filter((app: any) => app.status === 'pending').length
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Update application status with optional PDF attachment (admin)
  app.patch("/api/admin/applications/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, pdfAttachment } = req.body;
      
      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Update application status and PDF attachment if provided
      await storage.updateApplicationStatus(parseInt(id), status);
      
      if (pdfAttachment) {
        // Update PDF attachment
        await storage.updateApplicationPdf(parseInt(id), pdfAttachment);
      }
      
      // Durum değişikliğine göre e-posta gönder
      const application = await storage.getApplication(parseInt(id));
      if (application) {
        try {
          if (status === 'approved') {
            // Get PDF attachment from request body or existing application data
            const finalPdfAttachment = pdfAttachment || application.pdfAttachment;
            
            // Professional email template using generateVisaApprovalEmail
            const emailContent = generateVisaApprovalEmail(
              application.firstName,
              application.lastName,
              application.applicationNumber,
              finalPdfAttachment
            );
            
            const emailOptions: any = {
              to: application.email,
              from: "info@getvisa.tr",
              subject: emailContent.subject,
              html: emailContent.html,
              text: emailContent.text
            };
            
            // Add PDF attachment if available
            if (finalPdfAttachment) {
              try {
                // Clean and validate base64 PDF data
                let cleanBase64 = finalPdfAttachment.replace(/^data:application\/pdf;base64,/, '');
                cleanBase64 = cleanBase64.replace(/\s/g, ''); // Remove whitespace
                
                // Validate base64 format
                if (cleanBase64.length > 0 && cleanBase64.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
                  // Test decode
                  Buffer.from(cleanBase64, 'base64');
                  
                  emailOptions.attachments = [{
                    content: cleanBase64,
                    filename: `e-visa-${application.applicationNumber}.pdf`,
                    type: 'application/pdf',
                    disposition: 'attachment'
                  }];
                } else {
                  console.error('❌ Invalid base64 PDF format for visa attachment');
                }
              } catch (base64Error) {
                console.error('❌ Error processing visa PDF attachment:', base64Error);
              }
            }
            
            // PDF eklentisi varsa email gönder
            await sendEmail(emailOptions);
            console.log(`Visa approval email sent to ${application.email}`);
            console.log(`PDF attachment included: ${finalPdfAttachment ? 'Yes' : 'No'}`);
          } else if (status === 'rejected') {
            // Basit reddetme email template
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
          console.error('Failed to send visa status email:', emailError);
        }
      }
      
      res.json({ message: "Application status updated successfully" });
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  });

  // Update insurance application status with optional PDF attachment (admin)
  app.patch("/api/admin/insurance-applications/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, pdfAttachment } = req.body;
      
      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Sigorta için status güncelleme fonksiyonu storage'a eklenmeli
      const application = await storage.getInsuranceApplicationById(parseInt(id));
      if (!application) {
        return res.status(404).json({ message: "Insurance application not found" });
      }
      
      // Update insurance application status and PDF attachment if provided  
      await storage.updateInsuranceApplicationStatus(parseInt(id), status);
      
      if (pdfAttachment) {
        // Update PDF attachment  
        await storage.updateInsuranceApplicationPdf(parseInt(id), pdfAttachment);
      }
      
      // Durum değişikliğine göre e-posta gönder
      if (status === 'approved') {
        try {
          const product = application.productId ? await storage.getInsuranceProduct(application.productId) : null;
          const productName = product ? product.name : 'Travel Insurance';
          
          // Get PDF attachment from request body or existing application data
          const finalPdfAttachment = pdfAttachment || application.pdfAttachment;
          
          const emailContent = generateInsuranceApprovalEmail(
            application.firstName, 
            application.lastName, 
            application.applicationNumber,
            productName,
            finalPdfAttachment || undefined
          );
          
          const emailOptions: any = {
            to: application.email,
            from: "info@getvisa.tr",
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
          };
          
          // Add PDF attachment if available
          if (finalPdfAttachment) {
            try {
              // Clean and validate base64 PDF data
              let cleanBase64 = finalPdfAttachment.replace(/^data:application\/pdf;base64,/, '');
              cleanBase64 = cleanBase64.replace(/\s/g, ''); // Remove whitespace
              
              // Validate base64 format
              if (cleanBase64.length > 0 && cleanBase64.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
                // Test decode
                Buffer.from(cleanBase64, 'base64');
                
                emailOptions.attachments = [{
                  content: cleanBase64,
                  filename: `insurance-policy-${application.applicationNumber}.pdf`,
                  type: 'application/pdf',
                  disposition: 'attachment'
                }];
              } else {
                console.error('❌ Invalid base64 PDF format for insurance attachment');
              }
            } catch (base64Error) {
              console.error('❌ Error processing insurance PDF attachment:', base64Error);
            }
          }
          
          await sendEmail(emailOptions);
          console.log(`Insurance approval email sent to ${application.email}`);
          console.log(`PDF attachment included: ${finalPdfAttachment ? 'Yes' : 'No'}`);
          
          console.log(`Insurance approval email sent to ${application.email}`);
        } catch (emailError) {
          console.error('Failed to send insurance approval email:', emailError);
        }
      } else if (status === 'rejected') {
        try {
          const product = application.productId ? await storage.getInsuranceProduct(application.productId) : null;
          const productName = product ? product.name : 'Travel Insurance';
          
          // Reddedilmiş e-posta için geçici olarak normal approval fonksiyonu kullanacağım
          const emailContent = generateInsuranceApprovalEmail(
            application.firstName, 
            application.lastName, 
            application.applicationNumber,
            productName
          );
          
          // E-posta içeriğini reddedilmiş olarak değiştir
          const rejectionEmailContent = {
            subject: `[${application.applicationNumber}] Turkey Travel Insurance Application Status`,
            html: emailContent.html.replace('approved', 'declined').replace('APPROVED', 'DECLINED'),
            text: emailContent.text.replace('approved', 'declined').replace('APPROVED', 'DECLINED')
          };
          
          await sendEmail({
            to: application.email,
            from: "info@getvisa.tr",
            subject: rejectionEmailContent.subject,
            html: rejectionEmailContent.html,
            text: rejectionEmailContent.text,
            attachments: []
          });
          
          console.log(`Insurance rejection email sent to ${application.email}`);
        } catch (emailError) {
          console.error('Failed to send insurance rejection email:', emailError);
        }
      }
      
      res.json({ message: "Insurance application status updated successfully" });
    } catch (error) {
      console.error("Error updating insurance application status:", error);
      res.status(500).json({ message: "Failed to update insurance application status" });
    }
  });

  // PDF Download endpoints for approved applications
  app.get("/api/download/visa/:applicationNumber", async (req, res) => {
    try {
      const { applicationNumber } = req.params;
      console.log(`Attempting to download PDF for visa application: ${applicationNumber}`);
      
      // Find application by application number
      const applications = await storage.getApplications();
      console.log(`Found ${applications.length} total applications`);
      
      const application = applications.find(app => app.applicationNumber === applicationNumber);
      console.log(`Application found:`, !!application);
      
      if (!application) {
        console.log(`Application ${applicationNumber} not found`);
        return res.status(404).json({ message: "Application not found" });
      }
      
      console.log(`Application status: ${application.status}, has PDF: ${!!application.pdfAttachment}`);
      
      if (application.status !== 'approved' || !application.pdfAttachment) {
        console.log(`Document not available for ${applicationNumber}`);
        return res.status(404).json({ message: "Document not available" });
      }
      
      // Extract base64 data
      const base64Data = application.pdfAttachment.replace(/^data:application\/pdf;base64,/, '');
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      
      console.log(`Sending PDF for ${applicationNumber}, size: ${pdfBuffer.length} bytes`);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="evisa-${applicationNumber}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error downloading visa PDF:", error);
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  app.get("/api/download/insurance/:applicationNumber", async (req, res) => {
    try {
      const { applicationNumber } = req.params;
      
      // Find insurance application by application number
      const applications = await storage.getInsuranceApplications();
      const application = applications.find(app => app.applicationNumber === applicationNumber);
      
      if (!application) {
        return res.status(404).json({ message: "Insurance application not found" });
      }
      
      if (application.status !== 'approved' || !application.pdfAttachment) {
        return res.status(404).json({ message: "Document not available" });
      }
      
      // Extract base64 data
      const base64Data = application.pdfAttachment.replace(/^data:application\/pdf;base64,/, '');
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="insurance-policy-${applicationNumber}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error downloading insurance PDF:", error);
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  // GPay Payment Integration - New Implementation
  
  // Test GPay configuration
  app.get("/api/payment/test-config", async (req, res) => {
    try {
      const config = {
        hasPublicKey: !!(process.env.GPAY_PUBLIC_KEY),
        hasPrivateKey: !!(process.env.GPAY_PRIVATE_KEY),
        hasMerchantId: !!(process.env.GPAY_MERCHANT_ID),
        merchantId: process.env.GPAY_MERCHANT_ID || "Not set",
        baseUrl: (process.env.NODE_ENV === 'production' || process.env.GPAY_MERCHANT_ID === '1100002537')
          ? "https://getvisa.gpayprocessing.com" 
          : "https://payment-sandbox.gpayprocessing.com",
        environment: process.env.NODE_ENV || "development"
      };
      
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Configuration check failed" });
    }
  });

  // Test signature generation with Baris Topal's working example format
  app.post("/api/payment/test-signature", async (req, res) => {
    try {
      // Use Baris Topal's exact working example data structure + mandatory customerIp
      const testData = {
        amount: "5489.75",
        billingCountry: "AD",
        billingEmail: "hasantopal0234@gmail.com",
        billingFirstName: "Baris Hasan",
        billingLastName: "Topal",
        billingStreet1: "abc",
        billingStreet2: "",
        brandName: "",
        callbackUrl: "https://localhost:7092/Odeme/GPayResult",
        cancelUrl: "https://localhost:7092/Odeme/GPayResult",
        colorMode: "default-mode",
        currency: "TRY",
        customerIp: "127.0.0.1", // MANDATORY field from specification
        errorUrl: "https://localhost:7092/Odeme/GPayResult",
        feeBySeller: "50",
        logoSource: "",
        merchantId: "1100000026",
        metadata: "{\"key\":\"value\"}",
        notificationUrl: "https://localhost:7092/Odeme/GPayResult",
        orderDescription: "VIZE BAŞVURU",
        orderRef: "d9750380-282d-48a3-928d-f65df184cb5f",
        paymentMethod: "ALL",
        transactionDocuments: "{\"key\":\"value\"}"
      };

      console.log('=== BARIS TOPAL EXACT EXAMPLE TEST ===');
      console.log('Test data before signature:', JSON.stringify(testData, null, 2));

      // Generate signature using our implementation
      const signature = gPayService.generateSignature(testData);

      console.log('Generated signature:', signature);
      console.log('Expected signature from Baris:', 'Pq+xaOykMkFyhUEATfTWmEv/odq3wbwMArqi0UGMYhwjw6C0Gk76nT+32g2dNtmrbB6I/u/6OokPmhJxdNtFfs9yBC6RwkXK4KF+qvCYa3QNUvdve1PvJiDpk+3krIlMCnFpa1c3e0+L+IybvuGzIa/59uU1m1RLLnjRmX8m35Inuv2MYCKCyCsSwU3Y22Nf5811ihYQHYid1++6L1p8yCeBzXAJijMnc7G5E7r+5RXX0QdMWor7Bv+D8+etZxto++/LNIcJNeywj2TO6QnxpoCYAJEuoE9AYdQYruiaAnVIQfNwZ8z5iTKKb6e5SqIZo3INrUyZlOIlY0Tx/i2ZQi4+qHOtp0i/ErtbsZZ3NlfC44WsDFlc7T8NENsjCdHzoODZfO8pbHxeLb4KHllj8WNMaKgg2C9dhRiX1+XNY6ET5JJgkSYk1USNfCW2sx5E/4qKBTCPMoLFjZELa72FsiASmVMbT8qYE3ltI5KkDaBBkqk2M3bDkLIuQ5DVe5MXaRy2ipsQqzw1y4Aa0ngL/6pBHtpOZ9zpHb41nedRHy6O+vjlVTem6UuQUgCuDFk9Hote6W/qJIqYa3/DGAW02/porOTv6B0ujjNuiuK/4pOI1EavbTu8UbtU2VQUBIAIelHTh5TNQEbi+cmSCqYmW2/RvUMglr1U07pKzYmW3Ic=');
      
      // Now test with GPay API directly
      console.log('=== TESTING WITH GPAY API ===');
      try {
        const apiResponse = await gPayService.createPayment({
          orderRef: testData.orderRef,
          amount: parseFloat(testData.amount),
          currency: testData.currency,
          orderDescription: testData.orderDescription,
          cancelUrl: testData.cancelUrl,
          callbackUrl: testData.callbackUrl,
          notificationUrl: testData.notificationUrl,
          errorUrl: testData.errorUrl,
          paymentMethod: testData.paymentMethod,
          feeBySeller: parseInt(testData.feeBySeller),
          customerIp: testData.customerIp, // Mandatory field
          merchantId: testData.merchantId
        });
        
        console.log('=== GPay API Response ===');
        console.log('API Response:', JSON.stringify(apiResponse, null, 2));
        console.log('=== End GPay API Response ===');
        
      } catch (apiError: any) {
        console.error('=== GPay API Error ===');
        console.error('Error details:', apiError);
        console.error('Error message:', apiError?.message);
        console.error('Error stack:', apiError?.stack);
        console.error('=== End GPay API Error ===');
      }
      
      console.log('=== END BARIS TOPAL TEST ===');

      res.json({
        requestUrl: "https://payment-sandbox.gpayprocessing.com/v1/checkout",
        httpMethod: "POST",
        contentType: "application/x-www-form-urlencoded",
        jsonPayloadForSignature: JSON.stringify(testData),
        signature: signature,
        expectedSignature: 'Pq+xaOykMkFyhUEATfTWmEv/odq3wbwMArqi0UGMYhwjw6C0Gk76nT+32g2dNtmrbB6I/u/6OokPmhJxdNtFfs9yBC6RwkXK4KF+qvCYa3QNUvdve1PvJiDpk+3krIlMCnFpa1c3e0+L+IybvuGzIa/59uU1m1RLLnjRmX8m35Inuv2MYCKCyCsSwU3Y22Nf5811ihYQHYid1++6L1p8yCeBzXAJijMnc7G5E7r+5RXX0QdMWor7Bv+D8+etZxto++/LNIcJNeywj2TO6QnxpoCYAJEuoE9AYdQYruiaAnVIQfNwZ8z5iTKKb6e5SqIZo3INrUyZlOIlY0Tx/i2ZQi4+qHOtp0i/ErtbsZZ3NlfC44WsDFlc7T8NENsjCdHzoODZfO8pbHxeLb4KHllj8WNMaKgg2C9dhRiX1+XNY6ET5JJgkSYk1USNfCW2sx5E/4qKBTCPMoLFjZELa72FsiASmVMbT8qYE3ltI5KkDaBBkqk2M3bDkLIuQ5DVe5MXaRy2ipsQqzw1y4Aa0ngL/6pBHtpOZ9zpHb41nedRHy6O+vjlVTem6UuQUgCuDFk9Hote6W/qJIqYa3/DGAW02/porOTv6B0ujjNuiuK/4pOI1EavbTu8UbtU2VQUBIAIelHTh5TNQEbi+cmSCqYmW2/RvUMglr1U07pKzYmW3Ic=',
        formDataParameters: testData,
        sortedKeys: Object.keys(testData).sort(),
        merchantId: "1100000026",
        signatureAlgorithm: "md5WithRSAEncryption"
      });
    } catch (error: any) {
      console.error('Test signature error:', error);
      res.status(500).json({ error: "Signature test failed: " + error?.message });
    }
  });
  
  // Create payment - following PHP merchant example with enhanced billing fields
  app.post("/api/payment/create", async (req, res) => {
    try {
      const { 
        orderRef, 
        orderId, // Support both orderRef and orderId
        amount, 
        currency = "USD", 
        orderDescription, 
        description // Support both orderDescription and description
      } = req.body;
      
      // Use orderRef or orderId (support both) - if none provided, generate one
      const finalOrderRef = orderRef || orderId || generateOrderReference();
      const finalDescription = orderDescription || description;

      // Always use production domain for GPay callbacks - required for GPay registration
      const baseUrl = 'https://getvisa.tr';
      
      // Get real customer IP - check multiple headers for proxy environments
      const getCustomerIp = () => {
        return req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || 
               req.headers['x-real-ip']?.toString() || 
               req.connection?.remoteAddress || 
               req.socket?.remoteAddress ||
               req.ip || 
               "85.34.78.112"; // Use a realistic Turkish IP as fallback instead of localhost
      };

      // Enhanced payment request with comprehensive billing fields following PHP example
      const paymentRequest = {
        orderRef: finalOrderRef, // Use the original order reference without VIS prefix
        amount: amount, // Keep as number, not string
        currency: "USD", // Fixed currency
        orderDescription: finalDescription || `Turkey E-Visa Application Payment`,
        cancelUrl: `${baseUrl}/payment/cancel`,
        callbackUrl: `${baseUrl}/api/payment/callback`,
        notificationUrl: `${baseUrl}/api/payment/callback`,
        errorUrl: `${baseUrl}/payment/cancel`,
        paymentMethod: "ALL", // Allow all payment methods
        feeBySeller: 50, // 50% fee by seller
        
        // No billing fields - GPay will handle all billing requirements internally
        
        customerIp: getCustomerIp(), // Use real customer IP
        merchantId: "" // Will be set from environment
      };

      const response = await gPayService.createPayment(paymentRequest);
      
      if (response.success) {
        res.json({
          success: true,
          paymentUrl: response.paymentUrl,
          transactionId: response.transactionId
          // Removed formData - use GET redirect as documented working method
        });
      } else {
        // GPay hata mesajını direkt göster
        res.json({
          success: false,
          error: response.error,
          paymentUrl: response.paymentUrl || `${baseUrl}/payment-cancel?error=${encodeURIComponent(response.error || 'Unknown payment error')}`
        });
      }
      
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Payment service error" 
      });
    }
  });

  // GPay callback handler
  app.post("/api/payment/callback", async (req, res) => {
    try {
      const { payload } = req.body;
      
      if (!payload) {
        console.log("GPay callback: Missing payload");
        return res.status(400).json({ message: "Missing payload" });
      }

      // Parse callback payload
      const paymentData = gPayService.parseCallback(payload);
      
      if (!paymentData) {
        console.log("GPay callback: Invalid payload format");
        return res.status(400).json({ message: "Invalid payload format" });
      }

      console.log("GPay callback received:", paymentData);
      
      // Verify signature if present
      if (paymentData.signature) {
        const isValidSignature = gPayService.verifySignature(paymentData);
        if (!isValidSignature) {
          console.log("GPay callback: Invalid signature");
          return res.status(400).json({ message: "Invalid signature" });
        }
      }

      const { status, transactionId, amount, orderRef } = paymentData;
      
      // Update application status based on payment result
      if (status === 'completed' || status === 'successful' || status === 'approved') {
        console.log(`✅ Payment successful for order ${orderRef}: ${transactionId}`);
        // TODO: Update application status to payment completed
        // await storage.updateApplicationPaymentStatus(orderRef, 'completed', amount);
      } else if (status === 'failed' || status === 'error' || status === 'declined') {
        console.log(`❌ Payment failed for order ${orderRef}: ${transactionId}`);
        // TODO: Update application status to payment failed
        // await storage.updateApplicationPaymentStatus(orderRef, 'failed', amount);
      }
      
      res.json({ message: "OK" });
      
    } catch (error) {
      console.error("GPay callback error:", error);
      res.status(500).json({ message: "Callback processing error" });
    }
  });

  // Payment success page handler
  app.get("/payment/success", async (req, res) => {
    try {
      const { payload } = req.query;
      
      if (!payload) {
        return res.redirect(`/payment-success?payment=error&message=Missing payment data`);
      }

      const paymentData = gPayService.parseCallback(payload as string);
      
      if (!paymentData) {
        return res.redirect(`/payment-success?payment=error&message=Invalid payment data`);
      }

      console.log("Payment success callback:", paymentData);
      
      const { status, transactionId, orderRef } = paymentData;
      
      if (status === 'completed' || status === 'successful' || status === 'approved') {
        res.redirect(`/payment-success?payment=success&transaction=${transactionId}&order=${orderRef}`);
      } else {
        res.redirect(`/payment-success?payment=error&transaction=${transactionId}&order=${orderRef}`);
      }
      
    } catch (error) {
      console.error("Payment success callback error:", error);
      res.redirect(`/payment-success?payment=error&message=Processing error`);
    }
  });

  // Payment cancel page handler
  app.get("/payment/cancel", async (req, res) => {
    try {
      const { payload } = req.query;
      
      if (!payload) {
        return res.redirect(`/payment-success?payment=cancelled&message=Payment cancelled`);
      }

      const paymentData = gPayService.parseCallback(payload as string);
      
      if (!paymentData) {
        return res.redirect(`/payment-success?payment=cancelled&message=Payment cancelled`);
      }

      console.log("Payment cancel callback:", paymentData);
      
      const { transactionId, orderRef } = paymentData;
      
      res.redirect(`/payment-success?payment=cancelled&transaction=${transactionId}&order=${orderRef}`);
      
    } catch (error) {
      console.error("Payment cancel callback error:", error);
      res.redirect(`/payment-success?payment=cancelled&message=Payment cancelled`);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
