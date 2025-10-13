import crypto from "crypto";

/** PHP urlencode uyumu (space -> '+', vb.) */
function phpUrlEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/%20/g, "+")
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/~/g, "%7E");
}

/** ---- REQUEST signature (istek imzası) ----
 *  Gateway dokümanındaki sabit alansırasına göre, PHP-encode + secret + SHA-512
 */
function buildRequestSignature(fields: Record<string, any>, secret: string): string {
  // signature hariç TÜM gönderilen alanlar, ALFABETİK, PHP urlencode
  const copy: Record<string, any> = { ...fields };
  delete copy.signature;

  const pairs = Object.keys(copy)
    .sort((a, b) => a.localeCompare(b))
    .map((k) => {
      const v = copy[k];
      if (v === undefined || v === null || v === "") return null;
      return `${phpUrlEncode(k)}=${phpUrlEncode(String(v))}`;
    })
    .filter(Boolean) as string[];

  const message =
    pairs.join("&")
      .replace(/%0D%0A/g, "%0A")
      .replace(/%0A%0D/g, "%0A")
      .replace(/%0D/g, "%0A") + secret;

  return crypto.createHash("sha512").update(message, "utf8").digest("hex").toLowerCase();
}


/** ---- RESPONSE signature (cevap imzası) ----
 *  signature hariç TÜM alanlar, alfabetik; URL-encode YOK (raw),
 *  sonuna secret ekle + SHA-512
 */
function buildResponseSignature(fields: Record<string, any>, secret: string): string {
  const copy: Record<string, any> = { ...fields };
  delete copy.signature;

  const pairs = Object.keys(copy)
    .sort((a, b) => a.localeCompare(b))
    .map((k) => {
      const v = copy[k];
      if (v === undefined || v === null || v === "") return null;
      // RESPONSE için de PHP urlencode (key + value)
      return `${phpUrlEncode(k)}=${phpUrlEncode(String(v))}`;
    })
    .filter(Boolean) as string[];

  const message =
    pairs
      .join("&")
      .replace(/%0D%0A/g, "%0A")
      .replace(/%0A%0D/g, "%0A")
      .replace(/%0D/g, "%0A") + secret;

  return crypto.createHash("sha512").update(message, "utf8").digest("hex").toLowerCase();
}


/** === Eski isimler (değiştirmeden kullan) ===
 * sign            -> REQUEST imzası üretir
 * verifySignature -> RESPONSE imzasını doğrular
 */
export function sign(fields: Record<string, any>, secret: string): string {
  return buildRequestSignature(fields, secret);
}

export function verifySignature(
  fields: Record<string, any>,
  secret: string,
  receivedSignature: string
): boolean {
  const expected = buildResponseSignature(fields, secret);
  return expected === String(receivedSignature || "").toLowerCase();
}

/** (İstersen yeni isimlerle de dışa veriyorum) */
export const signRequest = buildRequestSignature;
export const signResponse = buildResponseSignature;
export function verifyResponseSignature(fields: Record<string, any>, secret: string): boolean {
  const expected = buildResponseSignature(fields, secret);
  const received = String(fields.signature || "").toLowerCase();
  return expected === received;
}
