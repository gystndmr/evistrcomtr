import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build yolları
const DIST_DIR = "/var/www/evistrcomtr/dist";                 // statik dosyalar burada
const PUBLIC_DIR = "/var/www/evistrcomtr/dist/public";
const INDEX_HTML = path.join(PUBLIC_DIR, "index.html");

const app = express();

// 1) Statik dosyaları servis et (assets, css, js vs.)
app.use(express.static(DIST_DIR));
app.use(express.static(PUBLIC_DIR));

// 2) (Varsa) API route'ların burada olur
// ör: app.use("/api", apiRouter);

// 3) SPA fallback: /api dışındaki tüm GET istekleri index.html'e düşsün
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(INDEX_HTML);
});

const PORT = process.env.PORT || 5000;
const HOST = "127.0.0.1";
app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});


