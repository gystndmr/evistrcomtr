import type { Express } from "express";
import { gPayService } from "./payment-service";
import type { PaymentRequest } from "./payment-service";

export function registerPaymentRoutes(app: Express) {
  
  // Test GPay configuration
  app.get("/api/payment/test-config", async (req, res) => {
    try {
      const config = {
        merchantId: process.env.GPAY_MERCHANT_ID,
        hasPrivateKey: !!process.env.GPAY_PRIVATE_KEY,
        hasPublicKey: !!process.env.GPAY_PUBLIC_KEY,
        environment: process.env.NODE_ENV,
        baseUrl: process.env.NODE_ENV === 'production' 
          ? "https://getvisa.gpayprocessing.com" 
          : "https://payment-sandbox.gpayprocessing.com",
      };
      
      res.json({
        status: "GPay configuration loaded",
        config,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: `Config error: ${error}` });
    }
  });

  // Create payment endpoint
  app.post("/api/payment/create", async (req, res) => {
    try {
      const { amount, orderReference, customerName, customerEmail, description } = req.body;
      
      if (!amount || !orderReference || !customerName || !customerEmail) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: amount, orderReference, customerName, customerEmail"
        });
      }

      // Get client IP
      const clientIp = gPayService.getClientIp(req);
      
      // Build payment request
      const paymentRequest: PaymentRequest = {
        orderRef: orderReference || gPayService.generateOrderReference(),
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency: "TRY",
        orderDescription: description || "Payment",
        cancelUrl: `${process.env.DOMAIN_URL || 'http://localhost:5000'}/payment-cancel`,
        callbackUrl: `${process.env.DOMAIN_URL || 'http://localhost:5000'}/api/payment/callback`,
        notificationUrl: `${process.env.DOMAIN_URL || 'http://localhost:5000'}/api/payment/callback`,
        errorUrl: `${process.env.DOMAIN_URL || 'http://localhost:5000'}/payment-cancel`,
        paymentMethod: "ALL",
        feeBySeller: 0,
        billingFirstName: customerName.split(' ')[0] || customerName,
        billingLastName: customerName.split(' ').slice(1).join(' ') || "",
        billingStreet1: "",
        billingCity: "",
        billingCountry: "TR",
        billingEmail: customerEmail,
        customerIp: clientIp,
        merchantId: process.env.GPAY_MERCHANT_ID || ""
      };

      // Create payment with GPay
      const result = await gPayService.createPayment(paymentRequest);
      
      if (result.success) {
        res.json({
          success: true,
          paymentUrl: result.paymentUrl,
          transactionId: result.transactionId,
          formData: result.formData
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }
      
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({
        success: false,
        error: `Payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  // Payment callback endpoint
  app.post("/api/payment/callback", async (req, res) => {
    try {
      console.log("Payment callback received:", req.body);
      
      // Parse callback data
      const callbackData = req.body.payload 
        ? gPayService.parseCallback(req.body.payload)
        : req.body;
      
      if (!callbackData) {
        return res.status(400).json({ error: "Invalid callback data" });
      }

      // Here you would:
      // 1. Verify the payment status
      // 2. Update your database
      // 3. Send confirmation emails
      // 4. etc.
      
      console.log("Parsed callback data:", callbackData);
      
      res.json({ 
        status: "success",
        message: "Callback processed successfully" 
      });
      
    } catch (error) {
      console.error("Callback processing error:", error);
      res.status(500).json({ 
        error: `Callback processing failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // Payment verification endpoint
  app.get("/api/payment/verify/:transactionId", async (req, res) => {
    try {
      const { transactionId } = req.params;
      
      // Here you would query your database to check payment status
      // This is a placeholder implementation
      
      res.json({
        transactionId,
        status: "pending", // or "success", "failed"
        message: "Payment verification endpoint - implement based on your database"
      });
      
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ 
        error: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });
}