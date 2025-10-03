import { type Request } from 'express';

export function getRealClientIP(req: Request): string {
  const cfConnecting = req.headers['cf-connecting-ip'];
  if (cfConnecting && typeof cfConnecting === 'string') {
    return cfConnecting;
  }

  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const forwardedIPs = typeof xForwardedFor === 'string' ? xForwardedFor : xForwardedFor[0];
    const ips = forwardedIPs.split(',');
    const firstIp = ips[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  return req.ip || '0.0.0.0';
}
