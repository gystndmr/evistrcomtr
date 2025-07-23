import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, Lock } from "lucide-react";

export default function MockGPayPayment() {
  const [, navigate] = useLocation();
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order') || '';
  const amount = urlParams.get('amount') || '';
  const merchant = urlParams.get('merchant') || '';
  const returnUrl = urlParams.get('return') || '';
  const cancelUrl = urlParams.get('cancel') || '';

  const handlePayment = async () => {
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardHolder) {
      alert('Please fill in all fields');
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Simulate GPay callback payload
      const mockPayload = {
        status: "completed",
        transactionId: `GPAY_TXN_${Date.now()}`,
        ref: orderId,
        amount: parseFloat(amount),
        orderId: orderId,
        cardLast4: paymentData.cardNumber.slice(-4),
        timestamp: new Date().toISOString()
      };
      
      // Encode like GPay does: JSON → Base64 → URL encode
      const jsonString = JSON.stringify(mockPayload);
      const base64Encoded = btoa(jsonString);
      const urlEncoded = encodeURIComponent(base64Encoded);
      
      // Redirect to success URL with payload
      window.location.href = `${returnUrl}?payload=${urlEncoded}`;
    }, 3000);
  };

  const handleCancel = () => {
    // Create cancel payload
    const cancelPayload = {
      status: "cancelled",
      transactionId: `GPAY_CANCEL_${Date.now()}`,
      ref: orderId,
      amount: parseFloat(amount),
      orderId: orderId,
      reason: "User cancelled payment"
    };
    
    const jsonString = JSON.stringify(cancelPayload);
    const base64Encoded = btoa(jsonString);
    const urlEncoded = encodeURIComponent(base64Encoded);
    
    window.location.href = `${cancelUrl}?payload=${urlEncoded}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <CreditCard className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">GPay Payment</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Secure Payment
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Lock className="h-3 w-3 mr-1" />
              SSL Encrypted
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Order ID:</span>
              <span className="text-sm text-gray-600">{orderId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Merchant:</span>
              <span className="text-sm text-gray-600">{merchant}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total Amount:</span>
              <span className="text-lg font-bold text-blue-600">${amount} USD</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardHolder">Card Holder Name</Label>
              <Input
                id="cardHolder"
                placeholder="John Doe"
                value={paymentData.cardHolder}
                onChange={(e) => setPaymentData({...paymentData, cardHolder: e.target.value})}
                disabled={processing}
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => {
                  // Format card number with spaces
                  const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                  setPaymentData({...paymentData, cardNumber: value});
                }}
                maxLength={19}
                disabled={processing}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => {
                    // Format expiry date
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
                    setPaymentData({...paymentData, expiryDate: value});
                  }}
                  maxLength={5}
                  disabled={processing}
                />
              </div>
              
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPaymentData({...paymentData, cvv: value});
                  }}
                  maxLength={3}
                  disabled={processing}
                />
              </div>
            </div>
          </div>

          {/* Payment Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={processing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {processing ? 'Processing...' : `Pay $${amount}`}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center">
            <p>🔒 Your payment information is encrypted and secure</p>
            <p>This is a test payment page simulating GPay interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}