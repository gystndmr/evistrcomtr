import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema, insertInsuranceApplicationSchema } from "@shared/schema";
import { z } from "zod";
import { sendEmail, sendAdminCopyEmail, generateVisaReceivedEmail, generateInsuranceReceivedEmail, generateInsuranceApprovalEmail, generateVisaApprovalEmail, generateVisaRejectionEmail } from "./email";
import { registerPaytriotRoutes } from "./paytriot/paytriotRoutes";

function generateApplicationNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TR${timestamp}${random}`.toUpperCase();
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

      // Parse initial data WITHOUT totalAmount (will calculate after scenario normalization)
      const validatedData = insertApplicationSchema.parse({
        ...bodyWithDates,
        totalAmount: "0" // Temporary value, will be recalculated after scenario normalization
      });

      // BACKEND SCENARIO VALIDATION - Enforce scenario rules
      try {
        if (!validatedData.countryId) {
          return res.status(400).json({ message: "Country ID is required" });
        }

        const country = await storage.getCountryById(validatedData.countryId);
        if (!country) {
          return res.status(400).json({ message: "Invalid country ID" });
        }

        // Calculate effective scenario (includes Egypt age-based logic)
        let effectiveScenario = country.scenario;
        
        // Egypt special case: age-based scenario determination
        if (country.code === 'EGY' && validatedData.dateOfBirth) {
          const age = Math.floor((Date.now() - validatedData.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          // Age 15-45: Scenario 2 (supporting docs required)
          // Under 15 or over 45: Scenario 1 (no supporting docs)
          effectiveScenario = (age >= 15 && age <= 45) ? 2 : 1;
          console.log(`Egypt age-based scenario: age=${age}, scenario=${effectiveScenario}`);
        }
        
        // For Scenario 1 countries (no supporting docs required), clear supporting document fields
        if (effectiveScenario === 1) {
          validatedData.supportingDocumentType = undefined;
          validatedData.supportingDocumentNumber = undefined;
          validatedData.supportingDocumentStartDate = undefined;
          validatedData.supportingDocumentEndDate = undefined;
          validatedData.supportingDocumentCountry = undefined;
          // KEEP USER'S SELECTED PROCESSING TYPE - Do not override to "standard"
          // validatedData.processingType = "standard"; // REMOVED - was causing all emails to show $155
        }
        
        // Validate scenario rules
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
        
        // Check supporting document requirements
        const hasSupportingDocument = req.body.supportingDocumentType && req.body.supportingDocumentType !== '';
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
        
        console.log(`✅ Scenario validation passed: Country=${country.code}, Scenario=${effectiveScenario}, HasSupporting=${hasSupporting}`);
        
        // CALCULATE TOTAL AMOUNT AFTER SCENARIO NORMALIZATION
        // Processing types (matching frontend exactly)
        const processingTypes = {
          'slow': 90,      // Ready in 7 days
          'standard': 155, // Ready in 4 days  
          'fast': 205,     // Ready in 2 days
          'urgent_24': 320, // Ready in 24 hours
          'urgent_12': 370, // Ready in 12 hours
          'urgent_4': 450,  // Ready in 4 hours
          'urgent_1': 685   // Ready in 1 hour
        };
        
        // Use NORMALIZED data for pricing calculation
        const finalHasSupporting = validatedData.supportingDocumentType && validatedData.supportingDocumentType !== '';
        const finalProcessingType = validatedData.processingType || 'slow';
        
        let calculatedTotalAmount = 90; // Default fallback
        
        const eVisaFee = 69; // Base e-visa application fee (same as frontend)
        const processingFee = processingTypes[finalProcessingType as keyof typeof processingTypes] || 90;
        
        // All applications: processing fee + e-visa fee (same calculation regardless of supporting docs)
        calculatedTotalAmount = processingFee + eVisaFee;
        
        // Update the validated data with correct total amount
        validatedData.totalAmount = calculatedTotalAmount.toString();
        
        console.log(`💰 Final pricing calculation: ProcessingType=${finalProcessingType}, HasSupporting=${finalHasSupporting}, TotalAmount=$${calculatedTotalAmount}`);
        
      } catch (validationError) {
        console.error("Scenario validation error:", validationError);
        return res.status(500).json({ message: "Failed to validate application requirements" });
      }

      const application = await storage.createApplication(validatedData);
      
      // Email will be sent after successful payment confirmation
      
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  // Get all applications for admin panel
  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
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

  // Get all insurance applications for admin panel
  app.get("/api/insurance-applications", async (req, res) => {
    try {
      const applications = await storage.getInsuranceApplications();
      res.json(applications);
    } catch (error: any) {
      console.error("Error fetching insurance applications:", error);
      res.status(500).json({ message: "Failed to fetch insurance applications" });
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
      
      // Email will be sent after successful payment confirmation
      
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
      
      const { applications, totalCount } = await storage.getApplicationsPaginated(page, limit, search);
      
      const totalPages = Math.ceil(totalCount / limit);
      
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
      
      const { applications, totalCount } = await storage.getInsuranceApplicationsPaginated(page, limit, search);
      
      const totalPages = Math.ceil(totalCount / limit);
      
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
            from: "info@euramedglobal.com",
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
            from: "info@euramedglobal.com",
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

  // Paytriot Payment Callback - Update payment status in database
  app.post("/api/payment/update-status", async (req, res) => {
    try {
      const { orderRef, paymentStatus, xref } = req.body;

      if (!orderRef) {
        return res.status(400).json({ message: "Order reference is required" });
      }

      console.log('[Payment Status Update]', { orderRef, paymentStatus, xref });

      // Find and update application by orderRef
      const applications = await storage.getApplications();
      const application = applications.find(app => 
        app.applicationNumber === orderRef || 
        (app as any).orderRef === orderRef
      );

      if (application) {
        await storage.updateApplicationPaymentStatus(
          application.applicationNumber,
          paymentStatus === 'success' ? 'succeeded' : 'failed'
        );

        // Send email notification on successful payment
        if (paymentStatus === 'success') {
          const emailData = generateVisaReceivedEmail(
            application.firstName,
            application.lastName,
            application.applicationNumber,
            application as any
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
            'visa',
            emailData.html
          );
        }

        return res.json({ success: true, message: "Payment status updated" });
      }

      // Check insurance applications
      const insuranceApps = await storage.getInsuranceApplications();
      const insuranceApp = insuranceApps.find(app => 
        app.applicationNumber === orderRef ||
        (app as any).orderRef === orderRef
      );

      if (insuranceApp) {
        await storage.updateInsuranceApplicationPaymentStatus(
          insuranceApp.applicationNumber,
          paymentStatus === 'success' ? 'succeeded' : 'failed'
        );

        if (paymentStatus === 'success') {
          const emailData = generateInsuranceReceivedEmail(
            insuranceApp.firstName,
            insuranceApp.lastName,
            insuranceApp.applicationNumber,
            (insuranceApp as any).productName || 'Travel Insurance',
            insuranceApp as any
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
            'insurance',
            emailData.html
          );
        }

        return res.json({ success: true, message: "Insurance payment status updated" });
      }

      return res.status(404).json({ message: "Application not found" });
    } catch (error: any) {
      console.error('[Payment Status Update Error]', error);
      return res.status(500).json({ message: "Failed to update payment status" });
    }
  });

  // Test email endpoint
  app.post("/api/send-test-email", async (req, res) => {
    try {
      const { to, firstName, lastName, applicationNumber, emailType } = req.body;

      if (!to || !firstName || !lastName || !applicationNumber || !emailType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let emailData;
      
      if (emailType === 'visa_received') {
        // Mock application data for testing
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
      } else if (emailType === 'visa_approval') {
        emailData = generateVisaApprovalEmail(
          firstName,
          lastName,
          applicationNumber
        );
      } else if (emailType === 'visa_rejection') {
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
        to: to,
        from: "info@getvisa.tr",
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      });

      res.json({ 
        message: `${emailType} email sent successfully to ${to}`,
        subject: emailData.subject
      });
    } catch (error: any) {
      console.error("Error sending test email:", error);
      res.status(500).json({ 
        message: "Failed to send test email",
        error: error.message
      });
    }
  });

  // Register Paytriot payment routes
  registerPaytriotRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
