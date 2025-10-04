import type { Express, Request, Response } from 'express';
import { PaytriotClient } from './paytriotClient';
import { getRealClientIP } from '../utils/ip';

interface PaytriotSalePayload {
  amountMinor: number;
  cardNumber: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardCVV: string;
  orderRef?: string;
  transactionUnique?: string;
  customerAddress?: string;
  customerPostCode?: string;
  customerEmail?: string;
  customerIPAddress: string;
  statementNarrative1?: string;
  statementNarrative2?: string;
}

export function registerPaytriotRoutes(app: Express): void {
  const paytriotClient = new PaytriotClient();

  const tempTransactions = new Map<string, PaytriotSalePayload>();

  app.post('/api/paytriot/sale', async (req: Request, res: Response) => {
    try {
      const {
        amountMinor,
        cardNumber,
        cardExpiryMonth,
        cardExpiryYear,
        cardCVV,
        orderRef,
        transactionUnique,
        customerAddress,
        customerPostCode,
        customerEmail,
        customerIPAddress: providedIP,
        statementNarrative1,
        statementNarrative2
      } = req.body;

      if (!amountMinor || typeof amountMinor !== 'number' || amountMinor <= 0) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Invalid amount: must be a positive number in minor units' 
        });
      }

      if (!cardNumber || !cardExpiryMonth || !cardExpiryYear || !cardCVV) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Missing card details' 
        });
      }

      const customerIPAddress = providedIP || getRealClientIP(req);

      const maskedCardNumber = cardNumber.slice(0, 6) + '****' + cardNumber.slice(-4);
      console.log('[Paytriot] Initiating sale:', { 
        amountMinor, 
        cardNumber: maskedCardNumber, 
        orderRef,
        customerIP: customerIPAddress 
      });

      const payload: PaytriotSalePayload = {
        amountMinor,
        cardNumber,
        cardExpiryMonth,
        cardExpiryYear,
        cardCVV,
        orderRef,
        transactionUnique,
        customerAddress,
        customerPostCode,
        customerEmail,
        customerIPAddress,
        statementNarrative1,
        statementNarrative2
      };

      // Store using transactionUnique as key for 3DS callback lookup
      const txKey = transactionUnique || `temp-${Date.now()}`;
      tempTransactions.set(txKey, payload);

      const result = await paytriotClient.sale(payload);

      console.log('[Paytriot] Sale result:', { 
        status: result.status, 
        xref: result.xref,
        orderRef 
      });

      // If 3DS required, re-map with MD for callback lookup
      if (result.status === '3ds_required' && result.md) {
        tempTransactions.set(result.md, payload);
        console.log('[Paytriot] 3DS required - stored transaction with MD:', result.md);
      }

      return res.json(result);
    } catch (error: any) {
      console.error('[Paytriot] Sale error:', error.message);
      return res.status(500).json({ 
        status: 'error', 
        message: error.message || 'Payment processing failed' 
      });
    }
  });

  app.post('/paytriot/3ds-callback', async (req: Request, res: Response) => {
    try {
      const { MD, PaRes } = req.body;

      console.log('[Paytriot] 3DS callback received:', { MD: MD ? 'present' : 'missing', PaRes: PaRes ? 'present' : 'missing' });

      if (!MD || !PaRes) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Missing 3DS authentication data' 
        });
      }

      const originalTransaction = tempTransactions.get(MD);

      if (!originalTransaction) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Transaction not found or expired' 
        });
      }

      const payload = {
        ...originalTransaction,
        threeDSMD: MD,
        threeDSPaRes: PaRes
      };

      const result = await paytriotClient.sale(payload);

      tempTransactions.delete(MD);

      console.log('[Paytriot] 3DS completion result:', { 
        status: result.status, 
        xref: result.xref 
      });

      if (result.status === 'success') {
        // Update payment status in database
        if (originalTransaction.orderRef) {
          try {
            const updateResponse = await fetch(`${req.protocol}://${req.get('host')}/api/payment/update-status`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderRef: originalTransaction.orderRef,
                paymentStatus: 'success',
                xref: result.xref
              })
            });
            console.log('[Paytriot] Payment status updated after 3DS:', await updateResponse.json());
          } catch (err) {
            console.error('[Paytriot] Failed to update payment status:', err);
          }
        }
        return res.redirect(`/payment-success?xref=${result.xref}&orderRef=${originalTransaction.orderRef || ''}`);
      } else {
        // Update failed status
        if (originalTransaction.orderRef) {
          try {
            await fetch(`${req.protocol}://${req.get('host')}/api/payment/update-status`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderRef: originalTransaction.orderRef,
                paymentStatus: 'failed'
              })
            });
          } catch (err) {
            console.error('[Paytriot] Failed to update payment status:', err);
          }
        }
        return res.redirect(`/payment-error?message=${encodeURIComponent(result.message || 'Payment failed')}`);
      }
    } catch (error: any) {
      console.error('[Paytriot] 3DS callback error:', error.message);
      return res.redirect(`/payment-error?message=${encodeURIComponent('3DS authentication failed')}`);
    }
  });

  app.post('/paytriot/callback', async (req: Request, res: Response) => {
    try {
      console.log('[Paytriot] Server callback received:', req.body);

      res.status(200).send('OK');
    } catch (error: any) {
      console.error('[Paytriot] Callback error:', error.message);
      res.status(500).send('Error');
    }
  });

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  console.log('[Paytriot] Routes registered successfully');
}
