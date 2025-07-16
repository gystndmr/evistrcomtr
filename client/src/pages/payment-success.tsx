import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUrlParams(params);
    
    const paymentStatus = params.get('payment');
    const transactionId = params.get('transaction');
    const orderId = params.get('order');
    
    if (paymentStatus === 'success' && transactionId && orderId) {
      toast({
        title: "Payment Successful",
        description: `Your payment has been processed successfully. Transaction ID: ${transactionId}`,
      });
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const transactionId = urlParams?.get('transaction');
  const orderId = urlParams?.get('order');
  const paymentStatus = urlParams?.get('payment');

  if (paymentStatus === 'cancelled') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <CardTitle className="text-red-600">Payment Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Your payment was cancelled. You can return to the application form to try again.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate("/application")} className="w-full">
                Return to Application
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="w-full">
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert>
            <AlertDescription>
              Your e-visa application has been submitted successfully and payment has been processed.
            </AlertDescription>
          </Alert>
          
          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Application Details</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>Application Number:</span>
                  <span className="font-mono">{orderId}</span>
                </div>
                {transactionId && (
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-xs">{transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Button onClick={() => navigate(`/status?ref=${orderId}`)} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Track Application Status
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>
              You will receive a confirmation email shortly. Your e-visa will be processed within the selected timeframe.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}