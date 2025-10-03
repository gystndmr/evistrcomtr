export function toFormUrlEncoded(obj: Record<string, any>): string {
  const pairs: string[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value !== undefined && value !== null && value !== '') {
        const encodedValue = encodeURIComponent(String(value)).replace(/%20/g, '+');
        pairs.push(`${key}=${encodedValue}`);
      }
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
