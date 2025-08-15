import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Home, Mail, CreditCard, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState(15);
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const transactionId = urlParams.get('transactionId');
  const orderRef = urlParams.get('orderRef');
  const amount = urlParams.get('amount');

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setLocation("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setLocation]);

  // Determine service type based on order reference and amount
  const isInsurance = orderRef?.includes('ORDER_') && amount && parseFloat(amount) > 100;
  const serviceType = isInsurance ? 'Travel Insurance' : 'E-Visa Application';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center shadow-xl border-0">
        <CardHeader className="pb-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-800 mb-2">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Your {serviceType.toLowerCase()} payment has been processed
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Transaction Details */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="grid grid-cols-1 gap-4 text-left">
              {transactionId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Transaction ID:</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {transactionId.slice(-8).toUpperCase()}
                  </Badge>
                </div>
              )}
              
              {orderRef && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Order Reference:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {orderRef.slice(-8).toUpperCase()}
                  </Badge>
                </div>
              )}
              
              {amount && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-green-700">${amount} USD</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Service:</span>
                <span className="font-semibold text-blue-700">{serviceType}</span>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 text-blue-700 mb-2">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Application Status</span>
              </div>
              <p className="text-sm text-blue-600">
                Your application is now being processed by our team
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 text-purple-700 mb-2">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Email Confirmation</span>
              </div>
              <p className="text-sm text-purple-600">
                Receipt and confirmation details sent to your email
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3 text-orange-700 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Processing Time</span>
              </div>
              <p className="text-sm text-orange-600">
                {isInsurance ? 'Insurance policy issued immediately' : 'E-visa typically processed within 24-48 hours'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setLocation("/status")} 
              className="w-full border-2 border-blue-200 hover:bg-blue-50 py-3"
              size="lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              Check Application Status
            </Button>
          </div>

          {/* Auto-redirect notice */}
          <div className="bg-gray-50 p-3 rounded-lg border">
            <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Auto-redirecting to home in {countdown} seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}