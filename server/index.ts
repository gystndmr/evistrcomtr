import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
let setupVite: any, serveStatic: any, log: any;

// Production için varsayılan değerler
log = console.log;
serveStatic = (app: any) => {
  app.use(express.static('dist/public'));
};

if (process.env.NODE_ENV !== "production") {
  const viteModule = await import("./vite");
  setupVite = viteModule.setupVite;
  serveStatic = viteModule.serveStatic;
  log = viteModule.log;
}
import { ChatManager } from "./websocket";
import { registerPaytriotRoutes } from "./paytriot/paytriotRoutes";

const app = express();
app.set("trust proxy", true); // Enable trust proxy for Cloudflare/proxy IP detection
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Changed to true for form data

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  // Debug API requests
  if (path.startsWith("/api")) {
    console.log(`🔍 API REQUEST: ${req.method} ${path}`);
    if (req.method === "POST") {
      console.log(`🔍 Headers:`, req.headers);
      console.log(
        `🔍 Body preview:`,
        JSON.stringify(req.body).substring(0, 100),
      );
    }
  }
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      if (log) {
        log(logLine);
      } else {
        console.log(logLine);
      }
    }
  });

  next();
});

(async () => {
  // Register Paytriot payment routes
  registerPaytriotRoutes(app);

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    if (setupVite) {
      await setupVite(app, server);
    }
  } else {
    if (serveStatic) {
      serveStatic(app);
    }
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
   () => {
  if (log) {
    log(`serving on port ${port}`);
  } else {
    console.log(`serving on port ${port}`);
  }
},
  );

  // Initialize WebSocket chat system (disabled for debugging)
  // new ChatManager(server);
})();
