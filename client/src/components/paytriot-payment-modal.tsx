import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaytriotPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationNumber: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (xref: string) => void;
  onError: (error: string) => void;
}

export function PaytriotPaymentModal({
  isOpen,
  onClose,
  applicationNumber,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError
}: PaytriotPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 19);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid card number",
        variant: "destructive"
      });
      return;
    }

    if (!expiryMonth || !expiryYear) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please select expiry month and year",
        variant: "destructive"
      });
      return;
    }

    if (cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid CVV code",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const amountMinor = Math.round(amount * 100);

      const response = await fetch('/api/paytriot/sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amountMinor,
          cardNumber: cleanCardNumber,
          cardExpiryMonth: expiryMonth,
          cardExpiryYear: expiryYear,
          cardCVV: cvv,
          orderRef: String(applicationNumber || ''),
          transactionUnique: `${String(applicationNumber || '')}-${Date.now()}`,
          customerName: customerName || '',
          customerEmail: customerEmail || '',
          customerPhone: customerPhone || '',
          customerIPAddress: '' // Will be detected by server
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        onSuccess(result.xref || applicationNumber);
      } else if (result.status === '3ds_required' && result.acsUrl) {
        // Create and submit 3DS form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = result.acsUrl;
        
        const mdInput = document.createElement('input');
        mdInput.type = 'hidden';
        mdInput.name = 'MD';
        mdInput.value = result.md || '';
        
        const paReqInput = document.createElement('input');
        paReqInput.type = 'hidden';
        paReqInput.name = 'PaReq';
        paReqInput.value = result.paReq || '';
        
        const termUrlInput = document.createElement('input');
        termUrlInput.type = 'hidden';
        termUrlInput.name = 'TermUrl';
        termUrlInput.value = result.termUrl || `${window.location.origin}/paytriot/3ds-callback`;
        
        form.appendChild(mdInput);
        form.appendChild(paReqInput);
        form.appendChild(termUrlInput);
        
        document.body.appendChild(form);
        form.submit();
      } else {
        onError(result.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Secure Payment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Application: {applicationNumber}
            </p>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
              Amount: ${amount.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              data-testid="input-card-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Month</Label>
              <Select value={expiryMonth} onValueChange={setExpiryMonth} required>
                <SelectTrigger id="expiryMonth" data-testid="select-expiry-month">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryYear">Year</Label>
              <Select value={expiryYear} onValueChange={setExpiryYear} required>
                <SelectTrigger id="expiryYear" data-testid="select-expiry-year">
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                data-testid="input-cvv"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                maxLength={4}
                type="password"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Lock className="w-4 h-4" />
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
              data-testid="button-cancel-payment"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700"
              data-testid="button-submit-payment"
            >
              {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
