import crypto from 'crypto';

export function sign(fields: Record<string, any>, secret: string): string {
  const signatureFields = { ...fields };
  delete signatureFields.signature;

  const sortedKeys = Object.keys(signatureFields).sort();
  
  const pairs = sortedKeys.map(key => {
    const value = signatureFields[key];
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
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
