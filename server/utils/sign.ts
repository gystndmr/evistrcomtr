import crypto from 'crypto';

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

export function sign(fields: Record<string, any>, secret: string): string {
  const signatureFields = { ...fields };
  delete signatureFields.signature;

  const sortedKeys = Object.keys(signatureFields).sort();
  
  const pairs = sortedKeys.map(key => {
    const value = signatureFields[key];
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return `${phpUrlEncode(key)}=${phpUrlEncode(String(value))}`;
  }).filter(Boolean);

  const messageString = pairs.join('&')
    .replace(/%0D%0A/g, '%0A')
    .replace(/%0A%0D/g, '%0A')
    .replace(/%0D/g, '%0A') + secret;

  const hash = crypto.createHash('sha512').update(messageString, 'utf8').digest('hex');
  
  return hash.toLowerCase();
}

export function verifySignature(fields: Record<string, any>, secret: string, receivedSignature: string): boolean {
  const computedSignature = sign(fields, secret);
  return computedSignature === receivedSignature;
}
