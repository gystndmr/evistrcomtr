import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, CreditCard } from 'lucide-react';

interface PaymentData {
  amount: number;
  orderReference?: string;
  customerName: string;
  customerEmail: string;
  description?: string;
}

interface PaymentFormProps {
  paymentData: PaymentData;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export default function PaymentForm({ paymentData, onSuccess, onError }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Create payment with backend
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success && result.paymentUrl) {
        // Redirect to GPay payment page
        window.location.href = result.paymentUrl;
      } else {
        const errorMessage = result.error || 'Payment creation failed';
        console.error('Payment error:', errorMessage);
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      console.error('Payment request error:', error);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Ödeme Bilgileri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer-name">Ad Soyad</Label>
          <Input
            id="customer-name"
            value={paymentData.customerName}
            disabled
            className="bg-gray-50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customer-email">Email</Label>
          <Input
            id="customer-email"
            type="email"
            value={paymentData.customerEmail}
            disabled
            className="bg-gray-50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Tutar</Label>
          <Input
            id="amount"
            value={`${paymentData.amount.toFixed(2)} TL`}
            disabled
            className="bg-gray-50 font-semibold"
          />
        </div>

        {paymentData.description && (
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Input
              id="description"
              value={paymentData.description}
              disabled
              className="bg-gray-50"
            />
          </div>
        )}

        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ödeme Sayfasına Yönlendiriliyor...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Ödeme Yap ({paymentData.amount.toFixed(2)} TL)
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          GPay güvenli ödeme sistemi ile korunuyorsunuz
        </div>
      </CardContent>
    </Card>
  );
}