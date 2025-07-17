import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema, insertInsuranceApplicationSchema } from "@shared/schema";
import { z } from "zod";
import { sendEmail, generateVisaReceivedEmail, generateInsuranceReceivedEmail, generateInsuranceApprovalEmail, generateVisaApprovalEmail } from "./email";
import { gloDiPayService } from "./payment-new";

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
      const validatedData = insertApplicationSchema.parse({
        ...req.body,
        applicationNumber: generateApplicationNumber(),
        dateOfBirth: new Date(req.body.dateOfBirth),
        arrivalDate: new Date(req.body.arrivalDate),
      });

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
          from: 'info@evisatr.xyz',
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

  // Get insurance products
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
      const validatedData = insertInsuranceApplicationSchema.parse({
        ...req.body,
        applicationNumber: generateApplicationNumber(),
        travelDate: new Date(req.body.travelDate),
        returnDate: new Date(req.body.returnDate),
      });

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
          from: 'info@evisatr.xyz',
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });
        
        console.log(`Insurance application received email sent to ${application.email}`);
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
        { code: "RUS", name: "Russian Federation", isEligible: false, requiresSupportingDocs: false },
        { code: "BRA", name: "Brazil", isEligible: false, requiresSupportingDocs: false },
        { code: "NGA", name: "Nigeria", isEligible: false, requiresSupportingDocs: false },
        { code: "SYR", name: "Syria", isEligible: false, requiresSupportingDocs: false },
        { code: "IRN", name: "Iran", isEligible: false, requiresSupportingDocs: false },
      ];

      for (const countryData of countriesData) {
        const existing = await storage.getCountryByCode(countryData.code);
        if (!existing) {
          await storage.createCountry(countryData);
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

  // Admin routes
  app.get("/api/admin/applications", async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/admin/insurance-applications", async (req, res) => {
    try {
      const applications = await storage.getAllInsuranceApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching insurance applications:", error);
      res.status(500).json({ message: "Failed to fetch insurance applications" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      const insuranceApplications = await storage.getAllInsuranceApplications();
      
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

  // Update application status (admin)
  app.patch("/api/admin/applications/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      await storage.updateApplicationStatus(parseInt(id), status);
      
      // Durum değişikliğine göre e-posta gönder
      const application = await storage.getApplication(parseInt(id));
      if (application) {
        try {
          if (status === 'approved') {
            const emailContent = generateVisaApprovalEmail(
              application.firstName, 
              application.lastName, 
              application.applicationNumber
            );
            
            await sendEmail({
              to: application.email,
              from: 'info@visatanzania.org',
              subject: emailContent.subject,
              html: emailContent.html,
              text: emailContent.text
            });
            
            console.log(`Visa approval email sent to ${application.email}`);
          } else if (status === 'rejected') {
            // Reddedilmiş e-posta için geçici olarak normal approval fonksiyonu kullanacağım
            const emailContent = generateVisaApprovalEmail(
              application.firstName, 
              application.lastName, 
              application.applicationNumber
            );
            
            // E-posta içeriğini reddedilmiş olarak değiştir
            const rejectionEmailContent = {
              subject: `[${application.applicationNumber}] Turkey E-Visa Application Status Update`,
              html: emailContent.html.replace('approved', 'declined').replace('APPROVED', 'DECLINED'),
              text: emailContent.text.replace('approved', 'declined').replace('APPROVED', 'DECLINED')
            };
            
            await sendEmail({
              to: application.email,
              from: 'info@visatanzania.org',
              subject: rejectionEmailContent.subject,
              html: rejectionEmailContent.html,
              text: rejectionEmailContent.text
            });
            
            console.log(`Visa rejection email sent to ${application.email}`);
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

  // Update insurance application status (admin)
  app.patch("/api/admin/insurance-applications/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Sigorta için status güncelleme fonksiyonu storage'a eklenmeli
      const application = await storage.getInsuranceApplicationById(parseInt(id));
      if (!application) {
        return res.status(404).json({ message: "Insurance application not found" });
      }
      
      await storage.updateInsuranceApplicationStatus(parseInt(id), status);
      
      // Durum değişikliğine göre e-posta gönder
      if (status === 'approved') {
        try {
          const product = application.productId ? await storage.getInsuranceProduct(application.productId) : null;
          const productName = product ? product.name : 'Travel Insurance';
          
          const emailContent = generateInsuranceApprovalEmail(
            application.firstName, 
            application.lastName, 
            application.applicationNumber,
            productName
          );
          
          await sendEmail({
            to: application.email,
            from: 'info@visatanzania.org',
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
          });
          
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
            from: 'info@visatanzania.org',
            subject: rejectionEmailContent.subject,
            html: rejectionEmailContent.html,
            text: rejectionEmailContent.text
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

  // Create payment
  app.post("/api/payment/create", async (req, res) => {
    try {
      const { amount, currency, orderId, description, customerEmail, customerName } = req.body;
      
      if (!amount || !currency || !orderId || !customerEmail || !customerName) {
        return res.status(400).json({ message: "Missing required payment fields" });
      }
      
      // Get current domain for callback URLs
      const currentDomain = req.get('host') || 'localhost:5000';
      const protocol = req.secure || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
      const baseUrl = `${protocol}://${currentDomain}`;
      
      const paymentRequest = {
        amount: parseFloat(amount),
        currency,
        orderId,
        description: description || `E-Visa Application - ${orderId}`,
        customerEmail,
        customerName,
        returnUrl: `${baseUrl}/payment-success?payment=success&order=${orderId}`,
        cancelUrl: `${baseUrl}/payment-success?payment=cancelled&order=${orderId}`
      };
      
      const paymentResponse = await gloDiPayService.createPayment(paymentRequest);
      
      if (paymentResponse.success) {
        res.json({
          success: true,
          paymentUrl: paymentResponse.paymentUrl,
          transactionId: paymentResponse.transactionId
        });
      } else {
        res.status(400).json({
          success: false,
          error: paymentResponse.error
        });
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({ message: "Payment service error" });
    }
  });
  
  // Verify payment
  app.post("/api/payment/verify", async (req, res) => {
    try {
      const { transactionId, signature } = req.body;
      
      if (!transactionId || !signature) {
        return res.status(400).json({ message: "Missing transaction ID or signature" });
      }
      
      const isValid = await gloDiPayService.verifyPayment(transactionId, signature);
      
      res.json({
        success: isValid,
        status: isValid ? 'verified' : 'invalid'
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ message: "Payment verification error" });
    }
  });
  
  // Test GPay callback - for testing the callback handling logic
  app.post("/api/payment/test-callback", async (req, res) => {
    try {
      // Simulate GPay callback payload following .NET pattern
      const testPayload = {
        status: "completed",
        transactionId: "TEST_TXN_123456",
        ref: "TEST_REF_789",
        amount: 114.00,
        orderId: "TRMD6K1VBP9YRYQ1"
      };
      
      // Encode like GPay does: JSON → Base64 → URL encode
      const jsonString = JSON.stringify(testPayload);
      const base64Encoded = Buffer.from(jsonString, 'utf8').toString('base64');
      const urlEncoded = encodeURIComponent(base64Encoded);
      
      console.log("Test GPay callback payload:", testPayload);
      console.log("Encoded payload:", urlEncoded);
      
      // Simulate the callback processing
      const { payload } = { payload: urlEncoded };
      
      // Following .NET pattern: URL decode → Base64 decode → JSON parse
      const urlDecoded = decodeURIComponent(payload);
      const base64Decoded = Buffer.from(urlDecoded, 'base64').toString('utf8');
      const paymentData = JSON.parse(base64Decoded);
      
      console.log("GPay callback processed:", paymentData);
      
      const { status, transactionId, ref, amount, orderId } = paymentData;
      
      // Following .NET pattern: Update database based on payment status
      if (status === 'completed' || status === 'successful') {
        console.log(`✅ Payment successful for order ${orderId}: ${transactionId}`);
        // TODO: Update application status to payment completed
      } else if (status === 'failed' || status === 'error') {
        console.log(`❌ Payment failed for order ${orderId}: ${transactionId}`);
        // TODO: Update application status to payment failed
      }
      
      res.json({ 
        message: "Test callback processed successfully",
        decodedPayload: paymentData,
        processingStatus: "OK"
      });
    } catch (error) {
      console.error("Test GPay callback error:", error);
      res.status(500).json({ message: "Test callback processing error" });
    }
  });
  
  // GloDiPay result callback - following .NET GPayResult pattern
  app.post("/api/payment/callback", async (req, res) => {
    try {
      const { payload } = req.body;
      
      if (!payload) {
        console.log("GloDiPay callback: payload BOŞ GELDİ!!!");
        return res.status(400).json({ message: "Payload yok!" });
      }
      
      // Following .NET pattern: URL decode -> Base64 decode -> JSON parse
      const urlDecoded = decodeURIComponent(payload);
      const base64Decoded = Buffer.from(urlDecoded, 'base64').toString('utf8');
      const paymentData = JSON.parse(base64Decoded);
      
      console.log("GloDiPay callback received:", paymentData);
      
      const { status, transactionId, ref, amount, orderId } = paymentData;
      
      // Following .NET pattern: Update database based on payment status
      if (status === 'completed' || status === 'successful') {
        console.log(`Payment successful for order ${orderId}: ${transactionId}`);
        // TODO: Update application status to payment completed
        // await storage.updateApplicationPaymentStatus(orderId, 'completed', amount);
      } else if (status === 'failed' || status === 'error') {
        console.log(`Payment failed for order ${orderId}: ${transactionId}`);
        // TODO: Update application status to payment failed
        // await storage.updateApplicationPaymentStatus(orderId, 'failed', amount);
      }
      
      res.json({ message: "OK" });
    } catch (error) {
      console.error("GloDiPay callback error:", error);
      res.status(500).json({ message: "Callback processing error" });
    }
  });
  
  // Payment success callback - following .NET OdemeBasarili pattern
  app.get("/payment/success", async (req, res) => {
    try {
      const { payload } = req.query;
      
      if (!payload) {
        return res.redirect(`/payment-success?payment=error&message=Payload yok`);
      }
      
      // Following .NET pattern: URL decode -> Base64 decode -> JSON parse
      const urlDecoded = decodeURIComponent(payload);
      const base64Decoded = Buffer.from(urlDecoded, 'base64').toString('utf8');
      const paymentData = JSON.parse(base64Decoded);
      
      console.log("Payment success callback:", paymentData);
      
      const { status, transactionId, ref, amount, orderId } = paymentData;
      
      if (status === 'completed' || status === 'successful') {
        // TODO: Update application status to payment successful
        // await storage.updateApplicationPaymentStatus(orderId, 'completed', amount);
        res.redirect(`/payment-success?payment=success&transaction=${transactionId}&order=${orderId}`);
      } else {
        res.redirect(`/payment-success?payment=error&transaction=${transactionId}&order=${orderId}`);
      }
    } catch (error) {
      console.error("Payment success callback error:", error);
      res.redirect(`/payment-success?payment=error&message=Processing error`);
    }
  });
  
  // Payment cancel callback - following .NET OdemeBasarisiz pattern
  app.get("/payment/cancel", async (req, res) => {
    try {
      const { payload } = req.query;
      
      if (!payload) {
        return res.redirect(`/payment-success?payment=cancelled&message=Payload yok`);
      }
      
      // Following .NET pattern: URL decode -> Base64 decode -> JSON parse
      const urlDecoded = decodeURIComponent(payload);
      const base64Decoded = Buffer.from(urlDecoded, 'base64').toString('utf8');
      const paymentData = JSON.parse(base64Decoded);
      
      console.log("Payment cancel callback:", paymentData);
      
      const { status, transactionId, ref, amount, orderId } = paymentData;
      
      // TODO: Update application status to payment cancelled
      // await storage.updateApplicationPaymentStatus(orderId, 'cancelled', amount);
      
      res.redirect(`/payment-success?payment=cancelled&transaction=${transactionId}&order=${orderId}`);
    } catch (error) {
      console.error("Payment cancel callback error:", error);
      res.redirect(`/payment-success?payment=cancelled&message=Processing error`);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
