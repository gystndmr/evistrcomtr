import type { Express, Request, Response } from "express";
import { PaytriotClient, type PaytriotResponse } from "./paytriotClient";
import { getRealClientIP } from "../utils/ip";

interface PaytriotSalePayload {
  amountMinor: number;
  cardNumber: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardCVV: string;
  orderRef?: string;
  transactionUnique?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerPostCode?: string;
  customerIPAddress: string;
  statementNarrative1?: string;
  statementNarrative2?: string;
}

export function registerPaytriotRoutes(app: Express): void {
  const paytriotClient = new PaytriotClient();

  const tempTransactions = new Map<string, PaytriotSalePayload>();

  app.post("/api/paytriot/sale", async (req: Request, res: Response) => {
    // Track the map key outside try block for proper cleanup in catch (PCI compliance)
    let txKey: string | undefined;

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
        errorUrl,
      } = req.body;

      if (!amountMinor || typeof amountMinor !== "number" || amountMinor <= 0) {
        return res.status(400).json({
          status: "error",
          message: "Invalid amount: must be a positive number in minor units",
        });
      }

      if (!cardNumber || !cardExpiryMonth || !cardExpiryYear || !cardCVV) {
        return res.status(400).json({
          status: "error",
          message: "Missing card details",
        });
      }

      // 🔴 DEĞİŞİKLİK: Müşteri IP'sini al (frontend'den gelirse onu kullan, yoksa request'ten al)
      const customerIPAddress = providedIP || getRealClientIP(req);

      // 🔴 EKLEME: IP kontrolü
      if (!customerIPAddress || customerIPAddress === "0.0.0.0") {
        console.warn(
          "[Paytriot] Warning: Could not determine customer IP address",
        );
      }

      const maskedCardNumber =
        cardNumber.slice(0, 6) + "****" + cardNumber.slice(-4);
      console.log("[Paytriot] Initiating sale:", {
        amountMinor,
        cardNumber: maskedCardNumber,
        orderRef,
        customerIP: customerIPAddress,
      });

      const payload: PaytriotSalePayload = {
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
        customerIPAddress, // ✅ Müşteri IP'si artık doğru şekilde gönderiliyor
        statementNarrative1,
        statementNarrative2,
      };

      // Store using transactionUnique as key for 3DS callback lookup
      txKey = transactionUnique || `temp-${Date.now()}`;
      if (txKey) tempTransactions.set(txKey, payload);

      const result = await paytriotClient.sale(payload);

      console.log("[Paytriot] Sale result:", {
        status: result.status,
        xref: result.xref,
        orderRef,
      });

      // Handle transaction cleanup and 3DS flow
      if (result.status === "success") {
        // CRITICAL: Purge card data immediately on direct success (PCI compliance)
        if (txKey) tempTransactions.delete(txKey);
        // ✅ DB'yi güncelle + e-posta tetikle
        try {
          const base = `${req.protocol}://${req.get("host")}`;
          const resp = await fetch(`${base}/api/payment/update-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderRef, // frontend'den gelen applicationNumber/orderRef
              paymentStatus: "success",
              xref: result.xref,
            }),
          });
          const data = await resp.json().catch(() => ({}));
          console.log("[Paytriot] update-status ->", resp.status, data);
        } catch (e: any) {
          console.warn(
            "[Paytriot] update-status call failed:",
            e?.message || e,
          );
        }
        // Başarılıysa redirect yap
        const base = `${req.protocol}://${req.get("host")}`;
        const target =
          typeof returnUrl === "string" && returnUrl.length > 0
            ? new URL(returnUrl, base) // relative path destekler
            : new URL("/payment-success", base); // default
        if (target.origin === base) {
          // open redirect koruması
          if (result.xref) target.searchParams.set("xref", result.xref);
          if (orderRef) target.searchParams.set("orderRef", orderRef);
          return res.json(result);
        }

        console.log("[Paytriot] Direct success - purged card data from memory");
        return res.json(result);
      } else if (result.status === "3ds_required" && result.md) {
        // CRITICAL: Sanitize payload before storing for 3DS (PCI compliance)
        // Remove all sensitive card data - only store minimal fields needed for callback
        const sanitizedPayload: PaytriotSalePayload = {
          amountMinor: payload.amountMinor,
          cardNumber: "", // Will be empty for 3DS continuation
          cardExpiryMonth: "",
          cardExpiryYear: "",
          cardCVV: "", // CVV must never be stored
          orderRef: payload.orderRef,
          transactionUnique: payload.transactionUnique,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          customerAddress: payload.customerAddress,
          customerPostCode: payload.customerPostCode,
          customerIPAddress: payload.customerIPAddress, // ✅ IP adresi 3DS için de saklanıyor
          statementNarrative1: payload.statementNarrative1,
          statementNarrative2: payload.statementNarrative2,
        };

        if (txKey) tempTransactions.delete(txKey);
        tempTransactions.set(result.md, sanitizedPayload);
        console.log(
          "[Paytriot] 3DS required - stored sanitized transaction (no card data) with MD:",
          result.md,
        );
      } else {
        // Error case - also purge card data
        if (txKey) tempTransactions.delete(txKey);

        // Hata durumunda opsiyonel redirect
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
    } catch (error: any) {
      console.error("[Paytriot] Sale error:", error.message);
      // CRITICAL: Purge any stored card data on exception (PCI compliance)
      if (txKey) {
        tempTransactions.delete(txKey);
        console.log(
          "[Paytriot] Exception occurred - purged card data from memory",
        );
      }
      return res.status(500).json({
        status: "error",
        message: error.message || "Payment processing failed",
      });
    }
  });

  app.post(
    "/api/paytriot/3ds-callback",
    async (req: Request, res: Response) => {
      // Bazı ACS'ler form-urlencoded gönderir → express.urlencoded zorunlu
      const MD = req.body.MD || req.body.md || req.body.Md;
      const PaRes =
        req.body.PaRes || req.body.PARES || req.body.pares || req.body.PARes;

      console.log("[Paytriot] 3DS callback received:", {
        MD: Boolean(MD),
        PaRes: Boolean(PaRes),
        contentType: req.headers["content-type"],
      });

      if (!MD || !PaRes) {
        return res.status(400).json({
          status: "error",
          message: "Missing 3DS authentication data",
        });
      }

      // Orijinal payload'ı MD ile bul
      const originalTransaction = tempTransactions.get(MD);

      if (!originalTransaction) {
        // Bazen MD yerine xref map'lenmiş olabilir; küçük bir fallback deneyebilirsin
        // const alt = tempTransactions.get(req.body.xref || '');
        // if (alt) { ... } else {
        return res.status(400).json({
          status: "error",
          message: "Transaction not found or expired",
        });
        // }
      }

      // 3DS completion çağrısı için payload
      const payload = {
        ...originalTransaction,
        threeDSMD: MD,
        threeDSPaRes: PaRes,
      };

      let result: PaytriotResponse | undefined;
      try {
        result = await paytriotClient.sale(payload);
      } catch (err: any) {
        console.error(
          "[Paytriot] 3DS completion call failed:",
          err?.message || err,
        );
        // Map'i temizleyelim ki bellek sızıntısı olmasın
        tempTransactions.delete(MD);
        // Hata ekranına yönlendir
        const msg = encodeURIComponent("3DS completion failed");
        return res.redirect(303, `/payment-error?message=${msg}`);
      }

      // Map'i TEMİZLE (başarılı/başarısız fark etmez)
      tempTransactions.delete(MD);

      console.log("[Paytriot] 3DS completion result:", {
        status: result.status,
        xref: result.xref,
      });

      // Ödeme sonucunu veritabanına yaz (mümkünse absolute URL, ama proxy trust ile req.protocol doğru gelir)
      const orderRef = originalTransaction.orderRef || "";
      const baseURL = `${req.protocol}://${req.get("host")}`;
      const updateURL = `${baseURL}/api/payment/update-status`;

      try {
        await fetch(updateURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderRef,
            paymentStatus: result.status === "success" ? "success" : "failed",
            xref: result.xref || undefined,
          }),
        });
      } catch (e) {
        console.error(
          "[Paytriot] Failed to update payment status after 3DS:",
          e,
        );
      }

      if (result.status === "success") {
        const qp = new URLSearchParams({
          xref: result.xref || "",
          orderRef,
        }).toString();
        return res.redirect(303, `/payment-success?${qp}`);
      } else {
        const msg = encodeURIComponent(result.message || "Payment failed");
        return res.redirect(303, `/payment-error?message=${msg}`);
      }
    },
  );

  app.post("/paytriot/callback", async (req: Request, res: Response) => {
    try {
      console.log("[Paytriot] Server callback received:", req.body);

      res.status(200).send("OK");
    } catch (error: any) {
      console.error("[Paytriot] Callback error:", error.message);
      res.status(500).send("Error");
    }
  });

  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  console.log(
    "[Paytriot] Routes registered successfully - Using Cloudflare Worker proxy",
  );
}
