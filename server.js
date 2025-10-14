import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerPaytriotRoutes } from "./server/paytriotRoutes"; // ← kendi yoluna göre düzelt

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build yolları
const DIST_DIR   = "/var/www/evistrcomtr/dist";
const PUBLIC_DIR = "/var/www/evistrcomtr/dist/public";
const INDEX_HTML = path.join(PUBLIC_DIR, "index.html");

const app = express();

/** 1) Proxy & body parsers (3DS callback için zorunlu) */
app.set("trust proxy", true);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

/** 2) API route’ları (statiklerden önce) */
registerPaytriotRoutes(app);

/** 3) Statikler */
app.use(express.static(DIST_DIR));
app.use(express.static(PUBLIC_DIR));

/** 4) SPA fallback — /api dışı tüm GET’leri index.html’e düşür */
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(INDEX_HTML);
});

/** 5) Dinle */
const PORT = process.env.PORT || 5000;
const HOST = "127.0.0.1"; // nginx proxy_pass 127.0.0.1:5000 → bu doğru
app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});
