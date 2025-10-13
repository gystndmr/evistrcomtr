function phpUrlEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/%20/g, '+')
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/~/g, '%7E');
}

/**
 * NOTE: Body gönderirken alan sırası önemli değil; SIGNATURE ayrı hesaplanıyor.
 * Bu yüzden burada alfabetik sıralama sorun yaratmaz.
 */
export function toFormUrlEncoded(obj: Record<string, any>): string {
  const pairs: string[] = [];
  const sortedKeys = Object.keys(obj).sort();

  for (const key of sortedKeys) {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== '') {
      pairs.push(`${phpUrlEncode(key)}=${phpUrlEncode(String(value))}`);
    }
  }
  return pairs.join('&');
}

/**
 * GATEWAY'DEN GELEN FORM-ENCODED METNİ PARSE EDER.
 * ÖNEMLİ: Hem KEY hem VALUE decode edilir (PHP uyumu için '+' -> ' ' sonra decode).
 * Böylece "acquirerResponseDetails%5BschemeResponseCode%5D"
 * anahtarı düzgünce "acquirerResponseDetails[schemeResponseCode]" olur.
 */
export function fromFormUrlEncoded(str: string): Record<string, string> {
  const obj: Record<string, string> = {};
  if (!str) return obj;

  const pairs = str.split('&');
  for (const pair of pairs) {
    if (!pair) continue;

    const eq = pair.indexOf('=');
    const rawKey = eq >= 0 ? pair.slice(0, eq) : pair;
    const rawVal = eq >= 0 ? pair.slice(eq + 1) : '';

    // PHP urldecode eşdeğeri: '+' -> ' ' sonra decodeURIComponent
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const value = decodeURIComponent(rawVal.replace(/\+/g, ' '));

    obj[key] = value;
  }
  return obj;
}
