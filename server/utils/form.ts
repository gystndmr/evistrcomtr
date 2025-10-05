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

export function fromFormUrlEncoded(str: string): Record<string, string> {
  const obj: Record<string, string> = {};
  const pairs = str.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      obj[key] = decodeURIComponent((value || '').replace(/\+/g, ' '));
    }
  }
  
  return obj;
}
